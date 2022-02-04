<template>
    <div class="flex justify-center mb-1" :guess="guess">
        <Cell v-for="char in convertedGuess" :key="char" :value="char[0]" :status="char[1]"/>
    </div>
</template>

<script>
import Cell from './Cell.vue'

export default {
    components: {
        Cell
    },
    props: {
        value: {
            type: [Array, String],
            default: ''
        }
    },
    computed: {
        wordLength() {
            return this.$store.state.length
        },
        convertedGuess() {
            if (Array.isArray(this.value)) return this.value
            
            const guess = this.value.split('')
            const guessArray = []
            for (let i = 0; i < guess.length; i++) {
                guessArray.push([guess[i], ''])
            }
            for (let i = 0; i < this.wordLength - guess.length; i++ ) {
                guessArray.push(['', ''])
            }
            return guessArray
        }
    }
}
</script>

<style>

</style>