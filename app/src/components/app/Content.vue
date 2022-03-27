<template>
  <div>
    <ClassicApp
      class="flex-shrink flex-grow flex items-center"
      v-if="mode === 'classic'"
    />
    <PlusApp
      class="flex-shrink flex-grow flex items-center"
      v-if="mode === 'plus'"
    />
    <MutateApp
      class="flex-shrink flex-grow flex items-center"
      v-if="mode === 'mutate' || mode === 'stage'"
    />
  </div>
</template>

<script>
import ClassicApp from './components/app/ClassicApp';
import PlusApp from './components/app/PlusApp';
import MutateApp from './components/app/MutateApp';

export default {
  components: {
    ClassicApp,
    PlusApp,
    MutateApp,
  },
};
</script>

<style></style>
