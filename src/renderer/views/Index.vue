<template>
  <v-btn variant="tonal" :loading="loading" @click="scan">发现设备</v-btn>
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
    const result = await window.system.scan.fast()
    device.value = '成功  ' + JSON.stringify(result)
    loading.value = false
  } catch (err) {
    console.error('扫描设备失败', err)
    device.value = ('扫描设备失败  ' + err.message) || '扫描设备失败'
    loading.value = false
  }
}
</script>
<style scoped></style>
