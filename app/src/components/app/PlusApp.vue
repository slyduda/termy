<template>
  <div>
    <ContinueModal class="top-0" :visible="softLoss" />
    <Grid class="flex-shrink flex-grow" :key="mode"/> 
  </div>
</template>

<script>
import ContinueModal from '../Modal/ContinueModal.vue'
import Grid from '../Grid/PlusGrid.vue'

export default {
  name: 'game',
  components: {
    ContinueModal,
    Grid
  },
  computed: {
    mode() {
      return this.$store.state.game.mode
    },
    softLoss() {
      return this.$store.getters['game/plus/lostSoft']
    }
  }
}
</script>

<style>

</style>