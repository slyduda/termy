<template>
    <div v-if="visible" class="w-full h-full bg-gray-50 absolute px-4 z-50 dark:bg-gray-900 flex justify-center" >
        <div class="w-full max-w-lg dark:text-white text-sm relative">
            <div class="py-4 text-left">
                <h1 class="font-semibold mb-2 text-center">SETTINGS</h1>
            </div>
            <div class="border-b border-solid border-gray-300 dark:border-gray-700 py-4 text-left flex justify-between">
                <div>
                    <h5 class="text-lg leading-snug">Dark Theme</h5>
                    <p class="text-xs leading-snug">Toggle between light and dark mode</p>
                </div>
                <div class="flex items-center">
                    <Toggle :value="darkTheme" @toggle="$store.dispatch('settings/toggleDarkTheme')"/>
                </div>
            </div>
            <div class="border-b border-solid border-gray-300 dark:border-gray-700 py-4 text-left flex justify-between">
                <div>
                    <h5 class="text-lg leading-snug">Color Blind Mode</h5>
                    <p class="text-xs leading-snug">High contrast colors</p>
                </div>
                <div class="flex items-center">
                    <Toggle :value="colorBlind" @toggle="$store.dispatch('settings/toggleColorBlind')"/>
                </div>
            </div>
            <div class="border-b border-solid border-gray-300 dark:border-gray-700 py-4 text-left flex justify-between">
                <div>
                    <h5 class="text-lg leading-snug">Letter Helper</h5>
                    <p class="text-xs leading-snug">Lightly display your correct guesses.</p>
                </div>
                <div class="flex items-center">
                    <Toggle :value="letterHelper" @toggle="$store.dispatch('settings/toggleLetterHelper')"/>
                </div>
            </div>
            <div class="border-b border-solid border-gray-300 dark:border-gray-700 py-4 text-left flex justify-between">
                <div>
                    <h5 class="text-lg leading-snug">Time Challenge</h5>
                    <p class="text-xs leading-snug">Play with a timer for an extra challenge</p>
                </div>
                <div class="flex items-center">
                    <Toggle :value="timeChallenge" @toggle="$store.dispatch('settings/toggleTimeChallenge')"/>
                </div>
            </div>
            <button class="absolute top-4 right-0" @click="toggle">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path  class="fill-gray-900 dark:fill-white"  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </svg>
            </button>
            <div class="bottom-0 right-0 absolute"># {{ id }}</div>
        </div>
    </div>
</template>

<script>
import Toggle from '../base/Toggle.vue'

export default {
    components: {
        Toggle
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        }
    },
    mounted() {
        this.$store.dispatch('settings/load')
    },
    computed: {
        timeChallenge() {
            return this.$store.state.settings.timeChallenge;
        },
        letterHelper() {
            return this.$store.state.settings.letterHelper;
        },
        darkTheme() {
            return this.$store.state.settings.darkTheme;
        },
        colorBlind() {
            return this.$store.state.settings.colorBlind;
        },
        id() {
            return this.$store.state.id
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