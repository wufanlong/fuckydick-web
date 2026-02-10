<template>
  <div class="flex justify-between items-center">
    <v-text-field class="w-[50%]" label="ip" v-model="ip" clearable></v-text-field>
    <v-btn variant="tonal" :loading="loading" @click="scan">发现设备</v-btn>
    <v-text-field class="w-[50%]" label="搜索" v-model="search" clearable></v-text-field>
    <!-- <v-btn variant="tonal" :loading="loading" @click="nmapScan">nmap发现设备</v-btn> -->
  </div>
  <v-data-table class="h-[89%]" multi-sort expand-on-click :loading="loading" hover striped="even" density="compact"
    :search="search" items-per-page="50" :headers="headers" :items="devices" :item-value="item => item.ip"
    v-model:page="pagination.pageNum" :item-key="item => item.ip" fixed-header items-per-page-text="" show-current-page
    prev-page-label="dick">
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>
    <template v-slot:item.data-table-expand="{ internalItem, isExpanded, toggleExpand }">
      <v-btn :append-icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        :text="isExpanded(internalItem) ? '收起' : '更多'" class="text-none" color="medium-emphasis" size="small"
        variant="text" width="105" border slim @click="toggleExpand(internalItem)"></v-btn>
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr class="text-center">
        <td :colspan="columns.length" class="py-2">
          <v-btn size="x-small" variant="tonal" @click="preview(item.ip)">预览</v-btn>
          <v-btn size="x-small" variant="tonal" @click="stopPreview(item.ip)">停止预览</v-btn>
          <v-btn size="x-small" variant="tonal" @click="openSite(item.ip)">打开网页</v-btn>
          <!-- <v-btn size="x-small" variant="tonal" @click="getDeviceInfo(item.ip)">获取设备信息</v-btn> -->
          <v-dialog max-width="500">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" size="x-small" variant="tonal" @click="text=JSON.stringify(item.DeviceInfo, null, 2)">修改设备信息</v-btn>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card title="修改设备信息">
                <v-card-text>
                  <v-textarea rows="15" auto-grow v-model="text"></v-textarea>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text="取消" @click="isActive.value = false"></v-btn>
                  <v-btn text="确定" @click="putDeviceInfo(item.ip);isActive.value = false"></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
          <!-- <v-btn size="x-small" variant="tonal" @click="getSecurityCapabilities(item.ip)">获取加密能力</v-btn> -->
          <v-btn size="x-small" variant="tonal" @click="basicRestore(item.ip)">简单恢复</v-btn>
          <v-btn size="x-small" variant="tonal" @click="fullRestore(item.ip)">完全恢复</v-btn>
          <v-btn size="x-small" variant="tonal" @click="activate(item.ip)">激活</v-btn>
          <v-btn size="x-small" variant="tonal" @click="reboot(item.ip)">重启</v-btn>
        </td>
      </tr>
      <tr class="h-[400px]">
        <td :colspan="columns.length" class="py-2">
          <StreamPlayer :ref="el => setPlayerRef(el, item.ip)" class="w-[640px] h-[360px]" />
        </td>
      </tr>
    </template>
    <template v-slot:bottom="{ pageCount }">
      <div class="flex items-center justify-between">
        <div class="w-1/10 !px-4">共 {{ devices.length }} 个设备</div>
        <v-pagination class="w-8/10" v-model="pagination.pageNum" :length="pageCount" size="x-small" />
        <div class="w-1/10"></div>
      </div>
    </template>
  </v-data-table>
</template>

<script setup lang="ts" name="Home">
import log from 'electron-log/renderer'
import StreamPlayer from '../components/StreamPlayer.vue'
import { de } from 'element-plus/es/locale'
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
const text = ref('')
const devices = ref([])
const search = ref('')
const pagination = reactive({
  pageNum: 1,
})
const players = reactive({})
const setPlayerRef = (el, ip) => {
  if (el) {
    players[ip] = el
  } else {
    delete players[ip]
  }
}
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
// const ip = ref('172.30.179.0/24')
// const ip = ref('172.30.0.0/24')
// const ip = ref('172.30.8.0/24')
// const ip = ref('172.30.0.245')
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

const preview = async (ip) => {
  players[ip].start(ip)
}
const stopPreview = (ip) => {
  players[ip].stop(ip)
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
const putDeviceInfo = async (ip) => {
  window.api.common.call(ip, 'putDeviceInfo', JSON.parse(text.value)).then(res => {
    log.debug(ip, res)
    log.info(ip, '修改设备信息成功')
  }).catch((err) => {
    log.error(err)
  })
}
const activate = async (ip) => {
  window.api.common.call(ip, 'activate').then(res => {
    log.debug(res)
  }).catch(err => {
    log.error(err)
  })
}
const reboot = async (ip) => {
  window.api.common.call(ip, 'reboot').then(res => {
    log.debug(res)
  }).catch(err => {
    log.error(err)
  })
}
const basicRestore = async (ip) => {
  window.api.common.call(ip, 'basicRestore').then(res => {
    log.debug(res)
  }).catch(err => {
    log.error(err)
  })
}
const fullRestore = async (ip) => {
  window.api.common.call(ip, 'fullRestore').then(res => {
    log.debug(res)
  }).catch(err => {
    log.error(err)
  })
}
const openSite = async (ip) => {
  window.device.openSite(ip)
}
</script>
<style scoped></style>
