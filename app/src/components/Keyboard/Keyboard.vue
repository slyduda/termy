<template>
    <div id="keyboard" class="flex flex-col pb-2 px-2">
        <div class="flex justify-center mb-1">
            <Key :value="'Q'" @click="nothing" :status="charStatuses['Q']" />
            <Key :value="'W'" @click="nothing" :status="charStatuses['W']" />
            <Key :value="'E'" @click="nothing" :status="charStatuses['E']" />
            <Key :value="'R'" @click="nothing" :status="charStatuses['R']" />
            <Key :value="'T'" @click="nothing" :status="charStatuses['T']" />
            <Key :value="'Y'" @click="nothing" :status="charStatuses['Y']" />
            <Key :value="'U'" @click="nothing" :status="charStatuses['U']" />
            <Key :value="'I'" @click="nothing" :status="charStatuses['I']" />
            <Key :value="'O'" @click="nothing" :status="charStatuses['O']" />
            <Key :value="'P'" @click="nothing" :status="charStatuses['P']" />
        </div>
        <div class="flex justify-center mb-1">
            <div :style="{ 
                    width: '26px', 
                    height: '58px' 
                }"
            ></div>
            <Key :value="'A'" @click="nothing" :status="charStatuses['A']" />
            <Key :value="'S'" @click="nothing" :status="charStatuses['S']" />
            <Key :value="'D'" @click="nothing" :status="charStatuses['D']" />
            <Key :value="'F'" @click="nothing" :status="charStatuses['F']" />
            <Key :value="'G'" @click="nothing" :status="charStatuses['G']" />
            <Key :value="'H'" @click="nothing" :status="charStatuses['H']" />
            <Key :value="'J'" @click="nothing" :status="charStatuses['J']" />
            <Key :value="'K'" @click="nothing" :status="charStatuses['K']" />
            <Key :value="'L'" @click="nothing" :status="charStatuses['L']" />
            <div :style="{ 
                    width: '26px', 
                    height: '58px' 
                }"
            ></div>
        </div>
        <div class="flex justify-center">
            <Key :width="65.4" :value="'ENTER'" @click="nothing">
            </Key>
            <Key :value="'Z'" @click="nothing" :status="charStatuses['Z']" />
            <Key :value="'X'" @click="nothing" :status="charStatuses['X']" />
            <Key :value="'C'" @click="nothing" :status="charStatuses['C']" />
            <Key :value="'V'" @click="nothing" :status="charStatuses['V']" />
            <Key :value="'B'" @click="nothing" :status="charStatuses['B']" />
            <Key :value="'N'" @click="nothing" :status="charStatuses['N']" />
            <Key :value="'M'" @click="nothing" :status="charStatuses['M']" />
            <Key :width="65.4" :value="'DELETE'" @click="nothing">
                <font-awesome-icon icon="backspace" class="text-xl" :class="['text-gray-900 dark:text-gray-100']"></font-awesome-icon>
            </Key>
        </div>
    </div>
</template>

<script>
import Key from './Key.vue';

export default {
    components: {
        Key
    },
    computed: {
        charStatuses() {
            return this.$store.getters.charStatuses
        }
    },
    methods: {
        nothing() {
            return
        }
    }
}
</script>

<style>

</style>