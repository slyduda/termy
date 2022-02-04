<template>
  <button
        class="
          focus:outline-none
          focus:ring-2 focus:ring-opacity-50
          rounded-2xl
          transition
          duration-200
          bg-gray-100
        "
        @click="$emit('toggle')"
      >
        <div
          class="box-content border-2 border-solid h-6 w-10 border-gray-700 rounded-full transform duration-500"
          :class="[
            { 'bg-gray-700 border-gray-700': !value},
            { 'bg-blue-500 border-blue-500': value},
          ]"
        >
          <div
            class="h-6 w-6 bg-white rounded-full transform duration-500 flex justify-center items-center"
            :class="[
              { 'translate-x-4': value },
              { 'translate-x-0': !value }
            ]"
          >
          </div>
        </div>
        <div
          class="text-sm font-semibold"
          :class="[{ 'text-yellow-500 dark:text-blue-300': value }, 
          { 'text-gray-700': !value }]"
        >
        </div>
      </button>
</template>

<script>
export default {
    props: {
        value: {
            default: false,
            type: Boolean
        }
    }
}
</script>

<style>

</style>