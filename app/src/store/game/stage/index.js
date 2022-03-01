import storage from '../../storage/index';
import admin from '../../admin/index';
import { LIST5, ALPHABET } from "../../../constants";
import axios from 'axios'


function sortAlphabet(str) {
    return [...str].sort((a, b) => a.localeCompare(b)).join("");
}

function test(string, substring) {
    var letters = [...string];
    const t = [...substring].every(x => {
        var index = letters.indexOf(x);
        if (~index) {
            letters.splice(index, 1);
            return true;
        }
    })
    return t ? [true, letters] : [false,''] ;
}


const PRESET = {
    id: -1,
    pool: [],

    constraints: [
        [],
        [],
        [],
        [],
        []
    ],
    
    length: 5,

    current: '',

    guesses: [],
    won: null,
    time: {
        started: null,
        ended: null
    },

    lives: 3,
    undos: 3,

    synced: null,
}


const store = {
    name: 'mutate',
    namespaced: true,
    modules: {
        storage,
        admin
    },
    state: {
        // Dynamic Game Variables
        id: PRESET.id,
        pool: PRESET.pool,
        constraints: PRESET.constraints,
        
        //
        length: PRESET.length,
        
        //
        current: PRESET.current,
        
        //
        guesses: PRESET.guesses,
        won: PRESET.won,
        time: PRESET.time,

        lives: PRESET.lives,
        undos: PRESET.undos,
        
        //
        synced: PRESET.synced,

        words: LIST5,
    },
    actions: {

        set(context, payload) {
            context.commit('set', payload)
            context.dispatch('load')

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
            const mode = 'mutate'

            const game = {}
            game.puzzleId = context.state.id
            game.mode = 'mutate'
            
            game.length = context.state.length

            game.guesses = context.state.guesses
            game.startedOn = context.state.time.started
            game.endedOn = context.state.time.ended    
            
            game.lives = context.state.lives
            game.undos = context.state.undos

            game.won = context.state.won

            game.badges = []
            game.challenges = []
        
            context.dispatch('storage/save', { mode, id, payload: game })
        },

        submit(context, payload) {
            context.commit('submit', payload)
        },

        toggleConstraint(context, payload) {
            context.commit('toggleConstraint', payload)
        },

        addLetter(context, payload) {
            context.commit('addLetter', payload)
        },

        removeLetter (context) {
            context.commit('removeLetter')
        },

        undoGuess (context) {
            if (context.state.pool.length <= 0 ) return 
            context.commit('undoPool')
        },

        end(context, payload) {
            context.commit('end', payload)
        },

        send(context) {
            const state = context.state
            const id = context.state.id
            const mode = 'mutate'
            
            const payload = {
                id: state.id,
                session: state.storage.session,
                guesses: state.guesses.join(','),
                score: state.score,
                lives: state.lives,
                undos: state.undos,
                startedOn: state.time.started,
                endedOn: state.time.ended,
                mode: mode,
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
        set: (state, { id }) => {
            // state.pool = pool
            // state.constraints = constraints
            state.id = id
        },

        load: (state) => {
            const games = state.storage.games[state.id]
            if (games['mutate'] === undefined) return

            const game = games['mutate']
            state.guesses = game.guesses
            state.won = game.won
            state.lives = game.lives
            state.undos = game.undos
            state.time.started = game.startedOn ? new Date( game.startedOn ) : null
            state.time.ended = game.endedOn ? new Date( game.endedOn ) : null   
        },

        reset(state) { 
            // state.id = PRESET.id // Will use hard-coded id
            // state.solution = PRESET.solution // Will use hard-coded solution

            state.length = PRESET.length

            state.current = PRESET.current

            state.guesses = PRESET.guesses
            state.won = PRESET.won
            state.time = PRESET.time

            state.lives = PRESET.lives
            state.undos = PRESET.undos

            state.synced = PRESET.synced
        },

        addLife: (state, payload) => {
            if (payload) {
                state.lives += payload
            } else {
                state.lives += 1
            }
            if (state.lives > PRESET.lives) state.lives = PRESET.lives
        },

        removeLife: (state, payload) => {
            if (payload) {
                state.lives -= payload
            } else {
                state.lives -= 1
            }
            if (state.lives < 0) state.lives = 0
        },

        removeUndo: (state, payload) => {
            if (payload) {
                state.undos -= payload
            } else {
                state.undos -= 1
            }
            if (state.undos < 0) state.undos = 0
        },

        undoPool: (state) => {
            state.guesses.pop()
        },

        submit: (state) => {
            if (state.pool.length === 0) { 
                const d = new Date()
                state.time.started = d.getTime() 
            }
            state.pool.push(state.current)
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

        addLetter(state, payload) {
            state.current += payload
        },

        removeLetter(state) {
            state.current = state.current.slice(0, -1)
        },
    },
    getters: {
        permutations: state => {
            const dict = {}
            for (let h = 0; h < state.pool.length; h++) {
                const letters = state.pool[h].toLowerCase()
                for (let i = 0; i < state.words.length; i++){ 
                    const word = state.words[i]
                    const result = test(letters, word)
                    if (result[0]) dict[word] = {
                        permutations: {},
                        leftovers: result[1]
                    }
                }
            }
            return dict
        },
        permutationsState: state => {
            return state.pool.length + 1
        },
        tries: state => {
            return state.pool.length
        },
        won: (state, getters) => {
            return state.guesses.length >= getters.tries
        },
        lost: (state, getters) => {
            return getters.availableWords <= 0 && !getters.won
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
        validConstraints: (state, getters) => {
            const current = state.guesses.length - 1
            
            if (current >= getters.tries - 1) return false

            if (current > 0){
                const currentConstraints = state.constraints[current]
                for (let i = 0; i < currentConstraints.length; i++ ) {
                    const constraint = currentConstraints[i]
                    if (state.guesses[current][constraint] !== state.guesses[current - 1]) return false
                }
            } 
            return true
        },
        hints: (state, getters) => {
            const arr = new Array(state.length).fill('')
            const row = state.guesses.length - 1

            if (row >= getters.tries - 1) return arr 

            if (row >= 0) {
                for (let i = 0; i < state.constraints[row].length; i++) {
                    const index = state.constraints[row][i]
                    arr[index] = state.guesses[row][index]
                }
            }
            return arr
        },
        remainingLetters: state => {
            const alphabet = ALPHABET.reduce((a, v) => ({ ...a, [v]: 0}), {})
            
            // Get letters that were added from pools
            const current = state.guesses.length + 1
            for (let i = 0; i < current; i++) {
                const poolRow = state.pool[i]

                if (!poolRow) continue
                for(let j = 0; j < poolRow.length; j++) {
                    const letter = state.pool[i][j]
                    alphabet[letter] += 1
                }
            }
            
            // Subtract letters that were added in guesses 
            for (let i = 0; i < state.guesses.length; i++) {
                const guess = state.guesses[i]
                for (let j = 0; j < guess.length; j++) {
                    // If the last constraint row has an index of the current column then we skip the letter
                    const letter = guess[j]
                    alphabet[letter] -= 1
                }
            }

            // Subtract letters that were added in current
            for (let i = 0; i < state.current.length; i++) {
                const letter = state.current[i]
                alphabet[letter] -= 1
            }

            // Add all matching constraints from guesses
            for (let i = 1; i < state.guesses.length; i++) { // Start at one because we subtract from guess
                const guess = state.guesses[i]
                const guessPrev = state.guesses[i-1]
                const constraints = state.constraints[i-1]
                for (let j = 0; j < constraints.length; j++) {
                    const index = constraints[j]
                    if (guess[index] === guessPrev[index]) alphabet[guess[index]] += 1
                }
            }

            // Add all matching constraints from current
            if (state.guesses.length > 0) {
                const guessPrev = state.guesses[state.guesses.length - 1]
                const constraints = state.constraints[state.guesses.length - 1]
                for (let i = 0; i < constraints.length; i++) {
                    const constraint = constraints[i]
                    if (state.current.length < constraint) continue // skip if the current length is shorter
                    const letter = state.current[constraint]
                    const letterGuessPrev = guessPrev[constraint]
                    if (letter === letterGuessPrev) alphabet[letter] += 1
                }
            }


            return alphabet 
        },
        charStatuses: () => {
            return Object.fromEntries(ALPHABET.map(k => [k, '' ] ))
        },
        nextIsConstraint: (state) => {
            if (state.guesses.length === 0) return ''
            const nextIndex = state.current.length
            if (state.constraints[state.guesses.length-1].indexOf(nextIndex) >= 0) return state.guesses[state.guesses.length-1][nextIndex]
            return ''
        },
        guessResults: (state) => {
            const results = []
            
            // 0 - 6
            for ( let i = 0; i < state.guesses.length; i++ ) {
                const guess = state.guesses[i]
                const arr = []
                // 0 - 5
                for ( let j = 0; j < guess.length; j++ ) {
                    const letter = guess[j]
                    let color = 0
                    
                    // If the letter is a constraint default it to 0 
                    if (state.constraints[i].indexOf(j) >= 0) {
                        
                        color = 1

                        // If the guesses length n - 1 (i < 2 - 1)
                        if (i < state.guesses.length - 1) {
                            // if the next *guess* letter is the same then match
                            if (state.guesses[i+1][j] === letter) color = 2
                        // else if 0 === 2 - 1 ie if we're comparing with the current guess (inherently skips 0)
                        } else if (i === state.guesses.length - 1) {
                            // if the current letter is the same as the prev letter and the letter of the 
                            if (state.current[j] === letter) color = 2
                        }
                    }

                    const pack = [letter, color]
                    arr.push(pack)
                }
                results.push(arr)
            }
            return results // [ [ [a , 2], [b, 0], [c, 1] ], [ [a , 2], [c, 2], [d, 2] ] ]
        },
        wordPermFrequency: (state) => {
            const frequencies = {}
            for (let i = 0; i < state.words.length; i++) {
                const word = state.words[i]
                const sorted = sortAlphabet(word)
                if (sorted in frequencies) {
                    frequencies[sorted] += 1
                } else {
                    frequencies[sorted] = 1
                }
            }

            return frequencies
        },
        sortedWordPermFrequency: (state, getters) => {
            const frequencies = getters.wordPermFrequency
            const sortable = [];
            for (const permutation in frequencies) {
                sortable.push([permutation, frequencies[permutation]]);
            }

            sortable.sort(function(a, b) {
                return b[1] - a[1];
            });

            return sortable
        },
        letterFrequency: () => {
            const alphabet = ALPHABET.reduce(function(obj, v) {
                obj[v] = 0;
                return obj;
            }, {})

            for (let i = 0; i < LIST5.length; i++) {
                const word = LIST5[i]
                for (let j = 0; j < word.length; j++) {
                    const letter = word[j]
                    alphabet[letter.toUpperCase()] += 1
                }
            }

            return alphabet
        },
        sortedLetterFrequency: (state, getters) => {
            const frequencies = getters.letterFrequency
            const sortable = [];
            for (const permutation in frequencies) {
                sortable.push([permutation, frequencies[permutation]]);
            }

            sortable.sort(function(a, b) {
                return b[1] - a[1];
            });

            return sortable
        }
    }
}

export default store