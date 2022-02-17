<template>
    <div class="flex-grow flex-1 border-solid border-2 flex items-center justify-center mr-1 last:mr-0 font-bold dark:text-white leading-none" :class="[
        {'bg-white dark:bg-gray-900': status === ''},
        {'border-gray-200 dark:border-gray-600': !value && status === ''},
        {'border-gray-400 dark:border-gray-400': value && status === ''},
        {'bg-gray-400 dark:bg-gray-700 text-white border-gray-400 dark:border-gray-700': status === 0},
        {'bg-blue-500 text-white border-blue-500': status === 2},
        {'bg-orange-500 dark:bg-orange-500 text-white border-orange-500 dark:border-orange-500': status === 1},
        {'cell-animation': anim },
        {'text-sm': small},
        {'text-3xl': !small},

    ]">
        <div v-if="hint && !value" class="w-full h-full opacity-40 flex items-center justify-center leading-none">{{ hint.toUpperCase()}} </div>
        {{ value.toUpperCase() }}
    </div>
</template>

<script>
export default {
    data() {
        return {
            anim: false
        }
    },
    props: {
        value: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            default: ""
        },
        hint: {
            type: String,
            default: ""
        },
        small: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        value(newVal, oldVal) {
            if (newVal !== oldVal && newVal !== '') {
                this.anim = true
                const that = this
                setTimeout(() => {
                    that.anim = false
                } , 250 )
            }
        }
    }
}
</script>

<style>

.cell-animation {
 animation-name: grow;
 animation-duration: .1s; /* or: Xms */
}

@keyframes grow {
  0% {
    transform: scale(1);
  }
  80% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1.0);
  }
}
</style>