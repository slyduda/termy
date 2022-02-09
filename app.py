import os
import asyncio
from datetime import timedelta
import schedule

from quart import Quart, make_response, render_template, request, jsonify, url_for, current_app, redirect, send_from_directory 
import quart.flask_patch
from quart.utils import run_sync
from quart_cors import cors
from quart_rate_limiter import RateLimiter, rate_limit

from pony.orm import db_session, desc

from store.database import Game, Word, db

from config import LocalConfig, ProductionConfig

app = Quart(__name__)
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


if app.config['TYPE'] == 'local':
    app = cors(app,
               allow_headers=["content-type", "x-csrf-token"],
               allow_credentials=True,
               allow_methods=["POST", "PUT", "DELETE", "GET"],
               allow_origin=["http://localhost:3000", "http://localhost:4000"]
               )

if app.config['TYPE'] == 'prod':
    app = cors(app,
               allow_headers=["content-type", "x-csrf-token"],
               allow_credentials=True,
               allow_methods=["POST", "PUT", "DELETE", "GET"],
               allow_origin=["https://termy.gg"]
               )


db.bind('sqlite', filename='database.sqlite', create_db=True)
db.generate_mapping(create_tables=True)

WORDS = {}
RESET_DATETIME = ""
ID = 1


@app.route('/manifest.json')
@app.route('/browserconfig.xml')
@app.route('/robots.txt')
@app.route('/sitemap.xml')
@rate_limit(5, timedelta(minutes=5))
async def static_from_root():
    return await send_from_directory(app.static_folder, request.path[1:])


@app.route('/')
@rate_limit(5, timedelta(minutes=5))
async def catch_all():
    return await render_template("index.html", five="ZEBRA", six="TAMALE", game_id=1, payload=400)


@app.route('/submit')
@rate_limit(5, timedelta(minutes=30))
async def submit():
    data = await request.get_json()

    guesses = data.get('guesses')
    started_on = data.get('startedOn')
    ended_on = data.get('endedOn')
    length = data.get('length')
    mode = data.get('mode')
    won = data.get('won')

    required = [guesses, started_on, ended_on, length, mode, won]
    if any(x is None for x in required):
        return jsonify({'error': 'Missing required fields'}), 400

    game = Game(guesses=guesses, started_on=started_on, ended_on=ended_on, length=length, mode=mode, won=won)

    if game:
        return jsonify({'game': game}), 200
    return jsonify({'error': 'Error saving game.'}), 400


def daily_reset():
    data = None
    words = None
    with open('words.txt', 'r') as fin:
        data = fin.read().splitlines(True)
    with open('words.txt', 'w') as fout:
        words = data[0]
        fout.writelines(data[1:])
    words = words.split(',')
    WORDS['classic'] = words[0]
    WORDS['plus'] = words[1][:-1]
    print(WORDS)

    with db_session:
        Word(id=ID, mode="classic", word=WORDS['classic'])
        Word(id=ID, mode="plus", word=WORDS['plus'])


def load_words():
    with db_session:
        if not Word.select().exists():
            daily_reset()
         
        word = Word.select().order_by(lambda p: desc(p.created_on))[:][0]
        ID = word.id
        words = Word.select(lambda w: w.id == word.id)[:]
        
        for w in words:
            WORDS[w.mode] = w.word


async def run_scheduler():
    while True:
        schedule.run_pending()


@app.before_serving
async def startup():
    # load_words()
    schedule.every().minute.at(":14").do(daily_reset)
    app.background_task = asyncio.ensure_future(run_scheduler())


if __name__ == '__main__':
    from argparse import ArgumentParser
    # Load this config object for development mode
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', type=int, default=5000)
    args = parser.parse_args()
    port = args.port
    app.run(host='0.0.0.0', port=port)