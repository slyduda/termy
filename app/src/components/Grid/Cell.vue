<template>
    <div
        :style="{transform: `translate( ${explode.x}px, ${explode.y}px) rotate( ${explode.rot}deg)`}" 
        class="flex-grow flex-1 relative mr-1 last:mr-0 flex justify-center items-center font-bold dark:text-white" :class="[
        {'bg-white dark:bg-gray-900 border-solid border-2': status === ''},
        {'border-gray-200 dark:border-gray-600': !value && status === ''},
        {'border-gray-400 dark:border-gray-400': value && status === ''},
        {'bg-gray-400 dark:bg-gray-700 border-gray-400 dark:border-gray-700 text-white': status === 0},
        {[`${bgPrimary} text-white`]: status === 2},
        {[`${bgSecondary} text-white`]: status === 1},
        {'cell-animation': anim },
        {'text-sm': small},
        {'text-3xl': !small},
    ]">
        <div v-if="hint && !value" class="w-full h-full opacity-40 flex items-center justify-center leading-none"> {{ hint.toUpperCase()}} </div>
        {{ value.toUpperCase() }}
    </div>
</template>

<script>
export default {
    data() {
        return {
            anim: false,
            explode: {
                x: 0,
                y: 0,
                rot: 0,
            }
        }
    },
    computed: {
        won() {
            return this.$store.getters.won
        },
        colorBlind() {
            return this.$store.state.settings.colorBlind
        },
        bgPrimary() { 
            return this.colorBlind ? 'bg-blue-500' : 'bg-green-500'
        },
        bgSecondary() {
            return this.colorBlind ? 'bg-orange-500' : 'bg-yellow-400'
        },
        reducedMotion() {
            return this.$store.state.settings.reducedMotion
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
        },
        animations: {
            type: Boolean,
            default: true,
        }
    },
    methods: {
        startExplosion() {
            if (!this.animations || this.reducedMotion) return
            this.explode = {
                x: 0,
                y: 0,
                rot: 0
            }

            const VEL_Y_CIEL = 30;
            const VEL_Y_FLOOR = 10;
            const VEL_X_INTESITY = 20;
            const ROTATION = ( Math.random() * (60) - 30 ) 

            const VEL_Y = ( Math.random() * (VEL_Y_CIEL - VEL_Y_FLOOR) + VEL_Y_FLOOR )
            const VEL_X = ( Math.random() - .5 ) * VEL_X_INTESITY
            
            this.explosion(VEL_X, -VEL_Y, ROTATION, 1600)
        },
        explosion(x, y, rot, time) {
            const gravity = 50
            const frames = 30
            const fps = frames/1000
            const that = this
            
            setTimeout(() => { 
                const dif = gravity * fps
                const newY = y + dif
                that.explode = {
                    x: that.explode.x + x,
                    y: that.explode.y + newY,
                    rot: that.explode.rot + rot
                }
                if (time > 0) that.explosion(x, newY, rot, time - frames)
            } , frames)
        }
    },
    mounted() {
        if (this.won) this.startExplosion()
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
        },
        won() {
            if (this.won === true) this.startExplosion()
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