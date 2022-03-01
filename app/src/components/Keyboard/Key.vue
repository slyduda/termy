<template>
    <button
        :style="{ 
            width: `${width}px`, 
            height: '58px' 
            }"
            style="touch-action: manipulation"
        class="relative flex items-center justify-center rounded mx-0.5 text-xs font-bold cursor-pointer select-none dark:text-white"
        :class="[
            {'bg-gray-200 dark:bg-gray-500 hover:bg-gray-300 active:bg-gray-400': !status},
            { 'bg-gray-400 dark:bg-gray-700 bg-gray-400 text-white': status === 'absent' },
            { 'bg-gray-400 dark:bg-gray-700 bg-gray-400 text-grey-500 dark:text-gray-800': status === 'disabled' },
            {[`${bgPrimary} hover:${bgPrimaryHover} active:${bgPrimaryActive} text-white`]: status === 'correct'},
            {[`${bgSecondary} hover:${bgSecondaryHover} active:${bgSecondaryActive} text-white`]: status === 'present' }
        ]"
        @click="handleClick($event, value)"
        >
        <slot>
            {{ value }}
            <div v-if="count && count > 1" class="text-xs absolute right-0.5 top-0.5">{{ count }}</div>
        </slot>
    </button>
</template>

<script>
export default {
    props: {
        width: {
            type: Number,
            default: 40
        },
        count: {
            type: Number,
            default: 0,
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
    computed: {
        mode() {
            return this.$store.state.game.mode
        },
        colorBlind() {
            return this.$store.state.settings.colorBlind
        },
        bgPrimary() { 
            return this.colorBlind ? 'bg-blue-500' : 'bg-green-500'
        },
        bgPrimaryActive() { 
            return this.colorBlind ? 'bg-blue-700' : 'bg-green-700'
        },
        bgPrimaryHover() { 
            return this.colorBlind ? 'bg-blue-600' : 'bg-green-600'
        },
        bgSecondary() {
            return this.colorBlind ? 'bg-orange-500' : 'bg-yellow-400'
        },
        bgSecondaryActive() {
            return this.colorBlind ? 'bg-orange-700' : 'bg-yellow-600'
        },
        bgSecondaryHover() {
            return this.colorBlind ? 'bg-orange-600' : 'bg-yellow-500'
        }
    },
    methods: {
        handleClick(event, val) {
            if (val === 'UNDO') {
                this.$store.dispatch( 'game/' + this.mode + '/undoGuess')
            } else if (val === 'DELETE') { 
                this.$store.dispatch( 'game/' + this.mode + '/removeLetter')
            } else if (val === 'ENTER') {
                this.$store.dispatch('game/submit')
            } else {
                this.$store.dispatch( 'game/' + this.mode + '/addLetter', val)
            }
        }
    }
}
</script>

<style>

</style>