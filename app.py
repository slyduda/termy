import os
import asyncio
import hashlib
import json
import uuid
from datetime import timedelta, datetime, date
# import aioschedule as schedule

from quart import Quart, make_response, render_template, request, jsonify, url_for, current_app, redirect, send_from_directory 
import quart.flask_patch
from quart.utils import run_sync
from quart_cors import cors
from quart_rate_limiter import RateLimiter, rate_limit

from pony.orm import db_session, desc

from constants.rates import CatchupRate, SubmitRate, StaticRate, IndexRate
from store.database import Game, Word, db, waterfall_submit

from config import LocalConfig, ProductionConfig

app = Quart(__name__, template_folder='app/dist')
rate_limiter = RateLimiter(app)


# Get the app config
CONFIG_TYPE = os.environ.get('ENV_TYPE')
if not CONFIG_TYPE:
    print('A config type was not passed')
    exit()
elif CONFIG_TYPE == 'local':
    print('Local configuration was selected')
    app.config.from_object(LocalConfig)
elif CONFIG_TYPE == 'prod':
    print('Production configuration was selected')
    app.config.from_object(ProductionConfig)


jinja_options = app.jinja_options.copy()
jinja_options.update(dict(
    variable_start_string='{@',
    variable_end_string='@}'
))
app.jinja_options = jinja_options
app.static_url_path=app.config.get('STATIC_FOLDER')
app.static_folder=str(app.root_path) + '/' + app.static_url_path


if app.config['TYPE'] == 'local':
    app = cors(app,
               allow_headers=["content-type", "x-csrf-token"],
               allow_credentials=True,
               allow_methods=["POST", "PUT", "DELETE", "GET"],
               allow_origin=["http://192.168.1.5:3000"]
               )

if app.config['TYPE'] == 'prod':
    app = cors(app,
               allow_headers=["content-type", "x-csrf-token"],
               allow_credentials=True,
               allow_methods=["POST", "PUT", "DELETE", "GET"],
               allow_origin=["https://termy.gg"]
               )

dir_path = os.path.dirname(os.path.realpath(__file__))

db.bind('sqlite', filename='database.sqlite', create_db=True)
db.generate_mapping(create_tables=True)

WORDS = {}
today = date.today()
RESET_DATETIME = datetime(day=today.day, month=today.month, year=today.year) + timedelta(days=1)
ID = 0


@app.route('/manifest.json')
@app.route('/browserconfig.xml')
@app.route('/robots.txt')
@app.route('/sitemap.xml')
@rate_limit(*StaticRate)
async def static_from_root():
    return await send_from_directory(app.static_folder, request.path[1:])


@app.route('/')
@rate_limit(*IndexRate)
async def index():
    global WORDS, ID, RESET_DATETIME
    delta = round((RESET_DATETIME - datetime.now()).total_seconds())
    
    # If the daily_reset time has passed load the new word expecting the chron job has finished
    if (delta < 0):
        delta = await load_words() # get the new delta if it has been updated

    return await render_template("index.html", five=WORDS['classic'], six=WORDS['plus'], game_id=ID, payload=delta)


@app.route('/staging')
@rate_limit(*IndexRate)
async def staging():
    global WORDS, ID, RESET_DATETIME
    delta = round((RESET_DATETIME - datetime.now()).total_seconds())
    
    # If the daily_reset time has passed load the new word expecting the chron job has finished
    if (delta < 0):
        delta = await load_words() # get the new delta if it has been updated

    return await render_template("staging.html", five=WORDS['classic'], six=WORDS['plus'], game_id=ID, payload=delta)


async def hash_game(g):
    g['id'] = str(g['id'])
    g['session'] = str(g['session'])
    g['ended_on'] = str(g['ended_on'])
    g['started_on'] = str(g['started_on'])
    payload = json.dumps(g)
    salted_payload = payload + app.config.get('HASH_SALT')
    h = hashlib.md5(salted_payload.encode())
    hash = h.hexdigest()
    return hash


@app.route('/submit', methods=['POST'])
@rate_limit(*SubmitRate)
async def submit():
    global ID
    data = await request.get_json()

    id = data.get('id')
    if id:
        id = int(id)
    session = data.get('session')
    if session:
        session = uuid.UUID(session)
    guesses = data.get('guesses')
    started_on = data.get('startedOn')
    if started_on:
        started_on = datetime.utcfromtimestamp(started_on/1000)
    ended_on = data.get('endedOn')
    if ended_on:
        ended_on = datetime.utcfromtimestamp(ended_on/1000)
    length = data.get('length')
    mode = data.get('mode')
    won = data.get('won')

    required = [id, session, guesses, started_on, ended_on, length, mode, won]
    if any(x is None for x in required):
        return jsonify({'error': 'Missing required fields.'}), 400
    if id != ID:
        return jsonify({'error': 'Old puzzle.'}), 400

    game = None
    with db_session:
        game = Game(
            puzzle=id,
            session=session, 
            guesses=guesses, 
            started_on=started_on, 
            ended_on=ended_on, 
            length=length, 
            mode=mode, 
            won=won
        )

    if game:
        g = game.to_dict()
        h = await hash_game(g)
        return jsonify({'id': g['id'], 'hash': h, 'hash_version': '1.0'}), 200
    return jsonify({'error': 'Error saving game.'}), 400

@app.route('/catchup', methods=['POST'])
@rate_limit(*CatchupRate)
async def catchup():
    global ID
    data = await request.get_json()

    session = data.get('session')
    if session:
        session = uuid.UUID(session)
    games = data.get('games')
    
    required = [session, games]
    if any(x is None for x in required):
        return jsonify({'error': 'Missing required fields.'}), 400
    
    valid_games = []
    for game in games:
        id = game.get('puzzleId')
        guesses = game.get('guesses')
        started_on = game.get('startedOn')
        if started_on:
            started_on = datetime.utcfromtimestamp(started_on/1000)
        ended_on = game.get('endedOn')
        if ended_on:
            ended_on = datetime.utcfromtimestamp(ended_on/1000)
        length = game.get('length')
        mode = game.get('mode')
        won = game.get('won')
        required = [id, guesses, started_on, ended_on, length, mode, won]
        if any(x is None for x in required):
            continue
        valid_games.append(game)

    results = waterfall_submit(valid_games)
    if results:
        hashed_results = []
        for result in results:
            h = await hash_game(result)
            hashed_results.append({**result ,'id': result['id'], 'hash': h, 'hash_version': '1.0'})
        return jsonify({"games": hashed_results}), 200

    return jsonify({'games': []}), 200 # Better to pass back updated catchups


async def daily_reset():
    global WORDS, ID, RESET_DATETIME
    data = None
    words = None
    with open(dir_path + '/words.txt', 'r') as fin:
        data = fin.read().splitlines(True)
    with open(dir_path + '/words.txt', 'w') as fout:
        words = data[0]
        fout.writelines(data[1:])
    words = words.split(',')
    
    ID += 1
    RESET_DATETIME = datetime(day=today.day, month=today.month, year=today.year) + timedelta(days=1)
    WORDS['classic'] = words[0].strip()
    WORDS['plus'] = words[1].strip()
    print(WORDS, ID, RESET_DATETIME)

    with db_session:
        Word(id=ID, mode="classic", word=WORDS['classic'])
        Word(id=ID, mode="plus", word=WORDS['plus'])


async def load_words():
    global WORDS, ID, RESET_DATETIME
    
    with db_session:
        # If there are no words in the Word table perform a daily_reset (usually is a cron job)
        if not Word.select().exists():
            await daily_reset()
         
        word = Word.select().order_by(lambda p: desc(p.created_on))[:][0]
        
        # If a new word was not detected do not change anything
        # The chron job could still be working on adding the new word
        if word.id == ID:
            return round((RESET_DATETIME - datetime.now()).total_seconds())
        
        ID = word.id
        words = Word.select(lambda w: w.id == word.id)[:]
        
        for w in words:
            WORDS[w.mode] = w.word

        RESET_DATETIME = datetime(day=today.day, month=today.month, year=today.year) + timedelta(days=1)
        return round((RESET_DATETIME - datetime.now()).total_seconds())


@app.before_serving
async def startup():
    await load_words()
    # schedule.every(1).minutes.do(daily_reset)
    # app.add_background_task(run_pending)
    # asyncio.ensure_future(run_pending())
    # asyncio.get_running_loop().run_in_executor(None, pending())
    # Schedule a separate chron job on server


if __name__ == '__main__':
    from argparse import ArgumentParser
    # Load this config object for development mode
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', type=int, default=5000)
    args = parser.parse_args()
    port = args.port
    app.run(host='0.0.0.0', port=port)
