
<template>
  <button @click="scan">发现设备</button>
  <ul>
    <li v-for="device in devices" :key="device.id">{{ device.name }} - {{ device.ip }}</li>
  </ul>
</template>

<script setup>
const devices = ref([])

// 调用 preload 暴露的 API
const scan = async () => {
  try {
    devices.value = await window.system.camera.scanDevices()
  } catch (err) {
    console.error('扫描设备失败', err)
  }
}
</script>
<style scoped>
</style>
