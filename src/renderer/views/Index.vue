<template>
  <v-btn variant="tonal" :loading="false" @click="scan">发现设备</v-btn>
  <div>  {{device}}
</div>
</template>

<script setup name="Index">
const device = ref('')
const loading = ref(false)
// 调用 preload 暴露的 API
const scan = async () => {
  try {
    loading.value = true
    device.value = '成功  ' +await window.system.scan.fast()
    loading.value = false
  } catch (err) {
    console.error('扫描设备失败', err)
    device.value = ('扫描设备失败  ' + err.message) || '扫描设备失败'
    loading.value = false
  }
}
</script>
<style scoped></style>
