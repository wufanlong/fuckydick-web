
<template>
  <v-btn variant="tonal" :loading="loading" @click="scan">发现设备</v-btn>
  <ul>
    <li v-for="device in devices" :key="device.id">{{ device.name }} - {{ device.ip }}</li>
  </ul>
</template>

<script setup>
const devices = ref([])
const loading = ref(false)

// 调用 preload 暴露的 API
const scan = async () => {
  try {
    loading.value = true
    devices.value = await window.system.camera.scanDevices()
    console.log(process.env.NODE_ENV)
    loading.value = false

  } catch (err) {
    console.error('扫描设备失败', err)
    loading.value = false
  }
}
</script>
<style scoped>
</style>
