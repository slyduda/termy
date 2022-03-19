import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'
const VERSION_MAJOR = '1'
const VERSION_MINOR = '0'
const VERSION_MINI = '5'
const CATCHUP = '1'


export default {
    name: 'storage',
    namespaced: true,
    state:{
        newVersion: false,
        version: VERSION_MAJOR + '.' + VERSION_MINOR + '.' + VERSION_MINI,
        games: null,
        session: null,
        caughtup: false,
    },
    actions: {
        init(context) {
            let games = {}
            let session = uuidv4()
            let version = VERSION_MAJOR + '.' + VERSION_MINOR + '.' + VERSION_MINI 
            if (!localStorage.version || localStorage.version !== version ) context.commit('newVersion', true)
            if (localStorage.games) games = JSON.parse(localStorage.games)
            if (localStorage.session) session = localStorage.session
            
            context.commit('load', { games, session })
            if (localStorage.caughtup !== CATCHUP) context.dispatch('catchup')
            
            localStorage.version = version
            localStorage.games = JSON.stringify(games)
            localStorage.session = session
        },
        load(context) {
            const session = localStorage.session
            const games = JSON.parse(localStorage.games)
            
            context.commit('load', { games, session })
            // if (localStorage.caughtup !== CATCHUP) context.dispatch('catchup')
        },
        newVersion(context, payload) {
            context.commit('newVersion', payload) 
        },
        visit(context, payload) {
            context.commit('addGame', payload)
            localStorage.games = JSON.stringify(context.state.games)
        },
        save(context, { mode, id, payload }) {
            const session = context.state.session
            const version = context.state.version

            const gameData = localStorage.getItem('games')
            if (!gameData) {
                alert('Failure retrieving games in local storage during save.')
                return
            }
            const games = JSON.parse(gameData)
            
            // Client driven additional info
            payload.session = games[id][mode]?.session ? games[id][mode].session : session
            payload.version = games[id][mode]?.version ? games[id][mode].version : version
            
            // Server driven additional info
            payload.id = games[id][mode]?.id ? games[id][mode].id : null
            payload.hash = games[id][mode]?.hash ? games[id][mode].hash : null
            payload.hashVersion = games[id][mode]?.hashVersion ? games[id][mode].hashVersion : null

            games[id][mode] = payload
            
            localStorage.setItem('games', JSON.stringify(games))

            // Load new local storage to vuex after saved
            context.dispatch('load')
        },
        addBackupInfo(context, { mode, id, payload }) {
            const gameData = localStorage.getItem('games')
            if (!gameData) {
                alert('Failure retrieving games in local storage during save.')
                return
            }
            const games = JSON.parse(gameData)

            games[id][mode].id = payload.id
            games[id][mode].hash = payload.hash
            games[id][mode].hashVersion = payload.hashVersion
            
            localStorage.setItem('games', JSON.stringify(games))
        },

        catchup(context) {
            const games = context.getters.notPosted
            const session = context.state.session
            
            if (games.length === 0) {
                localStorage.caughtup = CATCHUP
                return
            }
            
            axios.post(process.env.VUE_APP_API_URL + 'catchup', {session, games})
                .then((response) => {  
                    const postedGames = response.data.games
                    for (let i = 0; i < postedGames.length; i++) {
                        const postedGame = postedGames[i]
                        const puzzle = postedGame.puzzle
                        const mode = postedGame.length
                        const hash = postedGame.hash
                        const hashVersion = postedGame.hash_version
                        const id = postedGame.id
                        context.dispatch('addBackupInfo', { mode, id: puzzle, payload: { id, hash, hashVersion }})
                    }
                    localStorage.caughtup = CATCHUP
                })
                .catch(() => {
                    localStorage.caughtup = '0'
                })
        },
    },
    mutations: {
        load(state, payload) {
            state.games = payload.games
            state.session = payload.session
        },
        newVersion(state, payload) {
            state.newVersion = payload
        },
        addGame(state, payload) {
            if (state.games[payload] === undefined) state.games[payload] = {}
        }
    },
    getters: {
        games: state => {
            return state.games
        },
        notPosted: state => {
            const games = Object.entries(state.games)

            const playedFive = games.filter(([, game]) => game[5] !== undefined)
            const onlyFive = playedFive.map(([id, game]) => { 
                return {...game[5], 
                    puzzleId: game[5].puzzleId ? Number(game[5].puzzleId) : id, 
                    mode: "classic", 
                    startedOn: typeof game[5].startedOn === 'string' ? new Date(game[5].startedOn).getTime() : game[5].startedOn  
                }
            })
            const finishedFive = onlyFive.filter((game) => (game.won === true || game.won === false) && (game.id === undefined || game.id === null))

            const playedSix = games.filter(([, game]) => game[6] !== undefined)
            const onlySix = playedSix.map(([id, game]) => { 
                return {...game[6], 
                    puzzleId: game[6].puzzleId ? Number(game[6].puzzleId) : id, 
                    mode: "plus",
                    startedOn: typeof game[6].startedOn === 'string' ? new Date(game[6].startedOn).getTime() : game[6].startedOn
                }
            })
            const finishedSix = onlySix.filter((game) => (game.won === true || game.won === false) && (game.id === undefined || game.id === null))

            return [...finishedFive, ...finishedSix]
        }
    }
}
