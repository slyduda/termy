<template>
    <div v-if="visible" class="w-full h-full bg-gray-50 absolute px-4 z-50 dark:bg-gray-900 flex justify-center" >
        <div class="w-full max-w-lg dark:text-white text-sm relative">
            <div class="border-b border-solid border-gray-300 dark:border-gray-700 py-4 text-left">
                <h1 class="font-semibold mb-2 text-center">HOW TO PLAY</h1>
                <p class="my-2">Guess the Termy in 6 or less tries.</p>
                <p class="my-2">Each guess must be a valid word of the corresponding length. Hit the <strong>Enter</strong> button to submit.</p>
                <p class="my-2">After each guess, the color of the tiles will change to show how close your guess was to the word.</p>    
            </div>
            <div class="border-b border-solid border-gray-300 dark:border-gray-700 py-4 text-left">
                <h5 class="">Examples</h5>
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
export default {
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
