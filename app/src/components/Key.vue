<template>
    <button
        :style="{ 
            width: `${width}px`, 
            height: '58px' 
            }"
        click="handleClick"
        >
        { value }
    </button>
</template>

<script>
export default {
    props: {
        width: {
            type: Number,
            default: 40
        },
        value: {
            type: String,
            default: "Key"
        }
    },
    methods: {
        handleClick() {
            console.log('hi')
        }
    }
}
</script>

<style>

</style>