import { createStore } from "vuex" 

import storage from "./storage/index.js"
import game from "./game/index.js"
import settings from "./settings/index.js"
import admin from "./admin/index.js"


const store = createStore({
    namespaced: true,
    modules: {
        storage,
        settings,
        admin,
        game
    },
    state:{

    },
    actions: {
        init(context) { 
            const id = document.getElementById('i_elem').value
            const time = document.getElementById('p_elem').value
            const plus = document.getElementById('s_elem').value
            const classic = document.getElementById('f_elem').value

            context.dispatch('game/init', { time, id, classic, plus })
        },
    },
    mutations: {
        
    },
    getters: {
    
    }
})

export default store