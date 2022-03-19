from pony.orm import Database, db_session, commit, rollback, exists, select
from pony.orm import PrimaryKey, Set, Optional, Required

import uuid
import random
import string
from datetime import datetime

db = Database()

class Game(db.Entity):
    '''
        The table where game data is stored to do simple analytics.
    '''
    _table_ = 'games'
    id = PrimaryKey(uuid.UUID, default=uuid.uuid4)
    puzzle = Required(int)
    session = Required(uuid.UUID)

    guesses = Required(str, max_len=100)
    started_on = Required(datetime)
    ended_on = Required(datetime)
    length = Required(int)
    mode = Optional(str)
    won = Required(bool)


class Word(db.Entity):
    '''
        The persisten table where words are stored.
    '''
    _table_ = 'words'
    id = Required(int)
    word = Required(str)

    created_on = Required(datetime, default=datetime.utcnow)
    mode = Required(str)

    PrimaryKey(id, mode)

@db_session
def waterfall_submit(games):
    '''

    '''
    posted_games = []
    for game in games:
        is_game = select(g for g in Game if g.mode == game['mode'] and g.session == uuid.UUID(game['session']) and g.puzzle == game['puzzleId']).exists()
        if is_game:
            continue

        g = Game(
            puzzle=game["puzzleId"],
            session=uuid.UUID(game["session"]), 
            guesses=','.join(game["guesses"]), 
            started_on=datetime.utcfromtimestamp(game["startedOn"]/1000), 
            ended_on=datetime.utcfromtimestamp(game["endedOn"]/1000),
            length=game["length"], 
            mode=game["mode"], 
            won=game["won"]
        )

        posted_game = g.to_dict()
        posted_games.append(posted_game)

    return posted_games