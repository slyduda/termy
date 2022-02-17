import { createStore } from "vuex" 
import { LIST5, LIST6 } from "../constants"
import storage from "./storage/index.js"
import settings from "./settings/index.js"
import admin from "./admin/index.js"
import axios from 'axios'

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
    modules: {
        storage,
        settings,
        admin
    },
   state:{
        id: null,
        words: {
            5: "ORGAN",
            6: "PILLOW"
        },
        length: 5,
        solution: "ORGAN",
        guesses: [],
        tries: 6,
        
        current: '',
        ended: false,
        
        startTime: null,
        endTime: null,
        time: 60000,

        dailyReset: new Date(0),
        
        playing: true,
        submitted: false,
        checked: false,
        
   },
   actions: {
        load(context, payload) {
            if (payload.id === "{@ game_id @}") payload.id = 7
            if (payload[5] === "{@ five @}") payload[5] = "ZEBRA"
            if (payload[6] === "{@ six @}") payload[6] = "ZIPPER"
            if (payload.p === "{@ payload @}") payload.p = 24 * 60 * 60
            
            context.dispatch('storage/load')
            context.dispatch('storage/visit', payload.id)
            context.commit('load', payload)
            context.commit('set', 5)
        },

        switchMode(context) {
            // Used to switch modes between Termy and Termy+
            const inProgress = context.state.current.length > 0 || context.state.guesses.length > 0
            if ( !context.state.ended && inProgress ) return
            context.commit('set', context.state.length === 5 ? 6 : 5)
        },

        reset(context) {
            context.commit('reset')  
        },
        
        checkedCaught(context) {
            context.commit('shake', false)
        },
        submit (context) {
            if (context.state.current.length < context.state.length) {
                context.commit('admin/alert', `Guess is not ${context.state.length} letters`)
                context.commit('shake', true)
                return
            }
            
            if (context.state.length === 5) {
                if ( LIST5.indexOf(context.state.current.toLowerCase()) < 0 ) {
                    context.commit('admin/alert', 'Word not recognized')
                    context.commit('shake', true)
                    return
                }
            } else {
                if ( LIST6.indexOf(context.state.current.toUpperCase()) < 0 ) {
                    context.commit('admin/alert', 'Word not recognized')
                    context.commit('shake', true)
                    return
                }
            }
            
            if (context.state.guesses.length === 0) context.commit('start')
            context.commit('submit')
            if ( context.getters.won ) {
                context.dispatch('admin/alert', "You got it!")
                context.commit('end')
                context.dispatch('storage/load')
            } else if ( context.state.tries === context.state.guesses.length ) {
                if ( context.state.tries >= 10 ) { 
                    context.dispatch('fail') 
                } else { 
                    context.dispatch('admin/alert', "UH OH")
                    context.commit('playing', false) 
                }
            }
        },

        continue(context, payload) {
            context.commit('addTries', payload)
        },

        addLetter(context, payload) {
            if (context.state.current.length >= context.state.length ) return
            if (context.getters.won) return
            context.commit('addLetter', payload)
        },
        removeLetter (context) {
            context.commit('removeLetter')
        },
        fail (context) {
            context.dispatch('admin/alert', context.state.solution)
            context.commit('end')
            context.dispatch('storage/load')
        }
   },
   mutations: {
        shake(state, payload) {
            state.checked = payload
        },

        load(state, payload) {
            state.id = Number(payload.id)
            
            const d = new Date()
            d.setSeconds( d.getSeconds() + Number(payload.p) )
            state.dailyReset = d

            console.log(payload[5])

            state.words[5] = payload[5]
            state.words[6] = payload[6]
        },
        

        set(state, payload) {
            state.length = payload
            state.solution = state.words[state.length]

            state.guesses = []
            state.ended = false
            state.startTime = null
            state.endTime = null
            state.playing = true
            state.tries = 6
            state.submitted = false

            // We add game id before load mutate sp just need to see if the user played played
            const game = state.storage.games[state.id]
            if (game[state.length] !== undefined) {
                const mode = game[state.length]
                state.guesses = mode.guesses
                if ( mode.startedOn ) state.startTime = new Date( mode.startedOn )
                if ( mode.endedOn ) state.endTime = new Date( mode.endedOn )
                if (mode.won === null) {
                    if ( state.guesses.length >= 6 ) state.tries = 10
                    if ( state.tries === state.guesses.length ) state.playing = false
                } else {
                    console.log(game)
                    state.ended = true
                }
            }
        },

        reset(state) { // Might be beneficial to change this function since this implies the game is being reset and not the mode
            state.solution = state.words[state.length] 
            
            state.guesses = []
            state.ended = false
            state.startTime = null
            state.endTime = null
            state.playing = true
            state.tries = 6
            state.submitted = false

            // We add game id before load mutate sp just need to see if the user played played
            const game = state.storage.games[state.id]
            if (game[state.length] !== undefined) state.guesses = game[state.length].guesses
        },


        submit (state) {
            state.guesses.push(state.current)
            state.current = ''

            const games = JSON.parse(localStorage.games)
            games[state.id][state.length].guesses = state.guesses
            localStorage.games = JSON.stringify(games)
        },

        addTries(state, payload) {
            state.tries = state.tries + payload
        },
        
        addLetter(state, payload) {
            state.current += payload
        },
        removeLetter(state) {
            state.current = state.current.slice(0, -1)
        },

        start(state) {
            const d = new Date()
            state.startTime = d.getTime();

            const store = JSON.parse(localStorage.games)
            
            store[state.id][state.length] = {
                startedOn: state.startTime,
                endedOn: null,
                mode: null,
                guesses: [],
                length: state.length,
                solution: state.solution,
                badges: [],
                challenges: [],
                won: null,
                session: state.storage.session,
                version: '1.0'
            } 

            localStorage.games = JSON.stringify(store)
        },

        playing(state, payload) {
            state.playing = payload
        },

        end(state) {
            console.log('end')
            if (state.settings.timeChallenge) {
                state.endTime = state.startTime + state.time
            } else {
                const d = new Date()
                state.endTime = d.getTime();
            }
            
            const store = JSON.parse(localStorage.games)
            store[state.id][state.length].endedOn = state.endTime
            store[state.id][state.length].won = state.guesses[state.guesses.length - 1] === state.solution && state.guesses.length <= 6

            localStorage.games = JSON.stringify(store)
            state.ended = true

            const game = store[state.id][state.length]
            const payload = {
                id: state.id,
                solution: state.solution,
                session: game.session,
                guesses: game.guesses.join(','),
                startedOn: game.startedOn,
                endedOn: game.endedOn,
                length: game.length,
                mode: game.length === 5 ? 'classic' : 'plus',
                won: game.won
            }

            axios.post('https://termy.gg/submit', payload)
                .then((response) => {
                    state.submitted = true
                    
                    store[state.id][state.length].id = response.data.id
                    store[state.id][state.length].hash = response.data.hash
                    store[state.id][state.length].hashVersion = response.data.hash_version

                    localStorage.games = JSON.stringify(store)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
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
    hints: (state, getters) => {
        const arr = new Array(state.length).fill('')
        if (!state.settings.letterHelper || getters.won) return arr
        for (let i = 0; i < getters.guessResults.length; i++ ) {
            const guess = getters.guessResults[i]
            for (let j = 0; j < guess.length; j++) if ( guess[j][1] === 2 ) arr[j] = guess[j][0]
        }
        return arr
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
        return state.guesses[state.guesses.length - 1] === state.solution
    },
    lost: (state, getters) => {
        return state.guesses.length >= 6 && !getters.won
    }
  }
})

export default store