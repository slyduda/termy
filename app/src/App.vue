<template>
  <div class="w-full h-full flex-col items-stretch bg-gray-50 dark:bg-gray-900 ">

    <AboutModal @toggle="about = !about" :visible="about"/>
    <SettingModal @toggle="setting = !setting" :visible="setting"/>
    <ScoreModal @toggle="score = !score" :visible="score"/>
    <div class="w-full absolute mt-3 flex justify-center">
      <Alert :message="alert"/>
    </div>
    <div class="py-2 max-w-7xl mx-auto border-b border-solid border-gray-300 dark:border-gray-700">
        <div class="w-full max-w-lg flex justify-center mx-auto items-center relative">
            <div class="left-2 absolute flex">
                <button @click="about = !about">
                    <svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24">
                        <path class="fill-gray-900 dark:fill-white" d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path>
                    </svg>
                </button>
                <div v-if="timeChallengeMode" class="ml-4 text-gray-400 dark:text-gray-600 font-bold">{{ niceTimeRemaining }}</div>
            </div>
            <div class="relative">
              <button v-if="!plusMode" @click="$store.dispatch('plusMode')" class="text-4xl grow font-bold dark:text-white">
                <h1>TERMY</h1>
              </button>
              <button v-else @click="$store.dispatch('plusMode')" class="text-4xl grow font-bold dark:text-white flex">
                <h1>TERMY</h1>
                <strong class="text-blue-500 font-black">+</strong>  
              </button>
              <p class="absolute text-xs -right-8 bottom-0 text-gray-400 dark:text-gray-600 font-bold">BETA</p>
            
            </div>
            <div class="right-2 absolute">
                <button class="mr-4" @click="score = !score">
                    <svg xmlns="http://www.w3.org/2000/svg"  height="24" viewBox="0 0 24 24" width="24">
                        <path class="fill-gray-900 dark:fill-white" d="M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z"></path>
                    </svg>
                </button>
                <button @click="setting = !setting">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                        <path class="fill-gray-900 dark:fill-white" d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
    <div v-if="timeRemaining" class="overflow-hidden">
      <div class="max-w-7xl border-b-4 border-solid border-blue-500 overflow-hidden" 
        :style="{width: `${100 - (percentTimeRemaining*100) }%` }">
      </div>
    </div>
    <Grid class="flex-shrink flex-grow flex-1"/>
    <Keyboard class="flex-grow-0"/>
  </div>
</template>

<script>
import Alert from './components/base/Alert.vue'
import ScoreModal from './components/Modal/ScoreModal.vue'
import SettingModal from './components/Modal/SettingModal.vue'
import AboutModal from './components/Modal/AboutModal.vue'
import Grid from './components/Grid/Grid.vue'
import Keyboard from './components/Keyboard/Keyboard.vue'

function fancyTimeFormat(duration)
{   
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

const ALPHABET = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M'
]

export default {
  name: 'App',
  components: {
    Grid,
    Keyboard,
    AboutModal,
    SettingModal,
    ScoreModal,
    Alert
  },
  data() {
    return {
      about: false,
      setting: false,
      score: false,
      timeRemaining: null,
    }
  },
  computed: {
    plusMode() {
      return this.$store.state.length === 6
    },
    celebrate() {
        return this.$store.state.celebrated
    },
    startTime() {
      return this.$store.state.startTime
    },
    timeChallengeMode() {
      return this.$store.state.modeTimeChallenge
    },
    time() {
      return this.$store.state.time
    },
    endTime() {
      return this.startTime + this.time
    },
    percentTimeRemaining() {
      if (this.timeRemaining) return this.timeRemaining/this.time
      return null
    },
    niceTimeRemaining() {
      if (!this.timeRemaining) return
      return fancyTimeFormat(this.timeRemaining/1000 + 1)
    },
    alert() {
      return this.$store.state.alert
    }
  },
  methods: {
    keyDown: function (event) {

      console.log(event.key)
      if (ALPHABET.indexOf(event.key.toUpperCase()) >= 0) {
        this.$store.dispatch('addLetter', event.key.toUpperCase())
      } else if (event.key === 'Enter') {
        this.$store.dispatch('submit')
      } else if (event.key === 'Backspace') {
        this.$store.dispatch('removeLetter')
      }  

    },
    startTimer() {
      const d = new Date()
      this.timeRemaining = this.endTime - d.getTime()
      const that = this
      setTimeout(() => {
        if (this.timeRemaining > 0) {
          this.startTimer()
        } else { 
          that.$store.dispatch('fail')
        }
      }, 100)
    }
  },
  mounted: function () {
    window.addEventListener('keydown', this.keyDown)
    const five = document.getElementById('f_elem').value
    const six = document.getElementById('s_elem').value
    const payload = document.getElementById('p_elem').value
    const p = {
      five,
      six,
      payload 
    }
    this.$store.dispatch('setState', p)
    this.$store.dispatch('refreshState')
  },

  unmounted: function () {
    window.removeEventListener('keydown', this.keyDown)
  },

  watch: {
    celebrate() {
      if (this.celebrate === true) {
        this.score = true
      }
    },
    startTime() {
      if (!this.timeRemaining && this.timeChallengeMode) this.startTimer()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
