<template>
  <div
    class="overflow-hidden w-full h-full flex flex-col items-stretch bg-gray-50 dark:bg-gray-900 relative"
  >
    <AppModals />
    <Navbar />
    <Content />
    <Keyboard />
  </div>
</template>

<script>
import Alert from './components/base/Alert.vue';

import Navbar from './components/Navbar.vue';
import Modals from './components/app/Modals.vue';
import Content from './components/app/Content.vue';

import Keyboard from './components/Keyboard/MutateKeyboard';

function fancyTimeFormat(duration) {
  // Hours, minutes and seconds
  var hrs = ~~(duration / 3600);
  var mins = ~~((duration % 3600) / 60);
  var secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = '';

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;
  return ret;
}

export default {
  name: 'App',
  components: {
    Alert,
    Navbar,
    Content,
    Keyboard,
    Modals,
  },
  data() {
    return {
      about: false,
      setting: false,
      update: false,
      info: false,
      timeRemaining: null,
      selecting: false,
    };
  },
  computed: {
    mode() {
      return this.$store.state.game.mode;
    },
    colorBlind() {
      return this.$store.state.settings.colorBlind;
    },
    textPrimary() {
      return this.colorBlind ? 'text-blue-500' : 'text-green-500';
    },
    textSecondary() {
      return this.colorBlind ? 'text-orange-500' : 'text-yellow-400';
    },
    length() {
      return this.$store.state.length;
    },
    alert() {
      return this.$store.state.admin.alert;
    },
    time() {
      return this.$store.state.time;
    },
    startTime() {
      return this.$store.state.startTime;
    },
    endTime() {
      return this.startTime + this.time;
    },
    timeChallenge() {
      return this.$store.state.settings.timeChallenge;
    },
    end() {
      return this.$store.state.ended;
    },
    score() {
      return this.$store.state.admin.score;
    },
    newVersion() {
      return this.$store.state.storage.newVersion;
    },
    percentRemaining() {
      if (this.timeRemaining) return this.timeRemaining / this.time;
      return null;
    },
    fancyTmeRemaining() {
      if (!this.timeRemaining) return;
      return fancyTimeFormat(this.timeRemaining / 1000 + 1);
    },
  },
  methods: {
    selectMode() {
      this.selecting = true;
    },
    changeMode(payload) {
      this.$store.dispatch('game/change', payload);
      this.selecting = false;
    },
    /*
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
    }*/
  },
  mounted: function () {
    this.$store.dispatch('init');

    if (!localStorage.instructions) this.about = true;
    localStorage.instructions = true;
  },

  watch: {
    end() {
      if (this.end === true) {
        this.score = true;
      }
    },
    startTime() {
      // if (!this.timeRemaining && this.timeChallenge) this.startTimer()
    },
  },
};
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
