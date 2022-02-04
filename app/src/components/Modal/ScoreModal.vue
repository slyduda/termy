<template>
    <div v-if="visible" class="w-full h-full absolute z-50 flex justify-center items-center" >
        <div class="w-full h-full bg-gray-900 opacity-50 absolute">

        </div>
        <div class="w-full max-w-xs mx-4 dark:text-white p-6 text-sm relative bg-white relative rounded-lg dark:bg-gray-800">
            <h4 class="text-lg font-semibold mb-2 text-left">STATISTICS</h4>
            <div class="flex mb-4">
                <div class="flex flex-col flex-1">
                    <p class="text-4xl">{{ playedCount }}</p>
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
            <h4 class="text-lg font-semibold mb-2 text-left">DISTRIBUTION</h4>
            <div class="mb-4">
                <div class="flex w-full">
                    <h5 class="w-6">1</h5>
                    <p>{{ guessCounts[1] }}</p>
                </div>
                <div class="flex w-full">
                    <h5 class="w-6">2</h5>
                    <p>{{ guessCounts[2] }}</p>
                </div>
                <div class="flex w-full">
                    <h5 class="w-6">3</h5>
                    <p>{{ guessCounts[3] }}</p>
                </div>
                <div class="flex w-full">
                    <h5 class="w-6">4</h5>
                    <p>{{ guessCounts[4] }}</p>
                </div>
                <div class="flex w-full">
                    <h5 class="w-6">5</h5>
                    <p>{{ guessCounts[5] }}</p>
                </div>
                <div class="flex w-full">
                    <h5 class="w-6">6</h5>
                    <p>{{ guessCounts[6] }}</p>
                </div>
            </div>
            <h4 class="text-lg font-semibold mb-2 text-left">RESULTS</h4>
            <div class="mb-4">
                <div class="flex w-full justify-between">
                    <h5 class="">Time {{ endTime ? 'Taken' : 'Current'}}</h5>
                    <p v-if="endTime" class="text-lg font-bold">{{ totalTime }}</p>
                    <p v-else class="text-lg font-bold">{{ time }}</p>
                </div>
            </div>
            <div v-if="won" class="flex">
                <div class="mr-2 flex-1">
                    <BaseCheckbox class="text-left mb-4" v-model:checked="link">Include Link</BaseCheckbox>
                    <button class="rounded-lg bg-blue-500 h-12 text-white text-xl font-semibold w-full" @click="copyScore()">Share</button>
                </div>
                <div v-if="shared" class="ml-2 flex-1">
                    <p class="text-sm pb-4 pt-1 leading-snug">Up for a challenge?</p>
                    <button class="rounded-lg bg-orange-500 h-12 text-white text-xl font-semibold w-full" @click="switchMode()">Termy{{plus ? "" : '+' }}</button>    
                </div>
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
        BaseCheckbox
    },
    computed: {
        length() {
            return this.$store.state.length
        },
        guessResults() {
            return this.$store.getters.guessResults
        },
        winPercentage() {
            return 0
        },
        playedCount() {
            return 0
        },
        currentStreak() {
            return 0
        },
        maxStreak() {
            return 0
        },
        guessCounts() {
            return {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0
            }
        },
        time() {
            return fancyTimeFormat()
        },
        termyNumber() {
            return 0
        },
        won() {
            return this.$store.state.celebrated
        },
        endTime() {
            return this.$store.state.endTime
        },
        startTime() {
            return this.$store.state.startTime
        },
        totalTime() {
            return fancyTimeFormat((this.endTime - this.startTime)/1000) + '.' + (this.endTime - this.startTime)%1000
        },
        plus() {
            return this.length === 6 ? "+" : ""
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
        }
    },
    methods: {
        toggle() {
            this.$emit('toggle')
        },
        generateEmojiGrid() {
            let TEXT = "Termy" + this.plus + " #" + this.termyNumber + ' ' + this.guessResults.length + '/6\n\n'
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

            this.$store.dispatch('alert', 'Copied to Clipboard')
            this.shared = true
        },
        switchMode() {
           this.$store.dispatch('switchMode') 
        }
    },
}
</script>

<style>

</style>
