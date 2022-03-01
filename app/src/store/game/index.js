
import classic from "./classic/index.js"
import plus from "./plus/index.js"
import mutate from "./mutate/index.js"
import storage from "../storage/index.js"
import stage from './stage/index.js'
import { LIST5 } from "../../constants/index.js"

const MODES = [ // Redundant, maybe try replacing list with imported modules?
    'classic',
    'plus',
    'mutate',
    'stage'
]

const TEST_PUZZLES = {
    classic: "ZEBRA",
    plus: "ZIPPER",
    mutate: {
        pool: [
            ['A', 'I', 'R', 'E', 'M', 'T'],
            ['C', 'M', 'P', 'H', 'O', 'L'],
            ['S', 'K', 'G', 'N', 'I', 'R'],
            ['O', 'L', 'O', 'M', 'B'],
            ['F', 'L', 'U', 'K', 'E'],
            []
            //['D', 'I', 'N', 'E', 'R']
        ],
        constraints: [
            [ 3],
            [1],
            [0],
            [1,2],
            [0,3,4],
            []
        ]
    }
}

const store = {
    name: 'game',
    namespaced: true,
    modules: {
        classic,
        plus,
        mutate,
        stage,
        storage
    },
    state: {
        id: 1,
        time: 24 * 60 * 60,
        mode: 'classic',
        puzzles: TEST_PUZZLES,
        words: LIST5,
    },
    actions: {
        init(context, { id, time, plus, classic }) {
            if (id !== "{@ game_id @}") context.commit('id', id )
            if (time !== "{@ payload @}") context.commit('time', time )
            if (classic !== "{@ five @}") context.commit('puzzle', { mode: 'classic', solution: classic } )
            if (plus !== "{@ six @}") context.commit('puzzle', { mode: 'plus', solution: plus } )

            context.dispatch('storage/load')
            context.dispatch('storage/visit', context.state.id)

            context.dispatch('classic/set', { id: context.state.id, solution: context.state.puzzles.classic })
            context.dispatch('plus/set', { id: context.state.id, solution: context.state.puzzles.plus })
            context.dispatch('mutate/set', { id: context.state.id, pool: context.state.puzzles.mutate.pool, constraints: context.state.puzzles.mutate.constraints })
            context.dispatch('mutate/set', { id: context.state.id, pool: context.state.puzzles.mutate.pool, constraints: context.state.puzzles.mutate.constraints })
        },
        change(context, payload) {
            // Used to switch modes between Termy and Termy+
            if (MODES.indexOf(payload) < 0) {
                alert('invalid mode')
                return
            }
            
            context.commit('change', payload)
        },
        submit(context, payload) {
            const mode = context.state.mode
            context.dispatch( mode + '/submit', payload )
        },
        removeLetter(context) {
            const mode = context.state.mode
            context.dispatch( mode + '/removeLetter' )
        },
        addLetter(context, payload) {
            const mode = context.state.mode
            context.dispatch(mode + '/addLetter', payload)
        }
    },
    mutations: {
        change: (state, payload) => {
            state.mode = payload
        },
        id: (state, payload) => {
            state.id = payload
        },
        puzzle: (state, { mode, solution }) => {
            state.puzzles[mode] = solution
        },
        time: (state, payload) => {
            const d = new Date()
            d.setSeconds( d.getSeconds() + Number(payload) )

            state.time = d
        }
     },
    getters: {
        
    }
}

export default store