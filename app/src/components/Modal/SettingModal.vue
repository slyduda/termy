<template>
    <Transition :name="reducedMotion ? 'none' : 'slide'">
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
                        <h5 class="text-lg leading-snug">Reduced Motion</h5>
                        <p class="text-xs leading-snug">Avoid animations that might make you queasy.</p>
                    </div>
                    <div class="flex items-center">
                        <Toggle :value="reducedMotion" @toggle="$store.dispatch('settings/toggleReducedMotion')"/>
                    </div>
                </div>
                <!--
                <div class="border-b border-solid border-gray-300 dark:border-gray-700 py-4 text-left flex justify-between">
                    <div>
                        <h5 class="text-lg leading-snug">Time Challenge</h5>
                        <p class="text-xs leading-snug">Play with a timer for an extra challenge</p>
                    </div>
                    <div class="flex items-center">
                        <Toggle :value="timeChallenge" @toggle="$store.dispatch('settings/toggleTimeChallenge')"/>
                    </div>
                </div>
                -->
                <div class="border-b border-solid border-gray-300 dark:border-gray-700 py-4 text-left flex justify-between">
                    <div>
                        <h5 class="text-lg leading-snug">Feedback</h5>
                        <p class="text-xs leading-snug">Termy is a collectively owned word game!</p>
                    </div>
                    <div class="flex items-center">
                        <a class="underline text-lg mr-4" href="https://github.com/slyduda/termy">Github</a>
                        <a class="underline text-lg" href="https://twitter.com/termygg">Twitter</a>
                    </div>
                </div>
                <button class="absolute top-4 right-0" @click="toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                        <path  class="fill-gray-900 dark:fill-white"  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                    </svg>
                </button>
                <div class="bottom-0 flex justify-between w-full absolute pb-2">
                    <div class="">© Sylvester Duda</div>
                    <div class="font-bold text-lg"># {{ id }}</div>
                </div>
            </div>
        </div>
    </Transition>
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
        reducedMotion() {
            return this.$store.state.settings.reducedMotion;
        },
        id() {
            return this.$store.state.game.id
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
.slide-enter-active,
.slide-leave-active {
    transition: 0.5s;
    transform: translateY(0%);
}


.slide-enter-from {
    transform: translateY(100%);
}

.slide-leave-to {
    transform: translateY(100%);
}

</style>