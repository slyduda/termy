<template>
    <div :style="{width: `${percent > 5.5 ? percent : 5.5}%` }" class="bg-gray-800 dark:bg-gray-200 h-full rounded-r">
        <p class="text-gray-200 dark:text-gray-800 text-right pr-1 font-bold">{{ value }}</p>
    </div>
</template>

<script>
export default {
    props: {
        percent: {
            type: Number,
            default: 0
        },
        value: {
            type: Number,
            default: 0
        }
    }
}
</script>

<style>

</style>