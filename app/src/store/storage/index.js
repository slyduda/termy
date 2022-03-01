import { v4 as uuidv4 } from 'uuid';
const VERSION_MAJOR = '1'
const VERSION_MINOR = '0'
const VERSION_MINI = '4'


export default {
    name: 'storage',
    namespaced: true,
    state:{
        newVersion: false,
        version: VERSION_MAJOR + '.' + VERSION_MINOR + '.' + VERSION_MINI,
        games: null,
        session: null,
    },
    actions: {
        load(context) {
            let games = {}
            let session = uuidv4()
            let version = VERSION_MAJOR + '.' + VERSION_MINOR + '.' + VERSION_MINI 
            if (!localStorage.version || localStorage.version !== version ) context.commit('newVersion', true)
            if (localStorage.games) games = JSON.parse(localStorage.games)
            if (localStorage.session) session = localStorage.session
            
            context.commit('load', { games, session })
            
            localStorage.version = version
            localStorage.games = JSON.stringify(games)
            localStorage.session = session
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
        }
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
    }
}
