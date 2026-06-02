<template>
  <div>
    <v-tabs color="deep-purple-accent-4" align-tabs="center" stacked v-model="tab" center-active @click="clickTab()">
      <v-tab v-for="recorder in recorders" :key="recorder.id" :value="recorder.id">
        <div>{{ recorder.deviceName }}</div>
        <div>{{ recorder.ip }}</div>
        <div v-if="recorder.offlineCount && recorder.offlineCount !== 0">{{ `${recorder.offlineCount}个异常` }}</div>
      </v-tab>
    </v-tabs>
    <v-virtual-scroll class="h-full w-full" :items="[1]">
      <template v-slot:default="{ item }">
        <div class="flex flex-row justify-center flex-wrap w-full h-full items-center">
          <v-card v-for="device in channelStatusList" :title="devices.find(d => d.ip === device.sourceInputPortDescriptor.ipAddress)?.VideoInputChannel?.name" :subtitle="device.sourceInputPortDescriptor.ipAddress"
            class="deviceCard !mx-3 !my-2 hover:scale-102" :color="getColor(device.chanDetectResult)" variant="tonal">
            <v-card-item>
              <StreamPlayer :ref="el => setPlayerRef(el, device.sourceInputPortDescriptor.ipAddress)"
                class="w-[360px] h-[202.5px]" />
            </v-card-item>
            <v-card-actions>
              <v-btn @click="preview(device.sourceInputPortDescriptor.ipAddress)">
                播放
              </v-btn>
              <v-btn @click="stopPreview(device.sourceInputPortDescriptor.ipAddress)">
                取消播放
              </v-btn>
              <v-btn>
                D{{ device.id }}
              </v-btn>
              <v-btn>
                {{ getText(device.chanDetectResult) }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script setup lang="ts" name="Recorders">
import StreamPlayer from '../components/StreamPlayer.vue'
import log from 'electron-log/renderer'

const recorders = ref([])
const colors = reactive({
  "netUnreachable": "red",
  "connect": "indigo",
})
const texts = reactive({
  "netUnreachable": "不在线(网络异常)",
  "connect": "在线",
})
const channelStatusList = ref([])
const devices = ref([])
const tab = ref(0)
const players = reactive({})
let removeDeviceUpdatedListener: (() => void) | undefined
let removeDeviceInitFailedListener: (() => void) | undefined

onMounted(() => {
  init()
  removeDeviceUpdatedListener = window.device.onDeviceUpdated((device) => {
    console.log(device)
    const d = devices.value.find(d => d.ip === device.ip)
    if (!d) {
      devices.value.push(device)
    } else {
      Object.assign(d, device)
    }
    const recorder = recorders.value.find(recorder => recorder.ip === device.ip)
    const currentRecorder = recorders.value.find(r => r.id === tab.value)
    if (recorder) {
      window.api.common.call(device.ip, 'getChannelStatusList').then(res => {
        Object.assign(recorders.value.find(recorder => recorder.ip === device.ip), {
          ...recorder,
          "offlineCount": res.filter(channelStatus => !channelStatus.online).length,
          "channelStatusList": res
        })
        if (currentRecorder.ip === device.ip) {
          channelStatusList.value.length = 0;
          channelStatusList.value.push(...res)
        }
      }).catch(err => {
        log.error(err)
      })
    }
  })
  removeDeviceInitFailedListener = window.device.onDeviceInitFailed((ip) => {
    devices.value = devices.value.filter(d => d.ip !== ip)
  })
})
onUnmounted(() => {
  removeDeviceUpdatedListener?.()
  removeDeviceInitFailedListener?.()
})
watch(recorders.value, newVal => {
  tab.value = newVal[0].id
})
watch(channelStatusList.value, newVal => {
  for (const ip in players) {
    if (!newVal.find(device => device.sourceInputPortDescriptor.ipAddress === ip)) {
      stopPreview(ip)
      delete players[ip]
    }
  }
  
  // 创建摄像机设备
  for (let i = 0; i < newVal.length; i++) {
    window.device.createIsapiSDKInstance(newVal[i].sourceInputPortDescriptor.ipAddress)
  }
})
const clickTab = () => {
  stopPreviewAll()
  const currentRecorder = recorders.value.find(r => r.id === tab.value)
  console.log("currentRecorder", currentRecorder)
  channelStatusList.value.length = 0;
  channelStatusList.value.push(...currentRecorder.channelStatusList)
}
const getColor = (result) => {
  return colors[result] || "deep-orange"
}
const getText = (result) => {
  return texts[result] || "未知错误，请联系管理员"
}
const setPlayerRef = (el, ip) => {
  if (el) {
    players[ip] = el
  } else {
    delete players[ip]
  }
}
const previewAll = async () => {
  for (let i = 0; i < channelStatusList.value.length; i++) {
    const device = channelStatusList.value[i]
    players[device.sourceInputPortDescriptor.ipAddress].start(device.sourceInputPortDescriptor.ipAddress)
  }
}
const stopPreviewAll = async () => {
  for (let i = 0; i < channelStatusList.value.length; i++) {
    const device = channelStatusList.value[i]
    players[device.sourceInputPortDescriptor.ipAddress].stop(device.sourceInputPortDescriptor.ipAddress)
  }
}
const preview = async (ip) => {
  players[ip].start(ip)
}
const stopPreview = (ip) => {
  players[ip].stop(ip)
}
async function init() {
  recorders.value.push(...JSON.parse(await window.system.config.readRecorderConfig()))
  for (let i = 0; i < recorders.value.length; i++) {
    window.device.createIsapiSDKInstance(recorders.value[i].ip, recorders.value[i].password)
  }
}
</script>
<style>
.deviceCard>.v-card-item {
  padding: 5px 14px !important;
}

.deviceCard>.v-card-actions {
  padding: 5px 8px !important;
}
</style>