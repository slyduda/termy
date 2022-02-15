<template>
    <div v-if="visible" class="w-full h-full absolute z-50 flex justify-center items-center" >
        <div class="w-full h-full bg-gray-900 opacity-50 absolute">

        </div>
        <div class="w-full max-w-xs mx-4 dark:text-white p-6 text-sm relative bg-white relative rounded-lg dark:bg-gray-800">
            <div class="mb-4">
                <h4 class="text-lg font-semibold mb-2 text-left flex items-center">
                    Updates                
                </h4>
                
                <ul class="text-left list-disc list-inside">
                    <li>Added Updates Menu accessible from the Navbar on each client update.</li>
                    <li>Fixed Current Streak and Max Streak on Stats Menu.</li>
                    <li>Added Feedback Options in Settings Menu.</li>
                    <li>Fixed bug that gave wins on successful guesses <strong>after</strong> 6 tries.</li>
                </ul>
            </div>
        
            <div class="">    
                <h4 class="text-lg font-semibold mb-2 text-left flex items-center">
                    Up Next                
                </h4>
                
                <ul class="text-left list-disc list-inside">
                    <li>Type, win, lose, etc animations</li>
                    <li>New modes 🤫</li>
                    <li>Classic colors togglable via Color Blind Mode Off</li>
                    <li>Color fixes</li>
                </ul>
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
    name: 'AboutModal',
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
