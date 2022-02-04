<template>
    <div class="w-16 h-16 border-solid border-2 flex items-center justify-center mx-0.5 text-3xl font-bold dark:text-white" :class="[
        {'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-600': status === ''},
        {'border-gray-400 dark:border-gray-200': value && status === ''},
        {'bg-gray-400 dark:bg-gray-700 text-white border-gray-400 dark:border-gray-700': status === 0},
        {'bg-blue-500 text-white border-blue-500': status === 2},
        {'bg-orange-500 dark:bg-orange-500 text-white border-orange-500 dark:border-orange-500': status === 1},
        {'cell-animation': !!value }

    ]">
        {{ value.toUpperCase() }}
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            default: ""
        }
    }
}
</script>

<style>

</style>