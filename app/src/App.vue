<template>
  <div class="overflow-hidden w-full h-full flex flex-col items-stretch bg-gray-50 dark:bg-gray-900 relative">

    <AboutModal @toggle="about = !about" :visible="about"/>
    <SettingModal @toggle="setting = !setting" :visible="setting"/>
    <ScoreModal @toggle="score = !score" :visible="score"/>
    <ContinueModal :visible="$store.state.tries === $store.state.guesses.length && !$store.state.ended && $store.state.guesses.length < 10" />
    <InfoModal @toggle="info = !info" :visible="info" />
    <UpdateModal @toggle="update = !update" :visible="update" />
    <div class="w-full absolute mt-3 flex justify-center">
      <Alert :message="alert"/>
    </div>
    <div id="header" class="w-full py-2 max-w-7xl mx-auto border-b border-solid border-gray-300 dark:border-gray-700">
        <div class="w-full max-w-lg mx-auto">
          <div class="flex justify-between items-center mx-2">
            <div class="flex">
                <button @click="about = !about" class="p-2 flex justify-center items-center">
                  <font-awesome-icon icon="info-circle" class="text-2xl" :class="['text-gray-900 dark:text-gray-100']"></font-awesome-icon>
                </button>
                <button v-if="version" class="p-2 flex justify-center items-center" @click="update = !update; $store.dispatch('storage/newVersion', false);">
                  <font-awesome-icon icon="circle-exclamation" class="text-2xl" :class="['text-gray-900 dark:text-gray-100']"></font-awesome-icon>
                </button>
                <button v-else class="p-2 flex justify-center items-center" @click="info = !info">
                  <font-awesome-icon icon="fist-raised" class="text-2xl" :class="['text-gray-900 dark:text-gray-100']"></font-awesome-icon>
                </button>
                <div v-if="timeChallenge" class="ml-4 text-gray-400 dark:text-gray-600 font-bold">{{ fancyTmeRemaining }}</div>
            </div>
            <div class="relative">
              <button @click="selectMode" v-if="mode === 'classic'" class="text-4xl grow font-bold dark:text-white flex items-center justify-center">
                <h1 class="tracking-widest">TERMY</h1>
                <font-awesome-icon class="text-xl ml-1" icon="caret-down" />
              </button>
              <button @click="selectMode" v-else-if="mode === 'plus'" class="text-4xl grow font-bold dark:text-white flex items-center justify-center">
                <h1 class="tracking-widest">TERMY</h1>
                <div class="font-extrabold leading-none" :class="[textPrimary]" style="font-size: 2.5rem;">+</div>
                <font-awesome-icon class="text-xl ml-1" icon="caret-down" />  
              </button>
              <button @click="selectMode" v-else class="text-4xl grow font-bold dark:text-white flex items-center justify-center">
                <h1 class="tracking-widest text-3xl flex">TERM<p class="tracking-normal" :class="[textPrimary]">UTATE</p></h1>
                <font-awesome-icon class="text-xl ml-1" icon="caret-down" />
              </button>
              <p class="hidden absolute text-xs -right-8 bottom-0 text-gray-400 dark:text-gray-600 font-bold">BETA</p>
            
            </div>
            <div class="flex">
                <button class="p-2 flex justify-center items-center" @click="score = !score">
                    <font-awesome-icon icon="chart-pie" class="text-2xl" :class="['text-gray-900 dark:text-gray-100']"></font-awesome-icon>
                </button>
                <button class="p-2 flex justify-center items-center" @click="setting = !setting">
                    <font-awesome-icon icon="gear" class="text-2xl" :class="['text-gray-900 dark:text-gray-100']"></font-awesome-icon>
                </button>
            </div>
          </div>
        </div>
    </div>
    <Transition :name="reducedMotion ? 'none' : 'fade'">
      <div v-if="selecting" @click="selecting = false" class="w-full h-full absolute pointer-events-auto z-50">
          <div class="w-full h-full bg-gray-900 opacity-50"></div>
      </div>
    </Transition>
    <Transition>
      <div v-if="selecting" class="absolute w-full h-full z-50 pointer-events-none">
        <div class="z-50 mx-auto max-w-xs w-full bg-white dark:bg-gray-800 dark:text-white p-4 rounded-lg mt-14 pointer-events-auto">
          <button @click="switchMode('classic')" class="mb-4 text-left text-sm w-full">
            <div class="flex items-center text-2xl font-bold tracking-widest">
              TERMY
            </div>
            The 5-letter guessing you know and love.
          </button>
          <button @click="switchMode('plus')" class="mb-4 text-left text-sm w-full">
            <div class="flex text-2xl font-bold tracking-widest">
              TERMY
              <div class="font-extrabold leading-none text-3xl" :class="[textPrimary]">+</div>
              <!-- 
              <font-awesome-icon icon="plus" :class="[textPrimary]" />
              -->
            </div>
            Regular Termy but with a 6-letter twist.
          </button>
          <button @click="switchMode('mutate')" class="text-left text-sm w-full">
            <div class="flex items-center text-2xl font-bold tracking-widest">
              TERM<p class="tracking-normal" :class="[textPrimary]">UTATE</p>
            </div>
            Make words with the letters you're given.
          </button>
        </div>
      </div>
    </Transition>
    <div v-if="timeRemaining" class="overflow-hidden">
      <div class="max-w-7xl border-b-4 border-solid border-blue-500 overflow-hidden" 
        :style="{width: `${100 - (percentRemaining*100) }%` }">
      </div>
    </div>
    <Grid class="flex-shrink flex-grow" :key="length"/> 
    <Keyboard />
  </div>
</template>

<script>
import Alert from './components/base/Alert.vue'
import UpdateModal from './components/Modal/UpdateModal.vue'
import InfoModal from './components/Modal/InfoModal.vue'
import ScoreModal from './components/Modal/ScoreModal.vue'
import SettingModal from './components/Modal/SettingModal.vue'
import ContinueModal from './components/Modal/ContinueModal.vue'
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
    InfoModal,
    Alert,
    ContinueModal,
    UpdateModal
  },
  data() {
    return {
      about: false,
      setting: false,
      score: false,
      update: false,
      info: false,
      timeRemaining: null,
      selecting: false,
    }
  },
  computed: {
    mode() {
      if (this.$store.state.mode === 'termutation') return 'mutation'
      return this.length === 6 ? 'plus' : 'classic' 
    },
    colorBlind() {
        return this.$store.state.settings.colorBlind;
    },
    textPrimary() { 
        return this.colorBlind ? 'text-blue-500' : 'text-green-500'
    },
    textSecondary() {
        return this.colorBlind ? 'text-orange-500' : 'text-yellow-400'
    },
    length() {
      return this.$store.state.length
    },
    alert() {
      return this.$store.state.admin.alert
    },
    time() {
      return this.$store.state.time
    },
    startTime() {
      return this.$store.state.startTime
    },
    endTime() {
      return this.startTime + this.time
    },
    timeChallenge() {
      return this.$store.state.settings.timeChallenge
    },
    end() {
        return this.$store.state.ended
    },
    version() {
      return this.$store.state.storage.version
    },
    percentRemaining() {
      if (this.timeRemaining) return this.timeRemaining/this.time
      return null
    },
    fancyTmeRemaining() {
      if (!this.timeRemaining) return
      return fancyTimeFormat(this.timeRemaining/1000 + 1)
    },
  },
  methods: {
    selectMode() {
      this.selecting = true
    },
    switchMode(payload) {
      this.$store.dispatch('switchMode', payload)
      this.selecting = false
    },
    keyDown: function (event) {
      if (event.key === 'Enter') {
        this.$store.dispatch('submit')
      } else if (event.key === 'Backspace') {
        this.$store.dispatch('removeLetter')
      }  else if (ALPHABET.indexOf(event.key.toUpperCase()) >= 0) {
        this.$store.dispatch('addLetter', event.key.toUpperCase())
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
    const p = document.getElementById('p_elem').value
    const id = document.getElementById('i_elem').value
    
    const payload = {
      p,
      id,
      5: five,
      6: six
    }

    this.$store.dispatch('load', payload)

    if (!localStorage.instructions) this.about = true
    localStorage.instructions = true
  },

  unmounted: function () {
    window.removeEventListener('keydown', this.keyDown)
  },

  watch: {
    end() {
      if (this.end === true) {
        this.score = true
      }
    },
    startTime() {
      if (!this.timeRemaining && this.timeChallenge) this.startTimer()
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

* {
  margin: 0;
  padding: 0;
}
</style>
