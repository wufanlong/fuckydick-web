<template>
  <v-text-field label="ip" v-model="ip"></v-text-field>
  <v-btn variant="tonal" :loading="false" @click="scan">发现设备</v-btn>
  <div>  {{device}}
</div>
</template>

<script setup name="Index">
const device = ref('')
const ip = ref('172.30.0.1/24')
const loading = ref(false)
// 调用 preload 暴露的 API
const scan = async () => {
  try {
    device.value = ''
    loading.value = true
    const result = await window.system.scan.fast(ip.value)
    console.log('扫描设备结果', result)
    console.log(result.length)
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
