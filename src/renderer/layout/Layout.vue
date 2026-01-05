<template>
  <router-view></router-view>

  <v-textarea label="日志" auto-grow :max-rows="7" v-model="logContent">
  </v-textarea>
  <!-- <v-card variant="tonal" color="surface-variant" subtitle="日志">
    </v-card> -->
</template>

<script setup name="Layout">
const logContent = ref('')
window.system.log.loggingOnRenderer((message) => {
  logContent.value += message + '\n';
});

</script>