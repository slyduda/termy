<template>
  <div v-show="message" class="absolute z-50 px-4 py-3 rounded-lg bg-gray-400 dark:bg-gray-700 text-white border-gray-400 dark:border-gray-700">
      {{ message }}
  </div>
</template>

<script>
export default {
    props: {
        message: {
            type: String,
            default: ''
        }
    }
}
</script>

<style>

</style>