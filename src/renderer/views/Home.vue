<template>
  <div class="flex justify-between items-center">
    <v-text-field class="w-[70%]" label="ip" v-model="ip"></v-text-field>
    <v-btn variant="tonal" :loading="loading" @click="scan">发现设备</v-btn>
  </div>
  <v-data-table-virtual :headers="headers" :items="devices" :item-value="item => item.ip" item-selectable="selectable"
    v-model="selectedDevices" show-select fixed-header></v-data-table-virtual>
</template>

<script setup name="Home">
import log from 'electron-log/renderer'
const headers = ref([
  {
    title: 'ip',
    key: 'ip',
    sortable: true,
    align: 'center',
    sort: (a, b) => {
      const pa = a.split('.').map(Number)
      const pb = b.split('.').map(Number)

      for (let i = 0; i < 4; i++) {
        if (pa[i] !== pb[i]) {
          return pa[i] - pb[i]
        }
      }
      return 0
    }
  },
  {
    title: 'mac',
    key: 'mac',
    sortable: true,
    align: 'center',
  },
])
const devices = ref([])
const selectedDevices = ref([])
const ip = ref('172.30.0.1/24')
// const ip = ref('172.30.0.186')
const loading = ref(false)
const scan = async () => {
  try {
    devices.value.length = 0
    // window.system.log.setFileLogLevel('debug');
    loading.value = true
    const sm = new Date().getTime()
    log.info('开始扫描设备，扫描ip段：', ip.value, '开始时间：', sm)
    const result = await window.system.scan.fast(ip.value)
    const em = new Date().getTime()
    log.info('扫描设备完成，结束时间：', em, '耗时：', em - sm + 'ms')
    log.debug('扫描设备结果', result, '\n设备总数' + result.length)
    devices.value = result
    loading.value = false
    
    // window.system.log.setFileLogLevel('info');
  } catch (err) {
    log.error('扫描设备失败', err)
    loading.value = false
  }
}
</script>
<style scoped></style>
