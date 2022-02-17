<template>
    <div class="flex flex-1 justify-center mb-1 last:mb-0" :class="[
        {'row-animation': checked && current}
        ]" :guess="guess">
        <Cell v-for="char in convertedGuess" :small="small" :key="char[2]" :value="char[0]" :status="char[1]" :hint="hints[char[2]]"/>
    </div>
</template>

<script>
import Cell from './Cell.vue'

export default {
    components: {
        Cell
    },
    props: {
        current: {
            type: Boolean,
            default: false
        },
        value: {
            type: [Array, String],
            default: ''
        },
        hints: {
            type: Array,
            default: function() {
                return []
            }
        },
        small: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        checked() {
            return this.$store.state.checked
        },
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
        },
        indexedGuess() {
            const newItems = []
            this.convertedGuess.forEach((elem, index) => {
              newItems.push( elem.push(index) )  
            })
            return newItems
        }
    },
    watch: {
        checked() {
            const that = this
            if (this.checked) { 
                setTimeout(() => {
                    that.$store.dispatch('checkedCaught')
                } , 500 )
            }
        }
    }
}
</script>

<style>
.row-animation {
 animation-name: shake;
 animation-iteration-count: 3;
 animation-timing-function: ease;
 animation-duration: .15s; /* or: Xms */
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(10px);
  }
  75% {
    transform: translateX(-10px);
  }
100% {
    transform: translateX(0);
  }
}
</style>