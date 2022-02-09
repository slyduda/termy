<template>
    <div class="max-w-lg mx-auto object-scale-down flex justify-center items-center">
        <div ref="grid" class="flex flex-col p-6">
            <Row v-for="guess in guesses" :key="guess" :value="guess" class="flex-1" :small="smallLetters"/>
            <Row v-if="guesses.length < tries" id="currentRow" :value="current" :hints="hints" class="flex-1" :small="smallLetters"/>
            <Row v-for="guess in incomplete" :key="guess" :value="guess" class="flex-1" :small="smallLetters"/>
        </div>
    </div>
</template>

<script>
import Row from './Row.vue'

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
        guesses() {
            return this.$store.getters.guessResults
        },
        hints() {
            return this.$store.getters.hints
        },
        tries() {
            return this.$store.state.guesses.length > this.$store.state.tries ? this.$store.state.guesses.length : this.$store.state.tries 
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
        },
        length() {
            return this.$store.state.length 
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