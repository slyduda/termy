import { v4 as uuidv4 } from 'uuid';

export default {
    name: 'storage',
    namespaced: true,
    state:{
        games: null,
        session: null,
    },
    actions: {
        load(context) {
            let games = {}
            let session = uuidv4()
            if (localStorage.games) games = JSON.parse(localStorage.games)
            if (localStorage.session) session = localStorage.session
            context.commit('load', {games, session})
            localStorage.games = JSON.stringify(games)
            localStorage.session = session
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
        addGame(state, payload) {
            if (state.games[payload] === undefined) state.games[payload] = {}
        }
    },
}
