from pony.orm import Database, db_session, commit, rollback, exists
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
    session = Required(uuid.UUID)

    guesses = Required(str)
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