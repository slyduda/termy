<template>
    <div class="max-w-lg mx-auto object-scale-down flex justify-center items-center">
        <div ref="grid" class="flex flex-col p-6">
            <div class="bg-gray-200"></div>
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
            return 1
        },
        tries() {
            return 1 
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
        },
        permutations() {
            return this.$store.state.getters['game/staging/permutations']
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