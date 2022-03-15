<template>
    <div class="w-full h-full absolute z-50 flex justify-center items-center pointer-events-none" >
        <Transition :name="reducedMotion ? 'none' : 'fade'">
            <div v-if="visible" class="w-full h-full absolute pointer-events-auto">
                <div class="w-full h-full bg-gray-900 opacity-50"></div>
            </div>
        </Transition>
        <Transition :name="reducedMotion ? 'none' : 'bounce'">
        <div v-if="visible" class="w-full pointer-events-auto max-w-xs mx-4 dark:text-white p-6 text-sm relative bg-white relative rounded-lg dark:bg-gray-800">
            <div v-if="mode === 'classic' || mode === 'plus'">
                <h4 class="text-lg font-semibold mb-2 text-left flex items-center">
                    STATISTICS
                    <button @click="statisticsToggle = !statisticsToggle">
                        <svg class="ml-2" id="SvgjsSvg1001" width="18" height="12" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs"><defs id="SvgjsDefs1002"></defs><polyline fill="none" id="SvgjsPolyline1008" points="0,0 8,9 16,0" stroke="white" stroke-width="4"></polyline></svg>        
                    </button>
                </h4>
                <div class="flex mb-4" v-if="statisticsToggle">
                    <div class="flex flex-col flex-1">
                        <p class="text-4xl">{{ gamesPlayed }}</p>
                        <h5 class="text-xs">Played</h5>
                    </div>
                    <div class="flex flex-col flex-1">
                        <p class="text-4xl">{{ winPercentage }}</p>
                        <h5 class="text-xs">Win %</h5>
                    </div>
                    <div class="flex flex-col flex-1">
                        <p class="text-4xl">{{ currentStreak }}</p>
                        <h5 class="text-xs">Current Streak</h5>
                    </div>
                    <div class="flex flex-col flex-1">
                        <p class="text-4xl">{{ maxStreak }}</p>
                        <h5 class="text-xs">Max Streak</h5>
                    </div>
                </div>
                <h4 class="text-lg font-semibold mb-2 text-left flex items-center">
                    DISTRIBUTION
                    <button @click="distributionToggle = !distributionToggle">
                        <svg class="ml-2" id="SvgjsSvg1001" width="18" height="12" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs"><defs id="SvgjsDefs1002"></defs><polyline fill="none" id="SvgjsPolyline1008" points="0,0 8,9 16,0" stroke="white" stroke-width="4"></polyline></svg>        
                    </button>
                </h4>
                <div class="mb-4 flex flex-col" v-if="distributionToggle">
                    <div v-for="index in Object.entries(distribution)" :key="index[0]" class="flex-1 flex w-full pb-0.5">
                        <h5 class="w-6 flex-shrink-0">{{ index[0] }}</h5>
                        <Bar :percent="index[1]/distribution[modeStats]*100" :value="index[1]"/>
                    </div>
                </div>
                <div v-if="startTime" class="text-left">
                    <h4 class="text-lg font-semibold mb-2 inline-flex items-center">
                        RESULTS                    
                        <button @click="resultsToggle = !resultsToggle">
                            <svg class="ml-2" id="SvgjsSvg1001" width="18" height="12" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs"><defs id="SvgjsDefs1002"></defs><polyline fill="none" id="SvgjsPolyline1008" points="0,0 8,9 16,0" stroke="white" stroke-width="4"></polyline></svg>        
                        </button>
                        <div v-if="$store.state.submitted" class="ml-2 mb-1">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="16px" viewBox="0 0 122.877 101.052" enable-background="new 0 0 122.877 101.052" xml:space="preserve">
                                <g>
                                    <path fill="#3b82f6" d="M4.43,63.63c-2.869-2.755-4.352-6.42-4.427-10.11c-0.074-3.689,1.261-7.412,4.015-10.281 c2.752-2.867,6.417-4.351,10.106-4.425c3.691-0.076,7.412,1.255,10.283,4.012l24.787,23.851L98.543,3.989l1.768,1.349l-1.77-1.355 c0.141-0.183,0.301-0.339,0.479-0.466c2.936-2.543,6.621-3.691,10.223-3.495V0.018l0.176,0.016c3.623,0.24,7.162,1.85,9.775,4.766 c2.658,2.965,3.863,6.731,3.662,10.412h0.004l-0.016,0.176c-0.236,3.558-1.791,7.035-4.609,9.632l-59.224,72.09l0.004,0.004 c-0.111,0.141-0.236,0.262-0.372,0.368c-2.773,2.435-6.275,3.629-9.757,3.569c-3.511-0.061-7.015-1.396-9.741-4.016L4.43,63.63 L4.43,63.63z"></path>
                                </g>
                            </svg>
                        </div>
                    </h4>
                    <div class="flex w-full justify-between" v-if="resultsToggle">
                        <h5 class="">Time {{ endTime ? 'Taken' : 'Current'}}</h5>
                        <p v-if="endTime" class="text-lg font-bold">{{ totalTime }}</p>
                        <p v-else class="text-lg font-bold">{{ time }}</p>
                    </div>
                </div>
                <div v-if="ended">
                    <h4 class="text-lg font-semibold mb-2 text-left flex items-center">
                        DAILY RESET
                        <button @click="dailyResetToggle = !dailyResetToggle">
                            <svg class="ml-2" id="SvgjsSvg1001" width="18" height="12" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs"><defs id="SvgjsDefs1002"></defs><polyline fill="none" id="SvgjsPolyline1008" points="0,0 8,9 16,0" stroke="white" stroke-width="4"></polyline></svg>        
                        </button>
                    </h4>
                    <div class="mb-4" v-if="dailyResetToggle">
                        <div class="flex w-full justify-between">
                            <h5 class="text-2xl">{{ timeLeftPretty }}</h5>
                        </div>
                    </div>
                </div>
                <div v-if="ended" class="flex">
                    <div class="mr-2 flex-1">
                        <BaseCheckbox class="text-left mb-4" v-model:checked="link">Include Link</BaseCheckbox>
                        <button class="rounded-lg h-12 text-white text-xl font-semibold w-full" :class="[bgPrimary]" @click="copyScore()">Share</button>
                    </div>
                </div>
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
import Bar from '../Stats/Bar.vue'
import BaseCheckbox from '../base/Checkbox.vue'

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}



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

export default {
    name: 'ScoreModal',
    components: {
        BaseCheckbox,
        Bar
    },
    computed: {
        mode() {
            return this.$store.state.game.mode
        },
        games() {
            return this.$store.state.storage.games
        },
        reducedMotion() {
            return this.$store.state.settings.reducedMotion
        },
        colorBlind() {
            return this.$store.state.settings.colorBlind;
        },
        bgPrimary() { 
            return this.colorBlind ? 'bg-blue-500' : 'bg-green-500'
        },
        bgSecondary() {
            return this.colorBlind ? 'bg-orange-500' : 'bg-yellow-400'
        },
        length() {
            return this.$store.state.game[this.mode].length
        },
        guessResults() {
            return this.$store.getters[`game/${this.mode}/guessResults`]
        },
        gamesPlayed() {
            if (!this.games) return
            return Object.values(this.games).filter((game) => game[this.length] !== undefined).length
        },
        winPercentage() {
            if (!this.games) return
            const gamesWon = Object.values(this.games).filter((game) => game[this.length] !== undefined).filter((game) => game[this.length].won === true).length
            if (!gamesWon) return 0
            return Math.round(gamesWon/this.gamesPlayed * 10000) / 100
        },
        playedCount() {
            return 0
        },
        freebies() {
            return [34]
        },
        currentStreak() {
            if (!this.games) return
            let n = 0
            let index = this.id
            const currentPuzzles = this.games[this.id]
            if (currentPuzzles[this.length]) {
                if ( this.freebies.indexOf(this.id) >= 0 ) {
                    n += 1
                } else if (currentPuzzles[this.length].won === false) { 
                    return 0
                } else if (currentPuzzles[this.length].won === true) {
                    n += 1
                }
            }
            for (let i = index - 1; i > 0; i--) {
                const prevPuzzles = this.games[i]
                if (!prevPuzzles) break
                // Give the player a freebie
                if (this.freebies.indexOf(i) >= 0) {
                    n += 1
                    continue
                }
                if (!prevPuzzles[this.length]) break
                if (prevPuzzles[this.length].won === false || prevPuzzles[this.length].won === null) break
                if (prevPuzzles[this.length].won === true) n += 1
            }
            return n
        },
        maxStreak() {
            let greatestStreak = 0
            let currentStreak = 0

            for (let i = 1; i <= this.id; i++) {
                const puzzles = this.games[i]
                if (currentStreak > greatestStreak) greatestStreak = currentStreak
                if (!puzzles) {
                    currentStreak = 0
                } else if (!puzzles[this.length]) {
                    currentStreak = 0
                } else if (this.freebies.indexOf(i) >= 0) {
                    currentStreak += 1
                } else if (puzzles[this.length].won === false || puzzles[this.length].won === null) {
                    currentStreak = 0
                } else if (puzzles[this.length].won === true) {
                    currentStreak += 1
                } 
            }
            if (currentStreak > greatestStreak) greatestStreak = currentStreak
            return greatestStreak
        },
        distribution() {
            const games = Object.values(this.games).filter((game) => game[this.length] !== undefined).filter((game) => game[this.length].won === true)
            const dist = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0
            }
            games.forEach((game) => {
                dist[game[this.length].guesses.length] += 1
            });
            return dist
        },
        modeStats() {
            let i = 0
            Object.values(this.distribution).forEach((dist, index) => {
                if (dist > this.distribution[i + 1]) i = index 
            }) 
            return i + 1
        },
        time() {
            return fancyTimeFormat()
        },
        id() {
            return this.$store.state.game.id
        },
        won() {
            return this.$store.getters[`game/${this.mode}/won`]
        },
        ended() {
            return this.$store.state.game[this.mode].won !== null 
        },
        endTime() {
            return this.$store.state.game[this.mode].time.ended
        },
        startTime() {
            return this.$store.state.game[this.mode].time.started
        },
        totalTime() {
            return fancyTimeFormat((this.endTime - this.startTime)/1000) + '.' + (this.endTime - this.startTime)%1000
        },
        plus() {
            return this.length === 6 ? "+" : ""
        },
        dailyReset() {
            return this.$store.state.game.time
        },
        timeLeftPretty() {
            return fancyTimeFormat(this.timeLeft)
        }
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            link: false,
            shared: false,
            timeLeft: 0,

            statisticsToggle: true,
            distributionToggle: false,
            resultsToggle: false,
            dailyResetToggle: true
        }
    },
    methods: {
        toggle() {
            this.$store.dispatch('admin/score')
        },
        generateEmojiGrid() {
            let TEXT = "Termy" + this.plus + ' ' + this.id + ' ' + this.guessResults.length + '/6\n\n'
            for (let i = 0; i < this.guessResults.length; i++) {
                const guessResult = this.guessResults[i]
                for (let j = 0; j < guessResult.length; j++) {
                    const char = guessResult[j]
                    if (char[1] === 2) {
                        TEXT += '🟦'
                    } else if (char[1] === 1) {
                        TEXT += '🟧'
                    } else {
                        TEXT += '⬛'
                    }
                }
                TEXT += '\n'
            }
            if (this.link) TEXT += "\nhttps://termy.gg\n"
            const str = TEXT.substring(0, TEXT.length - 1);
            console.log(str)
            return str
        },
        copyScore() {
            copyTextToClipboard(this.generateEmojiGrid())

            this.$store.dispatch('admin/alert', 'Copied to Clipboard')
            this.shared = true
        },
        updateDailyDelta() {
            this.timeLeft = this.timeLeft - 1
            setTimeout( this.updateDailyDelta, 1000)
        }
    },
    watch: {
        dailyReset() {
            const d = new Date()
            this.timeLeft = (this.dailyReset.getTime()/1000) - (d.getTime()/1000)
            this.updateDailyDelta()
        }
    }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.bounce-enter-active,
.bounce-leave-active {
  transition: 0.5s;
}


.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: shrink-out 0.5s;
}


@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shrink-out {
    0% {
        transform: scale(1);
    }
    20% {
        transform: scale(0);
    }
    100% {
        transform: scale(0);
    }
}
</style>
