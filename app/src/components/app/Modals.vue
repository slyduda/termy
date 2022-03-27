<template>
  <div class="w-full h-full">
    <AboutModal @toggle="about = !about" :visible="about" />
    <SettingModal @toggle="setting = !setting" :visible="setting" />
    <ScoreModal @toggle="score = !score" :visible="score" />

    <InfoModal @toggle="info = !info" :visible="info" />
    <UpdateModal @toggle="update = !update" :visible="update" />
  </div>
</template>

<script>
import UpdateModal from './components/Modal/UpdateModal.vue';
import InfoModal from './components/Modal/InfoModal.vue';
import ScoreModal from './components/Modal/ScoreModal.vue';
import SettingModal from './components/Modal/SettingModal.vue';
import AboutModal from './components/Modal/AboutModal.vue';

export default {
    components: {
        UpdateModal,
        InfoModal,
        ScoreModal,
        SettingModal,
        AboutModal
    }
};
</script>

<style></style>
