import { createStore } from "vuex" 
import { LIST5, LIST6 } from "../constants"


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
    // Probably can optimize with some matches
    const result = Array(guess.length).fill(0)
    
    // Check for CORRECT characters
    for (let i = 0; i < guess.length; i++) if ( guess[i] === solution[i] ) result[i] = 2
    // Check for PRESENT characters
    for (let i = 0; i < guess.length; i++) {
        if (result[i] === 2) continue // Skip if the character was already marked as correct
        
        const matches = []
        for (let j = 0; j < guess.length; j++) if (guess[i] === guess[j]) matches.push(j) // Get all character indeces in the same guess
    
        let presentMatches = 0
        let correctMatches = 0
        for (let j = 0; j < matches.length; j++) {
            const index = matches[j]
            if (result[index] === 2) correctMatches += 1
            if (result[index] === 1) presentMatches += 1
        }
        
        let charInSolutionCount = 0
        for (let j = 0; j < solution.length; j++) if (guess[i] === solution[j]) charInSolutionCount += 1
        
        if ( correctMatches + presentMatches < charInSolutionCount ) result[i] = 1
    }

    return guess.map((k, i) => [k, result[i]]);
}



const store = createStore({
   state:{
        terms: {
            classic: "ORGAN",
            plus: "PILLOW"
        },
        solution: "ORGAN",
        guesses: [],
        length: 5,
        tries: 6,
        current: '',
        celebrated: false,
        startTime: null,
        endTime: null,
        modesTimeChallenge: false,
        time: 60000,
        alert: ""
   },
   actions: {
        switchMode(context) {
            context.dispatch('refreshState')
            context.commit('plusMode')
        }, 
        refreshState(context) {
            context.commit('refreshState')  
        },
        setState(context, payload) {
            context.commit('setState', payload)
        },
        timeChallenge(context) {
            context.commit('timeChallenge')
        },
        plusMode(context) {
            if (context.state.current.length > 0 || context.state.guesses.length > 0) return
            context.commit('plusMode')
        },
        alert(context, payload) {
            context.commit('alert', payload)
        },
        submit (context) {
            if (context.state.length === 5) {
                if ( LIST5.indexOf(context.state.current.toLowerCase()) < 0 ) {
                    context.commit('alert', 'Not valid')
                    return
                }
                
                context.commit('submit')
            } else {
                if ( LIST6.indexOf(context.state.current.toUpperCase()) < 0 ) {
                    context.commit('alert', 'Not valid')
                    return
                }
                context.commit('submit')
            }
            if (context.getters.won && !context.state.celebrated) context.commit('celebrate')
        },
        addLetter (context, payload) {
            if (context.state.current.length >= context.state.length) return
            context.commit('addLetter', payload)
        },
        removeLetter (context) {
            context.commit('removeLetter')
        },
        fail (context) {
            context.commit('celebrate')
        }
   },
   mutations: {
        refreshState(state) {
            if (state.length === 5) state.solution = state.terms.classic
            if (state.length === 6) state.solution = state.terms.plus 
            state.guesses = []
            state.celebrated = false
            state.startTime = null
            state.endTime = null
        },
        setState(state, payload) {
            state.terms = {
                classic: payload.five,
                plus: payload.six
            }
            console.log(state.terms.classic)
            console.log(state.terms.plus)
        },
        alert(state, payload) {
            state.alert = payload
            setTimeout(() => {
                state.alert = ""
            } , 5000)
        },
        timeChallenge(state) {
            state.modeTimeChallenge = !state.modeTimeChallenge
        },
        plusMode(state) {
            if (state.length === 5) {
                state.solution = state.terms.plus
                state.length = 6
            } else {
                state.solution = state.terms.classic
                state.length = 5
            }
        },
        submit (state) {
            if (state.guesses.length === 0) {
                const d = new Date()
                state.startTime = d.getTime();
            }
            state.guesses.push(state.current)
            state.current = ''
        },
        celebrate(state) {
            if (state.modesTimeChallenge) {
                state.endTime = state.startTime + state.time
            } else {
                const d = new Date()
                state.endTime = d.getTime();
            }
            state.celebrated = true
        },
        addLetter(state, payload) {
            state.current += payload
        },
        removeLetter(state) {
            state.current = state.current.slice(0, -1)
        }
   },
   getters: {
    guessResults: state => {
        const results = []
        const solutionCharacters = state.solution.split("")
        
        for (let i = 0; i < state.guesses.length; i++ ) {
            const guessCharacters = state.guesses[i].split("")
            const guessResult = checkGuesses(guessCharacters, solutionCharacters)
            results.push(guessResult)
        }
        return results // [ [ [a , 2], [b, 0], [c, 1] ], [ [a , 2], [c, 2], [d, 2] ] ]
    },
    charStatuses: (state, getters) => {
        return Object.fromEntries(ALPHABET.map(k => [k, getters.correctChars.includes(k) ? 'correct' :   getters.presentChars.includes(k) ? 'present' :  getters.absentChars.includes(k) ? 'absent' : '' ] ))
    },
    correctChars: (state, getters)  => {
        const correct  = []
        for ( let i = 0; i < getters.guessResults.length; i++ ) {
            const guess = getters.guessResults[i]
            for (let j = 0; j < guess.length; j++ ) {
                const guessChar = guess[j]
                if (guessChar[1] === 2) correct.push(guessChar[0])
            }
        }
        return unique(correct) 
    }, 
    presentChars: (state, getters)  => {
        const correct  = []
        for ( let i = 0; i < getters.guessResults.length; i++ ) {
            const guess = getters.guessResults[i]
            for (let j = 0; j < guess.length; j++ ) {
                const guessChar = guess[j]
                if (guessChar[1] === 1) correct.push(guessChar[0])
            }
        }
        return unique(correct) 
    },
    absentChars: (state, getters) => {
        const correct  = []
        for ( let i = 0; i < getters.guessResults.length; i++ ) {
            const guess = getters.guessResults[i]
            for (let j = 0; j < guess.length; j++ ) {
                const guessChar = guess[j]
                if (guessChar[1] === 0) correct.push(guessChar[0])
            }
        }
        return unique(correct) 
    },
    won: (state) => {
        if (state.guesses[state.guesses.length - 1] === state.solution) return true
        return false
    }
  }
})

export default store