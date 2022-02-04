<template>
    <div class="pb-6 pt-8 max-w-lg mx-auto object-scale-down">
        <div id="completedRows">
            <Row v-for="guess in guesses" :key="guess" :value="guess"/>
        </div>
        <div v-if="guesses.length < tries" id="currentRow">
            <Row :value="current" />
        </div>
        <div id="incompleteRows">
            <Row v-for="guess in incomplete" :key="guess" :value="guess" />
        </div>
    </div>
</template>

<script>
import Row from './Row.vue'

export default {
    components: {
        Row
    },
    computed: {
        guesses() {
            return this.$store.getters.guessResults
        },
        tries() {
            return this.$store.state.tries
        },
        remaining() {
            return this.tries - this.guesses.length - 1
        },
        incomplete() {
            if (this.remaining < 0) return Array(0)
            return Array(this.remaining).fill('')
        },
        current() {
            return this.$store.state.current
        }
    }
}
</script>

<style>

</style>