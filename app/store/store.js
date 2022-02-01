import { createStore } from "vuex" 

const ALPHABET = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M'
]

function characterInWord(guess, word) {
    return word.includes(guess)
}

function unique(str) {
    var result = '';
    for(var i = 0; i < str.length; i++) {
        if(result.indexOf(str[i]) < 0) {
        result += str[i];
        }
    }
    return result;
  }

function checkGuesses( guess , solution ) {
    const result = []
    for (let i = 0; i < guess.length; i++) {
        const char = guess[i] 
        const result = solution.includes(char, i);
        
    }
    
}

const store = createStore({
   state:{
        solution: "birds",
        guesses: []
   },
   getters: {
    guessResults: state => {
        const results = []
        const solutionCharacters = state.solution.split("")
        
        for (let i = 0; i < guesses.length; i++ ) {
            const guessCharacters = state.guesses[i].split("")
            
            results.push(guessResult)
        }
        return results
    },
    charAttempts: state => {
        const joined = state.guesses.join()
        return unique(joined)
    },
    charSolutions: state => {
        return Object.fromEntries(ALPHABET.map(k => [k, characterInWord(k, state.solution) ]))
    },
    charStatuses: state => {
      return Object.fromEntries(ALPHABET.map(k => [k, characterInWord(k, state.solution) ]))
    }
  }
})

export default store
