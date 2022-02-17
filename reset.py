import os

from pony.orm import db_session, desc
from store.database import Word, db

WORDS = {}
ID = 0

db.bind('sqlite', filename='database.sqlite', create_db=True)
db.generate_mapping(create_tables=True)

def daily_reset():
    global WORDS, ID
    data = None
    words = None
    with open('words.txt', 'r') as fin:
        data = fin.read().splitlines(True)
    with open('words.txt', 'w') as fout:
        words = data[0]
        fout.writelines(data[1:])
    words = words.split(',')

    ID += 1
    WORDS['classic'] = words[0].strip()
    WORDS['plus'] = words[1].strip()
    
    with db_session:
        Word(id=ID, mode="classic", word=WORDS['classic'])
        Word(id=ID, mode="plus", word=WORDS['plus'])


# Get the most recent ID and add by 1
with db_session:
    word = Word.select().order_by(lambda p: desc(p.created_on))[:][0]
    ID = word.id

# Add new words
daily_reset()
