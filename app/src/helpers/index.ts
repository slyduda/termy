export function unique(str: string): string {
  var result = '';
  for (var i = 0; i < str.length; i++) {
    if (result.indexOf(str[i]) < 0) {
      result += str[i];
    }
  }
  return result;
}

export function checkGuesses(guesses: string[], solution: string) {
  // Probably can optimize with some matches
  const result = Array(guesses.length).fill(0);

  // Check for CORRECT characters
  for (let i = 0; i < guesses.length; i++)
    if (guesses[i] === solution[i]) result[i] = 2;
  // Check for PRESENT characters
  for (let i = 0; i < guesses.length; i++) {
    if (result[i] === 2) continue; // Skip if the character was already marked as correct

    const matches = [];
    for (let j = 0; j < guesses.length; j++)
      if (guesses[i] === guesses[j]) matches.push(j); // Get all character indeces in the same guesses

    let presentMatches = 0;
    let correctMatches = 0;
    for (let j = 0; j < matches.length; j++) {
      const index = matches[j];
      if (result[index] === 2) correctMatches += 1;
      if (result[index] === 1) presentMatches += 1;
    }

    let charInSolutionCount = 0;
    for (let j = 0; j < solution.length; j++)
      if (guesses[i] === solution[j]) charInSolutionCount += 1;

    if (correctMatches + presentMatches < charInSolutionCount) result[i] = 1;
  }

  return guesses.map((k, i) => [k, result[i]]);
}
