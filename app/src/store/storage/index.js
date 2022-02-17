import { v4 as uuidv4 } from 'uuid';
const VERSION_MAJOR = 1
const VERSION_MINOR = 0
const VERSION_MINI = 1


export default {
    name: 'storage',
    namespaced: true,
    state:{
        version: false,
        games: null,
        session: null,
    },
    actions: {
        load(context) {
            let games = {}
            let session = uuidv4()
            let version = (VERSION_MAJOR * 100) + (VERSION_MINOR * 10) + VERSION_MINI 
            if (!localStorage.version || localStorage.version < version ) context.commit('newVersion', true)
            if (localStorage.games) games = JSON.parse(localStorage.games)
            if (localStorage.session) session = localStorage.session
            context.commit('load', {games, session})
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
            console.log(context.state.games[payload])
        }
    },
    mutations: {
        load(state, payload) {
            state.games = payload.games
            state.session = payload.session
        },
        newVersion(state, payload) {
            state.version = payload
        },
        addGame(state, payload) {
            if (state.games[payload] === undefined) state.games[payload] = {}
        }
    },
}
