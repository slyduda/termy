<template>
    <button
        :style="{ 
            width: `${width}px`, 
            height: '58px' 
            }"
            style="touch-action: manipulation"
        class="flex items-center justify-center rounded mx-0.5 text-xs font-bold cursor-pointer select-none dark:text-white"
        :class="[
            {'bg-gray-200 dark:bg-gray-500 hover:bg-gray-300 active:bg-gray-400': !status},
            { 'bg-gray-400 dark:bg-gray-700 bg-gray-400 text-white': status === 'absent' },
            {'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white': status === 'correct'},
            { 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 dark:bg-orange-500 text-white': status === 'present' }
        ]"
        @click="handleClick($event, value)"
        >
        {{ value }}
    </button>
</template>

<script>
export default {
    props: {
        width: {
            type: Number,
            default: 40
        },
        value: {
            type: String,
            default: "Key"
        },
        status: {
            type: String,
            default: ""
        }
    },
    methods: {
        handleClick(event, val) {
            if (val === 'DELETE') { 
                this.$store.dispatch('removeLetter')
            } else if (val === 'ENTER') {
                this.$store.dispatch('submit')
            } else {
                this.$store.dispatch('addLetter', val)
            }
        }
    }
}
</script>

<style>

</style>