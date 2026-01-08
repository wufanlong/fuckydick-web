<template>
  <div class="flex justify-between items-center">
    <v-text-field class="w-[70%]" label="ip" v-model="ip"></v-text-field>
    <v-btn variant="tonal" :loading="loading" @click="scan">发现设备</v-btn>
    <v-btn variant="tonal" @click="getDeviceInfo">获取设备信息</v-btn>
    <v-btn variant="tonal" @click="getSecurityCapabilities">获取加密能力</v-btn>
  </div>
  <v-data-table-virtual height="480" :headers="headers" :items="devices" :item-value="item => item.ip" item-selectable="selectable"
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
    title: '通道名称',
    key: 'channelName',
    sortable: true,
    align: 'center',
  },
  {
    title: 'OSD',
    key: 'osd',
    sortable: true,
    align: 'center',
  },
  {
    title: '子网掩码',
    key: 'subnetMask',
    sortable: true,
    align: 'center',
  },
  {
    title: '网关',
    key: 'gateway',
    sortable: true,
    align: 'center',
  },
  {
    title: '设备型号',
    key: 'deviceModel',
    sortable: true,
    align: 'center',
  },
  {
    title: '序列号',
    key: 'serialNumber',
    sortable: true,
    align: 'center',
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

watch(devices, (newVal) => {
  window.device.updateIsapiSDKInstance(newVal.map(d => d.ip))
}, { deep: true })

// const ip = ref('192.168.0.1/24')
// const ip = ref('172.30.0.1/24')
// const ip = ref('172.30.0.186')
const ip = ref('192.168.1.64')
const loading = ref(false)
const scan = async () => {
  try {
    devices.value.length = 0
    loading.value = true
    const sm = new Date().getTime()
    log.info('开始扫描设备，扫描ip段：', ip.value)
    const result = await window.system.scan.fast(ip.value)
    const em = new Date().getTime()
    log.info('扫描设备完成，耗时：', em - sm + 'ms')
    log.debug('扫描设备结果', result, '\n设备总数' + result.length)
    devices.value.push(...result)
    loading.value = false
  } catch (err) {
    log.error('扫描设备失败', err)
    loading.value = false
  }
}
const getSecurityCapabilities = async () => {
  window.api.common.call(ip.value, 'securityCapabilities').then(res => {
    log.info(ip.value, res)
  }).catch((err) => {
    log.error(err)
  })
}
const getDeviceInfo = async () => {
  window.api.common.call(ip.value, 'systemDeviceInfo').then(res => {
    log.info(ip.value, res)
  }).catch((err) => {
    log.error(err)
  })
}
</script>
<style scoped></style>
