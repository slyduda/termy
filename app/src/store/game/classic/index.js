import storage from '../../storage/index';
import admin from '../../admin/index';
import { LIST5, ALPHABET } from "../../../constants";
import axios from 'axios'

const HARD_LOSS = 10

const PRESET = {
    id: -1,
    solution: "XXXXX",
    
    length: 5,
    tries: 6,

    current: '',

    guesses: [],
    won: null,
    time: {
        started: null,
        ended: null
    },

    synced: null,
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

const store = {
    name: 'classic',
    namespaced: true,
    modules: {
        storage,
        admin
    },
    state: {
        // Dynamic Game Variables
        id: PRESET.id,
        solution: PRESET.solution,
        
        //
        length: PRESET.length,
        tries: PRESET.tries,
        
        //
        current: PRESET.current,
        
        //
        guesses: PRESET.guesses,
        won: PRESET.won,
        time: PRESET.time,
        
        //
        synced: PRESET.synced,
    },
    actions: {

        set(context, payload) {
            context.commit('set', payload)
            context.dispatch('load')
            
            // If the user wanted to keep going after the default tries!
            if (context.getters.lost && context.getters.playing) context.commit('addTries', 4)
        },
        
        load(context) {
            context.commit('load')
        },

        reset(context) {
            context.commit('reset')
            context.dispatch('save')
        },
        
        save(context) {
            const id = context.state.id
            const mode = '5'

            const game = {}
            game.puzzleId = context.state.id
            game.mode = 'classic'
            game.solution = context.state.solution
            
            game.length = context.state.length

            game.guesses = context.state.guesses
            game.startedOn = context.state.time.started
            game.endedOn = context.state.time.ended            

            game.won = context.state.won

            game.badges = []
            game.challenges = []
        
            context.dispatch('storage/save', { mode, id, payload: game })
        },

        submit(context, payload) {
            if ( context.state.won !== null) return

            if ( !context.getters.validLength ) {
                context.commit('admin/alert', `Guess is not ${context.state.length} letters`)
                // context.commit('shake', true)
                return
            }
            
            if ( !context.getters.validGuess ) {
                context.commit('admin/alert', 'Word not recognized')
                // context.commit('shake', true)
                return
            }
            
            context.commit('submit', payload)

            // Check for win conditions
            if ( context.getters.won ) {
                context.dispatch('end', !context.getters.lost) // This should save the win
                context.dispatch('admin/alert', "You got it!")
            } else if ( context.getters.lostHard ) { 
                context.dispatch('end', false )
                context.dispatch('admin/alert', context.state.solution)
            } else if ( context.getters.lostSoft ) {
                context.dispatch('admin/alert', "UH OH")
            }


            // Save new state
            context.dispatch('save')
        },

        continue(context, payload) {
            if ( context.getters.lostSoft ) context.commit('addTries', payload)
        },

        addLetter(context, payload) {
            // Checks if space to add letter and or won or lost
            if ( context.getters.remainingLength <= 0 || context.state.won !== null ) return
            context.commit('addLetter', payload)
        },

        removeLetter (context) {
            context.commit('removeLetter')
        },

        end(context, payload) {
            context.commit('end', payload)
            context.dispatch('save')
        },

        send(context) {
            const state = context.state
            const id = context.state.id
            const mode = '5'
            
            const payload = {
                id: state.id,
                solution: state.solution,
                session: state.storage.session,
                guesses: state.guesses.join(','),
                startedOn: state.time.started,
                endedOn: state.time.ended,
                length: state.length,
                mode: 'classic',
                won: state.won
            }
            
            axios.post('https://termy.gg/submit', payload)
                .then((response) => {  
                    const data = {
                        id: response.data.id,
                        hash: response.data.hash,
                        hashVersion: response.data.hash_version
                    }

                    context.dispatch('storage/addBackupInfo', { mode, id, payload: data })
                    context.commit('sync', true)
                })
                .catch(() => {
                    context.commit('sync', false)
                })
        }
    },
    mutations: {
        set: (state, { solution, id }) => {
            state.solution = solution
            state.id = id
        },

        load: (state) => {
            const games = state.storage.games[state.id]
            if (games['5'] === undefined) return

            const game = games['5']
            state.guesses = game.guesses
            state.won = game.won
            state.time.started = game.startedOn ? new Date( game.startedOn ) : null
            state.time.ended = game.endedOn ? new Date( game.endedOn ) : null   
        },

        reset(state) { 
            // state.id = PRESET.id // Will use hard-coded id
            // state.solution = PRESET.solution // Will use hard-coded solution

            state.length = PRESET.length
            state.tries = PRESET.time

            state.current = PRESET.current

            state.guesses = PRESET.guesses
            state.won = PRESET.won
            state.time = PRESET.time
            
            state.synced = PRESET.synced
        },

        submit: (state) => {
            if (state.guesses.length === 0) { 
                const d = new Date()
                state.time.started = d.getTime() 
            }
            state.guesses.push(state.current)
            state.current = ''
        },

        end: (state, won) => {
            const d = new Date()
            state.time.ended = d.getTime();
            state.won = won
        },

        synced: (state, payload) => {
            state.synced = payload
        },

        addTries: (state, payload) => {
            state.tries += payload
        },

        addLetter(state, payload) {
            state.current += payload
        },

        removeLetter(state) {
            state.current = state.current.slice(0, -1)
        },
    },
    getters: {
        won: state => {
            return state.guesses[state.guesses.length - 1] === state.solution 
        },
        lost: state => {
            return state.guesses.length >= 6
        },
        lostSoft: state => {
            return state.guesses.length === state.tries && state.guesses.length < HARD_LOSS && state.won === null
        },
        lostHard: state => {
            return state.guesses.length >= HARD_LOSS
        },
        playing: state => {
            return state.won === null
        },
        remainingLength: state => {
            return state.length - state.current.length
        },
        validLength: state => {
            return state.current.length === state.length
        },
        validGuess: state => {
            return LIST5.indexOf(state.current.toLowerCase()) >= 0
        },
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
            if ( getters.won ) return arr
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
    }
}

export default store