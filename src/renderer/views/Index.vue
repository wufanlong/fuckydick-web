<template>
  <div>
    <span class="mr-4">Npcap is installing</span>
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
</template>

<script setup lang="ts" name="Index">
import { useRouter } from 'vue-router'
import log from 'electron-log/renderer'

const router = useRouter();
const checkEnvs = async () => {
  const isReady = await window.system.bootstrap.isEnvsReady();
  log.info('Environment ready status:', isReady);
  if (isReady) {
    router.replace({ name: 'Home' })
  } else {
    setTimeout(() => {
      checkEnvs()
    }, 5000);
  }
}
checkEnvs();
</script>
<style scoped></style>
