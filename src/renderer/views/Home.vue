<template>
  <div class="flex justify-between items-center">
    <v-text-field class="w-[70%]" label="ip" v-model="ip"></v-text-field>
    <v-btn variant="tonal" :loading="loading" @click="scan">发现设备</v-btn>
    <!-- <v-btn variant="tonal" :loading="loading" @click="nmapScan">nmap发现设备</v-btn> -->
  </div>
  <StreamPlayer class="w-1/2 h-1/2" streamId="cam101" />
  <v-data-table-virtual multi-sort expand-on-click :loading="loading" hover striped="even" density="compact" height="480"
    :headers="headers" :items="devices" :item-value="item => item.ip" fixed-header>
    <template v-slot:item.status="{ value }">
      {{ value ? value : "未激活" }}
    </template>
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
          <v-sheet rounded="lg" border>
            <v-btn size="x-small" variant="tonal" @click="getDeviceInfo(item.ip)">获取设备信息</v-btn>
            <v-btn size="x-small" variant="tonal" @click="getSecurityCapabilities(item.ip)">获取加密能力</v-btn>
            <v-table density="compact">
              <tbody class="bg-surface-light">
                <tr>
                  <th>Rating</th>
                  <th>Synopsis</th>
                  <th>Cast</th>
                </tr>
              </tbody>

              <tbody>
                <tr>
                  <td class="py-2">
                    <v-rating :model-value="item.model" color="orange-darken-2" density="comfortable" size="small"
                      half-increments readonly></v-rating>
                  </td>
                  <td class="py-2">{{ item.subnetMask }}</td>
                  <td class="py-2">{{ item.ip }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-sheet>
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
    key: 'deviceName',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '通道名称',
    key: 'channelName',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '子网掩码',
    key: 'subnetMask',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '网关',
    key: 'gateway',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '设备型号',
    key: 'model',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '序列号',
    key: 'serialNumber',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: 'mac',
    key: 'macAddress',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '固件版本',
    key: 'firmwareVersion',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '设备描述',
    key: 'deviceDescription',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '设备类型',
    key: 'deviceType',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
  {
    title: '设备ID',
    key: 'deviceID',
    sortable: true,
    align: 'center',
    nowrap: true,
  },
])
const devices = ref([])
onMounted(() => {
  window.device.onDeviceInitd((DeviceInfo) => {
    if (!devices.value.find(d => d.ip === DeviceInfo.ip)) {
      devices.value.push(DeviceInfo)
    }
  })
  window.device.onDeviceInitFailed((ip) => {
    devices.value = devices.value.filter(d => d.ip !== ip)
  })
  scan()
})

const ip = ref('192.168.1.0/24')
// const ip = ref('172.30.0.0/24')
// const ip = ref('172.30.0.186')
// const ip = ref('192.168.1.64')
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
</script>
<style scoped></style>
