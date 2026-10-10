<template>
  <div>
    <v-sheet class="px-1">
      <v-chip-group
        v-model="chipValue"
        selected-class="text-primary"
        mandatory
        @update:modelValue="handleChipValueChange"
      >
        <v-chip
          v-for="tag in tags"
          :key="tag"
          :text="tag"
        ></v-chip>
      </v-chip-group>
    </v-sheet>
    <v-tabs color="deep-purple-accent-4" align-tabs="center" class="mb-1" stacked v-model="tab" center-active @click="clickTab">
      <v-tab v-for="recorder in recorders.filter(r => r.place === tags[chipValue])" :key="recorder.id" :value="recorder.id">
        <v-badge floating  location="top right" :offset-x="5" color="error" :content="recorder.offlineCount" :model-value="recorder.offlineCount !== 0">
          <div class="flex flex-col justify-center align-center">
            <div>{{ recorder.deviceName }}</div>
            <div class="text-[11px]">{{ recorder.ip }}</div>
            <!-- <div v-if="recorder.offlineCount && recorder.offlineCount !== 0">{{ `${recorder.offlineCount}个异常` }}</div> -->
          </div>
        </v-badge>
      </v-tab>
    </v-tabs>
    <v-virtual-scroll class="h-full w-full pt-1 pb-3" :items="[1]">
      <template v-slot:default="{ item }">
        <div class="flex flex-row justify-center flex-wrap w-full h-full items-center">
          <v-card v-for="device in channelStatusList" :key="device.sourceInputPortDescriptor.ipAddress" :subtitle="`D${device.id} ${channelList.find(c => c.id === device.id)?.name || ''} ${device.sourceInputPortDescriptor.ipAddress} ${getText(device.chanDetectResult)}`"
            class="deviceCard" :color="getColor(device.chanDetectResult)" variant="tonal">
            <v-card-item>
              <StreamPlayer v-if="device.isPlay" :devices="devicesJson" :ref="el => setPlayerRef(el, device.sourceInputPortDescriptor.ipAddress)"
                class="w-[420px]" />
            </v-card-item>
            <v-card-actions>
              <v-btn v-if="device.online" @click="preview(device)">
                播放
              </v-btn>
              <v-btn v-else @click="device.isPlay=true;initPlayback(device.id)">
                查看回放
              </v-btn>
              <v-select density="compact" :width="100" v-if="playbackMap[device.id]"
                label="请选择回放时间" v-model="playbackMap[device.id].index"
                @update:modelValue="playback(device)"
                :items="playbackMap[device.id]?.timeList"
              ></v-select>
              <v-btn @click="stopPreview(device)">
                取消播放
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </template>
    </v-virtual-scroll>
    <v-snackbar v-model="snackbar" >
      未找到回放文件
    </v-snackbar>
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
const channelList = ref([])
const devices = ref([])
const devicesJson = ref([])
const snackbar = ref(false)
const tab = ref(0)
const players = reactive({})
const playbackMap = reactive({})
let removeDeviceUpdatedListener: (() => void) | undefined
let removeDeviceInitFailedListener: (() => void) | undefined
const chipValue = ref(0)
const tags = [
  '双十一期',
  '双十二期',
  '双十三期',
  '双十四期',
  '京口',
  '总园'
]
const handleChipValueChange = (newValue) => {
  const filteredRecorders = recorders.value.filter(r => r.place === tags[newValue])
  for (let i = 0; i < filteredRecorders.length; i++) {
    window.device.createIsapiSDKInstance(filteredRecorders[i].ip, filteredRecorders[i].password)
  }
  tab.value = filteredRecorders[0]?.id || 0
}
onMounted(() => {
  init()
  removeDeviceUpdatedListener = window.device.onDeviceUpdated((device) => {
    const d = devices.value.find(d => d.ip === device.ip)
    if (!d) {
      devices.value.push(device)
    } else {
      Object.assign(d, device)
    }
    const recorder = recorders.value.find(recorder => recorder.ip === device.ip)
    const currentRecorder = recorders.value.find(r => r.id === tab.value)
    if (recorder) {
      recorder.deviceName = device.DeviceInfo?.deviceName
      // 获取通道在线状态
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
      // 获取通道列表
      window.api.common.call(device.ip, 'getChannelsList').then(res => {
        Object.assign(recorders.value.find(recorder => recorder.ip === device.ip), {
          ...recorder,
          "channelList": res
        })
        if (currentRecorder.ip === device.ip) {
          channelList.value.length = 0;
          channelList.value.push(...res)
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
watch(channelStatusList.value, (newVal, oldVal) => {
  Object.keys(playbackMap).forEach(channelId => {
    delete playbackMap[channelId]
  })
  // 创建离线摄像机设备
  for (let i = 0; i < newVal.length; i++) {
    if (!newVal[i].online) {
      window.device.createIsapiSDKInstance(newVal[i].sourceInputPortDescriptor.ipAddress)
    }
  }
})
const saveRecorders = () => {
  let arr = []
  for (let i = 0; i < recorders.value.length; i++) {
    let obj = {}
    Object.assign(obj, recorders.value[i])
    delete obj.channelStatusList
    delete obj.channelList
    delete obj.offlineCount
    arr.push(obj)
  }
  window.system.config.writeRecorderConfig(JSON.stringify(arr))
}
const clickTab = (e) => {
  stopPreviewAll()
  const currentRecorder = recorders.value.find(r => r.id === tab.value)
  window.device.createIsapiSDKInstance(currentRecorder.ip, currentRecorder.password)
  saveRecorders()
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
const previewAll = () => {
  for (let i = 0; i < channelStatusList.value.length; i++) {
    const device = channelStatusList.value[i]
    preview(device)
  }
}
const stopPreviewAll = () => {
  Object.keys(players).forEach(ip => {
    players[ip].stop(ip)
  })
}
const preview = async (device) => {
  device.isPlay = true
  const ip = device.sourceInputPortDescriptor.ipAddress
  const timer = setInterval(() => {
    if (players[ip]) {
      players[ip].start(ip)
      clearInterval(timer)
    }
  }, 125)
}
const stopPreview = (device) => {
  device.isPlay = false
  const ip = device.sourceInputPortDescriptor.ipAddress
  players[ip].stop(ip)
}
const initPlayback = async (channelId) => {
  const currentRecorder = recorders.value.find(r => r.id === tab.value)
  // 离线监控回放
  const currentDate = new Date();
  let nowYear = currentDate.getFullYear();
  let nowMonth = currentDate.getMonth() + 1;
  let year = nowYear
  let month = nowMonth
  let data = {
    year: year,
    monthOfYear: month
  }
  let trackDailyDistribution;
  let isPlaybackFileExist = false
  for (let j = 5; j > 0; j--) {
    trackDailyDistribution = await window.api.common.call(currentRecorder.ip, 'postRecordTracksDailyDistributionByID', {
      id: channelId + "01",
      data: data
    })
    const day = trackDailyDistribution.dayList.day.find(d => d.record)
    if (day) {
      Object.assign(trackDailyDistribution, {
        ...data
      })
      isPlaybackFileExist = true
      break;
    }
    month--;
    if (month == 0) {
      month = 12;
      year--;
    }
    data = {
      year: year,
      monthOfYear: month
    }
  }
  if (!isPlaybackFileExist) {
    log.error("未找到回放文件")
    snackbar.value = true
    return
  } else {
    const day = trackDailyDistribution.dayList.day.findLast(d => d.record)
    const {
      year,
      monthOfYear,
    } = trackDailyDistribution
    const dayOfMonth = day.dayOfMonth
    // 注意：JS Date 的月份从 0 开始，所以要 -1
    const date = new Date(
      Date.UTC(year, monthOfYear - 1, dayOfMonth)
    )
    // 前一天
    const startDate = new Date(date)
    startDate.setUTCDate(startDate.getUTCDate() - 1)
    // 后一天
    const endDate = new Date(date)
    endDate.setUTCDate(endDate.getUTCDate() + 1)
    // 格式化为 YYYY-MM-DDTHH:mm:ssZ
    const formatDate = (date, endOfDay = false) => {
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const day = String(date.getUTCDate()).padStart(2, '0')
      if (endOfDay) {
        return `${year}-${month}-${day}T23:59:59Z`
      }
      return `${year}-${month}-${day}T00:00:00Z`
    }
    const startTime = formatDate(startDate)
    const endTime = formatDate(endDate, true)
    window.api.common.call(
      currentRecorder.ip,
      'postSearch',
      {
        searchID: "CBD83726-CF20-0001-A4A4-14601D301E55",
        trackList: {
          trackID: channelId + "01",
        },
        timeSpanList: {
          timeSpan: {
            startTime,
            endTime
          }
        },
        maxResults: 100,
        searchResultPosition: 0,
        metadataList: {
          metadataDescriptor: "//recordType.meta.std-cgi.com"
        }
      }
    ).then(res => {
      res.timeList = []
      for (let i = 0; i < res.matchList.searchMatchItem.length; i++) {
        res.timeList.push({
          title: res.matchList.searchMatchItem[i].timeSpan.startTime + " - " + res.matchList.searchMatchItem[i].timeSpan.endTime,
          value: i
        })
      }
      playbackMap[channelId] = res
    }).catch(err => {
      log.error(err)
    })
  }
}
const playback = (channel) => {
  let url = playbackMap[channel.id].matchList.searchMatchItem[playbackMap[channel.id].index].mediaSegmentDescriptor.playbackURI
  const recorderIp = recorders.value.find(r => r.id === tab.value).ip
  const ip = channel.sourceInputPortDescriptor.ipAddress
  let playbackUrl = url.replace("rtsp://" + recorderIp, "rtsp://admin:password@" + recorderIp + ":554")
  players[ip].playback(recorderIp, playbackUrl)
}
async function init() {
  recorders.value.push(...JSON.parse(await window.system.config.readRecorderConfig()))
  devicesJson.value.push(...JSON.parse(await window.system.config.readDeviceConfig()))
  const filteredRecorders = recorders.value.filter(r => r.place === tags[chipValue.value])
  for (let i = 0; i < filteredRecorders.length; i++) {
    window.device.createIsapiSDKInstance(filteredRecorders[i].ip, filteredRecorders[i].password)
  }
  tab.value = filteredRecorders[0]?.id || 0
}
</script>
<style scoped>
.deviceCard>.v-card-item {
  /* padding: 5px 14px !important; */
  padding: 0px;
}

.deviceCard>.v-card-actions {
  /* padding: 5px 8px !important; */
  padding: 0px;
}
.v-tabs {
  height: 57px !important;
}
.v-tabs--density-default.v-tabs--stacked {
  --v-tabs-height: 57px !important;
}
</style>