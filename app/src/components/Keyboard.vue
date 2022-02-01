<template>
    <div>
        <div className="flex justify-center mb-1">
            <Key :value="'Q'" @click="keyPressed" :status="charStatuses['Q']" />
            <Key :value="'W'" @click="keyPressed" :status="charStatuses['W']" />
            <Key :value="'E'" @click="keyPressed" :status="charStatuses['E']" />
            <Key :value="'R'" @click="keyPressed" :status="charStatuses['R']" />
            <Key :value="'T'" @click="keyPressed" :status="charStatuses['T']" />
            <Key :value="'Y'" @click="keyPressed" :status="charStatuses['Y']" />
            <Key :value="'U'" @click="keyPressed" :status="charStatuses['U']" />
            <Key :value="'I'" @click="keyPressed" :status="charStatuses['I']" />
            <Key :value="'O'" @click="keyPressed" :status="charStatuses['O']" />
            <Key :value="'P'" @click="keyPressed" :status="charStatuses['P']" />
        </div>
        <div className="flex justify-center mb-1">
            <Key :value="'A'" @click="keyPressed" :status="charStatuses['A']" />
            <Key :value="'S'" @click="keyPressed" :status="charStatuses['S']" />
            <Key :value="'D'" @click="keyPressed" :status="charStatuses['D']" />
            <Key :value="'F'" @click="keyPressed" :status="charStatuses['F']" />
            <Key :value="'G'" @click="keyPressed" :status="charStatuses['G']" />
            <Key :value="'H'" @click="keyPressed" :status="charStatuses['H']" />
            <Key :value="'J'" @click="keyPressed" :status="charStatuses['J']" />
            <Key :value="'K'" @click="keyPressed" :status="charStatuses['K']" />
            <Key :value="'L'" @click="keyPressed" :status="charStatuses['L']" />
        </div>
        <div className="flex justify-center">
            <Key :width="65.4" :value="'ENTER'" @click="keyPressed">
                {ENTER_TEXT}
            </Key>
            <Key :value="'Z'" @click="keyPressed" :status="charStatuses['Z']" />
            <Key :value="'X'" @click="keyPressed" :status="charStatuses['X']" />
            <Key :value="'C'" @click="keyPressed" :status="charStatuses['C']" />
            <Key :value="'V'" @click="keyPressed" :status="charStatuses['V']" />
            <Key :value="'B'" @click="keyPressed" :status="charStatuses['B']" />
            <Key :value="'N'" @click="keyPressed" :status="charStatuses['N']" />
            <Key :value="'M'" @click="keyPressed" :status="charStatuses['M']" />
            <Key :width="65.4" :value="'DELETE'" @click="keyPressed">
                {DELETE_TEXT}
            </Key>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        charStatuses() {
            return this.$store.getters.charStatuses
        }
    }
}
</script>

<style>

</style>