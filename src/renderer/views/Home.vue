<template>
  <div class="flex justify-between items-center">
    <v-text-field class="w-[70%]" label="ip" v-model="ip"></v-text-field>
    <v-btn variant="tonal" :loading="loading" @click="scan">发现设备</v-btn>
    <!-- <v-btn variant="tonal" :loading="loading" @click="nmapScan">nmap发现设备</v-btn> -->
  </div>
  <StreamPlayer class="w-1/2 h-1/2" streamId="cam101" />
  <v-data-table-virtual multi-sort expand-on-click :loading="loading" hover striped="even" density="compact" height="480"
    :headers="headers" :items="devices" :item-value="item => item.ip" fixed-header>
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>
    <template v-slot:item.data-table-expand="{ internalItem, isExpanded, toggleExpand }">
      <v-btn :append-icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        :text="isExpanded(internalItem) ? '收起' : '更多'" class="text-none" color="medium-emphasis" size="small"
        variant="text" width="105" border slim @click="toggleExpand(internalItem)"></v-btn>
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length" class="py-2">
          <v-btn size="x-small" variant="tonal" @click="getDeviceInfo(item.ip)">获取设备信息</v-btn>
          <v-btn size="x-small" variant="tonal" @click="getSecurityCapabilities(item.ip)">获取加密能力</v-btn>
          <v-btn size="x-small" variant="tonal" @click="activate(item.ip)">激活</v-btn>
        </td>
      </tr>
    </template>
  </v-data-table-virtual>
</template>

<script setup name="Home">
import log from 'electron-log/renderer'
import StreamPlayer from '../components/stream/StreamPlayer.vue'
const headers = ref([
  {
    title: '状态',
    key: 'status',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: 'IP',
    key: 'ip',
    sortable: true,
    nowrap: true,
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
    title: '设备名称',
    key: 'DeviceInfo.deviceName',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '通道名称',
    key: 'VideoInputChannel.name',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '子网掩码',
    key: 'NetworkInterfaceList.NetworkInterface.IPAddress.subnetMask',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '网关',
    key: 'NetworkInterfaceList.NetworkInterface.IPAddress.DefaultGateway.ipAddress',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '设备型号',
    key: 'DeviceInfo.model',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '序列号',
    key: 'DeviceInfo.serialNumber',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: 'mac',
    key: 'DeviceInfo.macAddress',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '固件版本',
    key: 'DeviceInfo.firmwareVersion',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '设备描述',
    key: 'DeviceInfo.deviceDescription',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '设备类型',
    key: 'DeviceInfo.deviceType',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '设备ID',
    key: 'DeviceInfo.deviceID',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
])
const devices = ref([])
onMounted(() => {
  window.device.onDeviceUpdated((device) => {
    const d = devices.value.find(d => d.ip === device.ip)
    if (!d) {
      devices.value.push(device)
    } else {
      Object.assign(d, device)
    }
  })
  window.device.onDeviceInitFailed((ip) => {
    devices.value = devices.value.filter(d => d.ip !== ip)
  })
  scan()
})

// const ip = ref('192.168.1.0/24')
// const ip = ref('172.30.0.0/24')
// const ip = ref('172.30.0.186')
const ip = ref('192.168.1.64')
const loading = ref(false)
const nmapScan = async () => {
  try {
    devices.value.length = 0
    loading.value = true
    const sm = new Date().getTime()
    log.info('开始扫描设备：', ip.value)
    const result = await window.system.nmapScan.fast(ip.value)
    const em = new Date().getTime()
    log.info('扫描设备完成，耗时：', em - sm + 'ms')
    log.silly('扫描设备结果', result, '\n设备总数' + result.length)
    devices.value.push(...result)
    loading.value = false
    window.device.updateIsapiSDKInstance(devices.value.map(d => d.ip))
  } catch (err) {
    log.error('扫描设备失败', err)
    loading.value = false
  }
}
const scan = async () => {
  try {
    devices.value.length = 0
    loading.value = true
    log.info('开始扫描设备：', ip.value)
    await window.system.scan.fast(ip.value)
    loading.value = false
  } catch (err) {
    log.error('扫描设备失败', err)
    loading.value = false
  }
}
const getSecurityCapabilities = async (ip) => {
  window.api.common.call(ip, 'securityCapabilities').then(res => {
    log.debug(ip, res)
  }).catch((err) => {
    log.error(err)
  })
}
const getDeviceInfo = async (ip) => {
  window.api.common.call(ip, 'systemDeviceInfo').then(res => {
    log.debug(ip, res)
  }).catch((err) => {
    log.error(err)
  })
}
const activate = async (ip) => {
  window.api.common.call(ip, 'activate').then(res => {
    log.info(res)
  }).catch(err => {
    log.error(err)
  })
}
</script>
<style scoped></style>
