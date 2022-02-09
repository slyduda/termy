export default {
    name: 'admin',
    namespaced: true,
    state: {
        alert: "",
    },
    actions: {
        alert(context, payload) {
            context.commit('alert', payload)
        },
    },
    mutations: {
        alert(state, payload) {
            state.alert = payload
            setTimeout(() => {
                state.alert = ""
            } , 4000)
        },
    },
}