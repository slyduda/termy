export default {
    name: 'admin',
    namespaced: true,
    state: {
        alert: "",
        score: false,
    },
    actions: {
        alert(context, payload) {
            context.commit('alert', payload)
        },
        score(context) {
            context.commit('score')
        }
    },
    mutations: {
        alert(state, payload) {
            state.alert = payload
            setTimeout(() => {
                state.alert = ""
            } , 4000)
        },
        score(state) {
            state.score = !state.score
        }
    },
}