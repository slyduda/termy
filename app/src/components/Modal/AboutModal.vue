<template>
    <div v-if="visible" class="w-full h-full overflow-hidden bg-gray-50 absolute px-4 z-50 dark:bg-gray-900 flex justify-center" >
        <div class="w-full max-w-lg dark:text-white text-sm relative">
            <div class="border-b border-solid border-gray-300 dark:border-gray-700 py-4 text-left">
                <h1 class="font-semibold mb-2 text-center">HOW TO PLAY</h1>
                <p class="my-2">Guess the Termy in 6 or less tries.</p>
                <p class="my-2">Each guess must be a valid word of the corresponding length. Hit the <strong>Enter</strong> button to submit.</p>
                <p class="my-2">After each guess, the color of the tiles will change to show how close your guess was to the word.</p>    
            </div>
            <div class="border-b border-solid border-gray-300 dark:border-gray-700 py-4 text-left">
                <h5 class="">Examples</h5>
                <div class="inline-flex my-2">
                    <Cell :status="2" :value="'T'" class="w-12 h-12" />
                    <Cell :status="''" :value="'I'" class="w-12 h-12" />
                    <Cell :status="''" :value="'M'" class="w-12 h-12" />
                    <Cell :status="''" :value="'E'" class="w-12 h-12" />
                    <Cell :status="''" :value="'S'" class="w-12 h-12" />
                </div>
                <p class="mb-2">The letter T is in the word and in the correct spot.</p>
                <div class="inline-flex my-2">
                    <Cell :status="''" :value="'B'" class="w-12 h-12" />
                    <Cell :status="1" :value="'U'" class="w-12 h-12" />
                    <Cell :status="''" :value="'S'" class="w-12 h-12" />
                    <Cell :status="''" :value="'T'" class="w-12 h-12" />
                    <Cell :status="''" :value="'S'" class="w-12 h-12" />
                </div>
                <p class="mb-2">The letter U is in the word but in the wrong spot.</p>
                <div class="inline-flex my-2">
                    <Cell :status="''" :value="'U'" class="w-12 h-12" />
                    <Cell :status="''" :value="'N'" class="w-12 h-12" />
                    <Cell :status="0" :value="'I'" class="w-12 h-12" />
                    <Cell :status="''" :value="'O'" class="w-12 h-12" />
                    <Cell :status="''" :value="'N'" class="w-12 h-12" />
                </div>
                <p class="mb-2">The letter I is not in the word.</p>
            </div>
            <div class="py-4 text-left">
                <h5 class="">A new Termy will be available each day! Check back for more challenges and modes.</h5>
            </div>
            <button class="absolute top-4 right-0" @click="toggle">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path class="fill-gray-900 dark:fill-white" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
import Cell from '../Grid/Cell.vue';

export default {
    components: {
        Cell
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        }
    },
    methods: {
        toggle() {
            this.$emit('toggle')
        }
    }
}
</script>

<style>

</style>
