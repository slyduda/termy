<template>
    <div class="w-full h-full absolute z-50 flex justify-center items-center pointer-events-none" >
        <Transition :name="reducedMotion ? 'none' : 'fade'">
            <div v-if="visible" class="w-full h-full bg-gray-900 opacity-50 absolute pointer-events-auto">
            </div>
        </Transition>
        <Transition :name="reducedMotion ? 'none' : 'bounce'">
            <div v-if="visible" class="w-full max-w-xs mx-4 dark:text-white p-6 text-sm relative bg-white relative rounded-lg dark:bg-gray-800 pointer-events-auto">
                <div class="mb-4">
                    
                    <h4 class="text-lg font-semibold mb-2 text-left flex items-center">
                        OOPS!!!                
                    </h4>
                    
                    <ul class="text-left list-disc list-inside">
                        <li><strong>Noctus</strong> is not a word! Termy+ 34 was fixed and changed to a different word at 6:05PM PST and will be marked as a freebie to preserve everyones max and current streaks!</li>
                    </ul>
                </div>
            
                <div class="">    
                    <h4 class="text-lg font-semibold mb-2 text-left flex items-center">
                        Up Next                
                    </h4>
                    
                    <ul class="text-left list-disc list-inside">
                        <li>Termutate is almost ready. Further balancing needs to be done for it to be fun!</li>
                        <li>Accessibility fixes</li>
                        <li>Color fixes</li>
                    </ul>
                </div>

                <button class="absolute top-4 right-4" @click="toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                        <path  class="fill-gray-900 dark:fill-white"  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                    </svg>
                </button>
            </div>
        </Transition>
    </div>
</template>

<script>
export default {
    name: 'UpdateModal',
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
