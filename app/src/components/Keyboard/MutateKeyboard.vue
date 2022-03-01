<template>
    <div id="keyboard" class="flex flex-col pb-2 px-2" :key="mode">
        <div v-if="mode === 'mutate'" class="mb-1 mx-0.5 text-white dark:text-gray-700 font-bold flex justify-center items-end">
            <div class="pl-3 pr-1 py-3 bg-gray-200 dark:bg-gray-500 flex justify-center items-center rounded-tl-lg">
                <font-awesome-icon class="mr-1 text-lg" :class="[{'text-red-500': lives > 0}]" icon="heart"></font-awesome-icon>
                <font-awesome-icon class="mr-1 text-lg" :class="[{'text-red-500': lives > 1}]" icon="heart"></font-awesome-icon>
                <font-awesome-icon class="mr-1 text-lg" :class="[{'text-red-500': lives > 2}]" icon="heart"></font-awesome-icon>
            </div>
            <div class="text-white text-3xl bg-gray-200 dark:bg-gray-500 px-5 py-2 flex justify-center rounded-t-lg">302</div>
            <div class="pr-3 pl-1 py-3 bg-gray-200 dark:bg-gray-500 flex flex-row-reverse justify-center items-center rounded-tr-lg">
                <font-awesome-icon class="ml-1 text-lg" :class="[{[textPrimary]: undos > 0}]" icon="trash-can"></font-awesome-icon>
                <font-awesome-icon class="ml-1 text-lg" :class="[{[textPrimary]: undos > 1}]" icon="trash-can"></font-awesome-icon>
                <font-awesome-icon class="ml-1 text-lg" :class="[{[textPrimary]: undos > 2}]" icon="trash-can"></font-awesome-icon>
            </div>
        </div>
        <div v-if="mode === 'stage'" class="mb-1 mx-0.5 text-white dark:text-gray-700 font-bold flex justify-center items-end">
            <div class="text-white text-3xl bg-gray-200 dark:bg-gray-500 px-5 py-2 flex justify-center rounded-t-lg">{{ current }}</div>
        </div>
        <div class="flex justify-center mb-1">
            <Key :value="'Q'" @click="nothing" :status="charStatuses['Q']" :count="remainingLetters['Q']" />
            <Key :value="'W'" @click="nothing" :status="charStatuses['W']" :count="remainingLetters['W']" />
            <Key :value="'E'" @click="nothing" :status="charStatuses['E']" :count="remainingLetters['E']" />
            <Key :value="'R'" @click="nothing" :status="charStatuses['R']" :count="remainingLetters['R']" />
            <Key :value="'T'" @click="nothing" :status="charStatuses['T']" :count="remainingLetters['T']" />
            <Key :value="'Y'" @click="nothing" :status="charStatuses['Y']" :count="remainingLetters['Y']" />
            <Key :value="'U'" @click="nothing" :status="charStatuses['U']" :count="remainingLetters['U']" />
            <Key :value="'I'" @click="nothing" :status="charStatuses['I']" :count="remainingLetters['I']" />
            <Key :value="'O'" @click="nothing" :status="charStatuses['O']" :count="remainingLetters['O']" />
            <Key :value="'P'" @click="nothing" :status="charStatuses['P']" :count="remainingLetters['P']" />
        </div>
        <div class="flex justify-center mb-1">
            <div :style="{ 
                    width: '26px', 
                    height: '58px' 
                }"
            ></div>
            <Key :value="'A'" @click="nothing" :status="charStatuses['A']" :count="remainingLetters['A']" />
            <Key :value="'S'" @click="nothing" :status="charStatuses['S']" :count="remainingLetters['S']" />
            <Key :value="'D'" @click="nothing" :status="charStatuses['D']" :count="remainingLetters['D']" />
            <Key :value="'F'" @click="nothing" :status="charStatuses['F']" :count="remainingLetters['F']" />
            <Key :value="'G'" @click="nothing" :status="charStatuses['G']" :count="remainingLetters['G']" />
            <Key :value="'H'" @click="nothing" :status="charStatuses['H']" :count="remainingLetters['H']" />
            <Key :value="'J'" @click="nothing" :status="charStatuses['J']" :count="remainingLetters['J']" />
            <Key :value="'K'" @click="nothing" :status="charStatuses['K']" :count="remainingLetters['K']" />
            <Key :value="'L'" @click="nothing" :status="charStatuses['L']" :count="remainingLetters['L']" />
            <div :style="{ 
                    width: '26px', 
                    height: '58px' 
                }"
            ></div>
        </div>
        <div class="flex justify-center">
            <Key :width="65.4" :value="'ENTER'" @click="nothing">
            </Key>
            <Key :value="'Z'" @click="nothing" :status="charStatuses['Z']" :count="remainingLetters['Z']" />
            <Key :value="'X'" @click="nothing" :status="charStatuses['X']" :count="remainingLetters['X']" />
            <Key :value="'C'" @click="nothing" :status="charStatuses['C']" :count="remainingLetters['C']" />
            <Key :value="'V'" @click="nothing" :status="charStatuses['V']" :count="remainingLetters['V']" />
            <Key :value="'B'" @click="nothing" :status="charStatuses['B']" :count="remainingLetters['B']" />
            <Key :value="'N'" @click="nothing" :status="charStatuses['N']" :count="remainingLetters['N']" />
            <Key :value="'M'" @click="nothing" :status="charStatuses['M']" :count="remainingLetters['M']" />
            <Key v-if="!current && guesses.length && (mode === 'mutate' || mode === 'stage')" :width="65.4" :value="'UNDO'" @click="nothing" />
            <Key v-else :width="65.4" :value="'DELETE'" @click="nothing">
                <font-awesome-icon icon="backspace" class="text-xl" :class="['text-gray-900 dark:text-gray-100']"></font-awesome-icon>
            </Key>
        </div>
    </div>
</template>

<script>
import Key from './Key.vue';
import { ALPHABET } from '../../constants'

export default {
    components: {
        Key
    },
    computed: {
        mode() {
            return this.$store.state.game.mode
        },
        lives() {
            return this.$store.state.game.mutate.lives
        },
        undos() {
            return this.$store.state.game.mutate.undos
        },
        charStatuses() {
            return this.$store.getters[`game/${this.mode}/charStatuses`]
        },
        remainingLetters() {
            if (!this.$store.getters[`game/${this.mode}/remainingLetters`]) return {}
            return this.$store.getters[`game/${this.mode}/remainingLetters`]
        },
        colorBlind() {
            return this.$store.state.settings.colorBlind;
        },
        textPrimary() {
            return this.colorBlind ? 'text-blue-500' : 'text-green-500'
        },
        current() {
            return this.$store.state.game[this.mode].current
        },
        guesses() {
            return this.$store.state.game[this.mode].guesses
        },

        won() {
            return this.$store.state.game[this.mode].won
        }

    },
    mounted() {
        window.addEventListener('keydown', this.keyDown)
    },

    unmounted: function () {
        window.removeEventListener('keydown', this.keyDown)
    },

    methods: {
        nothing() {
            return
        },
        keyDown: function (event) {
            if (event.key === 'Enter') {
                this.$store.dispatch('game/submit')
            } else if (event.key === 'Backspace') {
                this.$store.dispatch('game/removeLetter')
            }  else if (ALPHABET.indexOf(event.key.toUpperCase()) >= 0) {
                this.$store.dispatch('game/addLetter', event.key.toUpperCase())
            }
            
            const that = this
            if (this.won) {
                setTimeout(() => {
                    that.$store.dispatch('admin/score')
                }, 2000)
            }  
        },
    }
}
</script>

<style>

</style>