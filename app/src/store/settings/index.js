export default {
    name: 'settings',
    namespaced: true,
    state: {
        timeChallenge: false, 
        colorBlind: true,
        letterHelper: true,
        darkTheme: true,
    },
    actions: {
        toggleColorBlind(context) {
            const settings = JSON.parse(localStorage.settings)
            const val = !settings.colorBlind
            context.dispatch('save', { colorBlind: val })
        },
        toggleTimeChallenge(context) {
            const settings = JSON.parse(localStorage.settings)
            const val = !settings.timeChallenge
            context.dispatch('save', { timeChallenge: val })
        },
        toggleLetterHelper(context) {
            const settings = JSON.parse(localStorage.settings)
            const val = !settings.letterHelper
            context.dispatch('save', { letterHelper: val })
        },
        toggleDarkTheme(context) {
            const settings = JSON.parse(localStorage.settings)
            const val = !settings.darkTheme
            if (val) { // if dark theme
                document.documentElement.classList.add('dark')
            } else { // if not dark theme
                document.documentElement.classList.remove('dark')
            }
            context.dispatch('save', { darkTheme: val })
        },
        save(context, payload) {
            const settings = JSON.parse(localStorage.settings)
            const toggled = Object.entries(payload)[0]
            settings[toggled[0]] = toggled[1]
            localStorage.settings = JSON.stringify(settings)
            context.commit('set', toggled)
        }, 
        load(context) {
            let settings = {}
            if (localStorage.settings) settings = JSON.parse(localStorage.settings)
            const payload = {
                darkTheme: settings.darkTheme | true,
                colorBlind: settings.colorBlind | true,
                letterHelper: settings.letterHelper | true,
                timeChallenge: settings.timeChallenge | false,
            }
            context.commit('load', payload)
            localStorage.settings = JSON.stringify(payload)
        }
    },
    mutations: {
        set(state, payload) {
            state[payload[0]] = payload[1]
        },
        load(state, payload) {
            state.darkTheme = payload.darkTheme
            state.colorBlind = payload.colorBlind
            state.letterHelper = payload.letterHelper
            state.timeChallenge = payload.timeChallenge
        }
    },
}