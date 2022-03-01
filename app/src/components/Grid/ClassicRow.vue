<template>
    <div class="flex flex-1 justify-center mb-1 last:mb-0" :class="[
        ]" :guess="guess">
        <Cell v-for="(char, index) in convertedGuess" :animations="!correct" :small="small" :key="index" :value="char[0]" :status="char[1]" :hint="hints[index]"/>
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
        },
        length: {
            type: Number,
            default: 0
        }
    },
    computed: {
        convertedGuess() {
            if (Array.isArray(this.value)) return this.value
            
            const guess = this.value.split('')
            const guessArray = []
            for (let i = 0; i < guess.length; i++) {
                guessArray.push([guess[i], ''])
            }
            for (let i = 0; i < this.length - guess.length; i++ ) {
                guessArray.push(['', ''])
            }
            return guessArray
        },
        correct() {
            function checkStatus(letter) {
                return letter[1] === 2
            }
            return this.convertedGuess.every(checkStatus)
        },
        indexedGuess() {
            const newItems = []
            this.convertedGuess.forEach((elem, index) => {
              newItems.push( elem.push(index) )  
            })
            return newItems
        }
    },
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