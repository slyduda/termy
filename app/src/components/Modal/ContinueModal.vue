<template>
    <div v-if="visible" class="w-full h-full absolute z-50 flex justify-center items-center" >
        <div class="w-full h-full bg-gray-900 opacity-50 absolute">
        </div>
        <div class="w-full max-w-xs mx-4 dark:text-white p-6 text-sm relative bg-white relative rounded-lg dark:bg-gray-800">
            <h4 class="text-lg font-semibold mb-2 text-left">KEEP PLAYING?</h4>
            <p class="mb-4 text-left">You didn't get the word in 6 tries, but you can still keep trying if you want! Your game will still be marked as a loss.</p>
            <div class="flex">
                <div class="mr-2 flex-1">
                    <button @click="cont" class="rounded-lg bg-blue-500 h-12 text-white text-xl font-semibold w-full">Continue</button>
                </div>
                <div class="ml-2 flex-1">
                    <button class="rounded-lg bg-orange-500 h-12 text-white text-xl font-semibold w-full" @click="quit">Give Up</button>    
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: ['visible'],
    methods: {
        cont() {
            this.$store.dispatch('continue', 4)
            this.$store.commit('playing', true)
        },
        quit() {
            this.$store.dispatch('fail')
            this.$store.commit('playing', true)
        }
    }
}
</script>

<style>

</style>
