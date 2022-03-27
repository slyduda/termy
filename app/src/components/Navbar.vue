<template>
  <div class="w-full absolute mt-3 flex justify-center">
    <Alert :message="alert" />
  </div>
  <div
    id="header"
    class="w-full py-2 max-w-7xl mx-auto border-b border-solid border-gray-300 dark:border-gray-700"
  >
    <div class="w-full max-w-lg mx-auto">
      <div class="flex justify-between items-center mx-2">
        <div class="flex flex-1">
          <button
            @click="about = !about"
            class="p-2 flex justify-center items-center"
          >
            <font-awesome-icon
              icon="info-circle"
              class="text-2xl"
              :class="['text-gray-900 dark:text-gray-100']"
            ></font-awesome-icon>
          </button>
          <button
            v-if="newVersion"
            class="p-2 flex justify-center items-center"
            @click="
              update = !update;
              $store.dispatch('storage/newVersion', false);
            "
          >
            <font-awesome-icon
              icon="circle-exclamation"
              class="text-2xl"
              :class="['text-red-500']"
            ></font-awesome-icon>
          </button>
          <!--
                <button v-else class="p-2 flex justify-center items-center" @click="info = !info">
                  <font-awesome-icon icon="fist-raised" class="text-2xl" :class="['text-gray-900 dark:text-gray-100']"></font-awesome-icon>
                </button>
                -->
          <div
            v-if="timeChallenge"
            class="ml-4 text-gray-400 dark:text-gray-600 font-bold"
          >
            {{ fancyTmeRemaining }}
          </div>
        </div>
        <div class="relative">
          <button
            @click="selectMode"
            v-if="mode === 'classic'"
            class="text-4xl grow font-bold dark:text-white flex items-center justify-center"
          >
            <h1 class="tracking-widest">TERMY</h1>
            <font-awesome-icon class="text-xl ml-1" icon="caret-down" />
          </button>

          <button
            @click="selectMode"
            v-else-if="mode === 'plus'"
            class="text-4xl grow font-bold dark:text-white flex items-center justify-center"
          >
            <h1 class="tracking-widest">TERMY</h1>
            <div
              class="font-extrabold leading-none mr-1"
              :class="[textPrimary]"
              style="font-size: 2.5rem"
            >
              +
            </div>
            <font-awesome-icon class="text-xl ml-1" icon="caret-down" />
          </button>
          <button
            @click="selectMode"
            v-else
            class="text-4xl grow font-bold dark:text-white flex items-center justify-center"
          >
            <h1 class="tracking-widest text-3xl flex">
              TERM
              <p class="tracking-normal mr-1" :class="[textPrimary]">UTATE</p>
            </h1>
            <font-awesome-icon class="text-xl ml-1" icon="caret-down" />
          </button>
          <p
            class="hidden absolute text-xs -right-8 bottom-0 text-gray-400 dark:text-gray-600 font-bold"
          >
            BETA
          </p>
        </div>
        <div class="flex flex-1 justify-end">
          <button
            class="p-2 flex justify-center items-center"
            @click="$store.dispatch('admin/score')"
          >
            <font-awesome-icon
              icon="chart-pie"
              class="text-2xl"
              :class="['text-gray-900 dark:text-gray-100']"
            ></font-awesome-icon>
          </button>
          <button
            class="p-2 flex justify-center items-center"
            @click="setting = !setting"
          >
            <font-awesome-icon
              icon="gear"
              class="text-2xl"
              :class="['text-gray-900 dark:text-gray-100']"
            ></font-awesome-icon>
          </button>
        </div>
      </div>
    </div>
  </div>
  <Transition :name="reducedMotion ? 'none' : 'fade'">
    <div
      v-if="selecting"
      @click="selecting = false"
      class="w-full h-full absolute pointer-events-auto z-50"
    >
      <div class="w-full h-full bg-gray-900 opacity-50"></div>
    </div>
  </Transition>
  <Transition>
    <div
      v-if="selecting"
      class="absolute w-full h-full z-50 pointer-events-none"
    >
      <div
        class="z-50 mx-auto max-w-xs w-full bg-white dark:bg-gray-800 dark:text-white p-4 rounded-lg mt-14 pointer-events-auto"
      >
        <button
          @click="changeMode('classic')"
          class="mb-4 text-left text-sm w-full"
        >
          <div class="flex items-center text-2xl font-bold tracking-widest">
            TERMY
          </div>
          The 5-letter guessing you know and love.
        </button>
        <button @click="changeMode('plus')" class="text-left text-sm w-full">
          <div class="flex text-2xl font-bold tracking-widest">
            TERMY
            <div
              class="font-extrabold leading-none text-3xl"
              :class="[textPrimary]"
            >
              +
            </div>
            <!-- 
              <font-awesome-icon icon="plus" :class="[textPrimary]" />
              -->
          </div>
          Regular Termy but with a 6-letter twist.
        </button>
        <!--
          <button @click="changeMode('mutate')" class="mb-4 text-left text-sm w-full">
            <div class="flex items-center text-2xl font-bold tracking-widest relative">
              <div class="flex items-center relative">
                TERM<p class="tracking-normal" :class="[textPrimary]">UTATE</p>
                <p class="text-xs font-bold tracking-normal absolute -right-9 bottom-0.5 text-gray-400">BETA</p>
              </div>
            </div>
            Make words with the letters you're given.
          </button>
          <button @click="changeMode('stage')" class="text-left text-sm w-full">
            <div class="flex items-center text-2xl font-bold tracking-widest relative">
              <div class="flex items-center relative">
                TERM<p class="tracking-normal" :class="[textPrimary]">UTATE</p>
                <p class="text-xs font-bold tracking-normal absolute -right-14 bottom-0.5 text-gray-400">STAGING</p>
              </div>
            </div>
            Tools for creating Termutate puzzles.
          </button>
          -->
      </div>
    </div>
  </Transition>
  <div v-if="timeRemaining" class="overflow-hidden">
    <div
      class="max-w-7xl border-b-4 border-solid border-blue-500 overflow-hidden"
      :style="{ width: `${100 - percentRemaining * 100}%` }"
    ></div>
  </div>
</template>

<script>
import {
  faFistRaised,
  faBackspace,
  faInfoCircle,
  faQuestionCircle,
  faTriangleExclamation,
  faCaretDown,
  faCircleExclamation,
  faChartPie,
  faGear,
  faLock,
  faHeart,
  faTrashCan,
  faTrashCanArrowUp,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';

export default {};
</script>

<style></style>
