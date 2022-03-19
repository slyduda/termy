import pytest
import os

from .constants import LIST5, LIST6

dir_path = os.path.dirname(os.path.realpath(__file__))
# Checks the words.txt to make sure the file is good

def test_words():
    words = None
    with open(dir_path+'/../words.txt', 'r') as fin:
        words = fin.read().splitlines(True)

    for word in words:
        five, six = word.strip().split(',')
        assert len(five) == 5
        assert five.lower() in LIST5
        assert len(six) == 6
        assert six in LIST6