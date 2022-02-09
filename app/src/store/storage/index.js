export default {
    name: 'storage',
    namespaced: true,
    state:{
        games: null    
    },
    actions: {
        load(context) {
            let games = {}
            if (localStorage.games) games = JSON.parse(localStorage.games)
            context.commit('load', games)
            localStorage.games = JSON.stringify(games)
        },
        visit(context, payload) {
            context.commit('addGame', payload)
            localStorage.games = JSON.stringify(context.state.games)
            console.log(context.state.games[payload])
        }
    },
    mutations: {
        load(state, payload) {
            state.games = payload
        },
        addGame(state, payload) {
            if (state.games[payload] === undefined) state.games[payload] = {}
        }
    },
}
