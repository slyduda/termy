<template>
    <div v-if="visible" class="w-full h-full absolute z-50 flex justify-center items-center" >
        <div class="w-full h-full bg-gray-900 opacity-50 absolute">

        </div>
        <div class="w-full max-w-xs mx-4 dark:text-white p-6 text-sm relative bg-white relative rounded-lg dark:bg-gray-800">
            <div class="mb-4">
                <h4 class="text-lg font-semibold mb-2 text-left flex items-center">
                    Active Union Efforts                
                </h4>
                
                <div class="text-left mb-2">
                    <h6 class="font-bold">Starbucks</h6>
                    <a href="https://sbworkersunited.org/new-page-1" class="underline">SB Workers United</a>
                    <p>Support: To be added</p>
                </div>

                <div class="text-left mb-2">
                    <h6 class="font-bold">REI</h6>
                    <a href="https://twitter.com/UnionElections/status/1484933120830980100" class="underline">REI New York City</a>
                    <p>Support: To be added</p>
                </div>

                <div class="text-left mb-2">
                    <h6 class="font-bold">JORTS</h6>
                    <a href="https://twitter.com/JortsTheCat/status/1491162082649440258" class="underline">How to form</a>
                </div>
            </div>

            <button class="absolute top-4 right-4" @click="toggle">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path  class="fill-gray-900 dark:fill-white"  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InfoModal',
    props: {
        visible: {
            type: Boolean,
            default: false,
        }
    },
    methods: {
        toggle() {
            this.$emit('toggle')
        },
    }
}
</script>

<style>

</style>
