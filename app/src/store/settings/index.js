export default {
    name: 'settings',
    namespaced: true,
    state: {
        timeChallenge: false, 
        colorBlind: true,
        letterHelper: true,
        darkTheme: true,
        reducedMotion: false,
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
        toggleReducedMotion(context) {
            const settings = JSON.parse(localStorage.settings)
            const val = !settings.reducedMotion
            context.dispatch('save', { reducedMotion: val })
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
                darkTheme: settings.darkTheme !== undefined ? Boolean(settings.darkTheme) : window.matchMedia('(prefers-color-scheme: dark)').matches,
                colorBlind: settings.colorBlind !== undefined ? Boolean(settings.colorBlind) : true,
                letterHelper: settings.letterHelper !== undefined ? Boolean(settings.letterHelper) : true,
                reducedMotion: settings.reducedMotion !== undefined ? Boolean(settings.reducedMotion) : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                timeChallenge: settings.timeChallenge !== undefined ? Boolean(settings.timeChallenge) : false,
            }
            context.commit('loads', payload)
            localStorage.settings = JSON.stringify(payload)
        }
    },
    mutations: {
        set(state, payload) {
            state[payload[0]] = payload[1]
        },
        loads(state, payload) {
            console.log(payload)
            state.darkTheme = payload.darkTheme
            state.colorBlind = payload.colorBlind
            state.letterHelper = payload.letterHelper
            state.reducedMotion = payload.reducedMotion
            state.timeChallenge = payload.timeChallenge
        }
    },
}