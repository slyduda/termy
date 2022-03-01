<template>
    <div class="max-w-lg mx-auto object-scale-down flex justify-center items-center">
        <div ref="grid" class="flex flex-col p-6">
            <Row v-for="(guess, index) in guesses" :key="guess || length" :value="guess" class="flex-1" :small="smallLetters" :length="length" :constraints="constraints[index]" />
            <Row v-if="guesses.length < tries" id="currentRow" :key="guesses.length + 1" :current="true" :value="current" :hints="hints" :length="length"  class="flex-1" :small="smallLetters" :constraints="constraints[guesses.length]"/>
            <Row v-for="(guess, index) in incomplete" :key="index" :value="guess" class="flex-1" :small="smallLetters" :length="length" :constraints="constraints[guesses.length+1+index]"/>
        </div>
    </div>
</template>

<script>
import Row from './MutateRow.vue'

export default {
    components: {
        Row
    },
    data() {
        return {
            height: 0,
            width: 0,
        }
    },
    computed: {
        current() {
            return this.$store.state.game.mutate.current
        },
        length() {
            return this.$store.state.game.mutate.length 
        },
        guesses() {
            return this.$store.getters['game/mutate/guessResults']
        },
        hints() {
            return this.$store.getters['game/mutate/hints']
        },
        tries() {
            return this.$store.state.game.mutate.guesses.length > this.$store.getters['game/mutate/tries'] ? this.$store.state.game.mutate.guesses.length : this.$store.getters['game/mutate/tries'] 
        },
        constraints() {
            return this.$store.state.game.mutate.constraints
        },
        remaining() {
            return this.tries - this.guesses.length - 1
        },
        incomplete() {
            if (this.remaining < 0) return Array(0)
            return Array(this.remaining).fill('')
        },
        smallLetters() {
            return (this.height - 24)/this.length < 46
        }
    },
    mounted() {
        this.adjustGridSize()
        window.addEventListener('resize', this.adjustGridSize)
    },
    methods: {
        adjustGridSize() {
            const width = (this.length * 60) + ((this.length - 1) * 4) + 24;
            const height = (this.tries * 60) + ((this.tries - 1) * 4) + 24;
            
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;

            const headerHeight = document.getElementById('header').offsetHeight;
            const keyboardHeight = document.getElementById('keyboard').offsetHeight;
        
            const remainingHeight = windowHeight - (headerHeight + keyboardHeight)
            let heightRatio = remainingHeight/height 
            if (heightRatio > 1) heightRatio = 1

            this.height = heightRatio * height
            this.width = heightRatio * width

            if (this.width > windowWidth) {
                let widthRatio = windowWidth/this.width
                console.log(widthRatio)
                this.height = this.height * widthRatio
                this.width = this.width * widthRatio
            }

            this.$refs['grid'].style.height = this.height + 'px'
            this.$refs['grid'].style.width = this.width + 'px'
        }
    },
    watch: {
        length() {
            this.adjustGridSize()
        },
        tries() {
            this.adjustGridSize()
        }
    }
}
</script>

<style>

</style>