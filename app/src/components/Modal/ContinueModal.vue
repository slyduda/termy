<template>
    <div v-if="visible" class="w-full h-full absolute z-50 flex justify-center items-center" >
        <Transition :name="reducedMotion ? 'none' : 'fade'">
        <div class="w-full h-full bg-gray-900 opacity-50 absolute">
        </div>
        </Transition>
        <Transition :name="reducedMotion ? 'none' : 'bounce'">
            <div class="w-full max-w-xs mx-4 dark:text-white p-6 text-sm relative bg-white relative rounded-lg dark:bg-gray-800">
                <h4 class="text-lg font-semibold mb-2 text-left">KEEP PLAYING?</h4>
                <p class="mb-4 text-left">You didn't get the word in 6 tries, but you can still keep trying if you want! Your game will still be marked as a loss.</p>
                <div class="flex">
                    <div class="mr-2 flex-1">
                        <button @click="cont" class="rounded-lg h-12 text-white text-xl font-semibold w-full" :class="[bgPrimary]">Continue</button>
                    </div>
                    <div class="ml-2 flex-1">
                        <button @click="quit" class="rounded-lg h-12 text-white text-xl font-semibold w-full" :class="[bgSecondary]">Give Up</button>    
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script>

export default {
    props: ['visible'],
    methods: {

        cont() {
            this.$store.dispatch(`game/${this.mode}/continue`, 4)
        },
        quit() {
            this.$store.dispatch(`game/${this.mode}/end`, false)
            this.$store.dispatch('admin/alert', this.solution)
            
            const that = this
            setTimeout(function() {
                that.$store.dispatch('admin/score')
            }, 2000)
        }
    },
    computed: {
        solution() {
            return this.$store.state.game[this.mode].solution
        },
        mode() {
            return this.$store.state.game.mode
        },
        colorBlind() {
            return this.$store.state.settings.colorBlind;
        },
        bgPrimary() { 
            return this.colorBlind ? 'bg-blue-500' : 'bg-green-500'
        },
        bgSecondary() {
            return this.colorBlind ? 'bg-orange-500' : 'bg-yellow-400'
        },
    }
}
</script>

<style>

</style>
