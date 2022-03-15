MAX_LENGTH = 12

ALPHABET = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'Ω' # Omaga character will get sorted after all
]

from itertools import combinations_with_replacement

perms = combinations_with_replacement(ALPHABET, MAX_LENGTH)

results = [''.join(sorted(perm)) for perm in perms]

print(len(sorted(list(set(results)))))