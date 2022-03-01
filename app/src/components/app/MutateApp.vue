<template>
  <div>
    <ContinueModal class="top-0" :visible="softLoss" />
    <MutateGrid v-if="mode === 'mutate'" class="flex-shrink flex-grow" :key="mode"/>
    <StagingGrid v-if="mode === 'stage'" class="flex-shrink flex-grow" :key="mode"/> 
  </div>
</template>

<script>
import ContinueModal from '../Modal/ContinueModal.vue'
import MutateGrid from '../Grid/MutateGrid.vue'

export default {
  name: 'game',
  components: {
    ContinueModal,
    MutateGrid
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