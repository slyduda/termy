<template>
  <div>
    <ContinueModal class="top-0" :visible="softLoss" />
    <ClassicGrid class="flex-shrink flex-grow" :key="mode"/> 
  </div>
</template>

<script>
import ContinueModal from '../Modal/ContinueModal.vue'
import ClassicGrid from '../Grid/ClassicGrid.vue'

export default {
  name: 'game',
  components: {
    ContinueModal,
    ClassicGrid
  },
  computed: {
    mode() {
      return this.$store.state.game.mode
    },
    softLoss() {
      return this.$store.getters['game/classic/lostSoft']
    }
  }
}
</script>

<style>

</style>