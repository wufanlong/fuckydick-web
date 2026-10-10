<template>
  <video ref="videoEl" autoplay playsinline controls></video>
</template>

<script setup lang="ts" name="StreamPlayer">
import { ref, onMounted } from 'vue'
import log from 'electron-log/renderer'

const devices = ref([])
const videoEl = ref(null)
const props = defineProps({
  devices: {
    type: Array,
    default: []
  }
})
const app = 'live'  // ZLM 默认应用名
const pc = ref(null)
const proxyKey = ref(null)
const pull = async (ip, url) => {
  let password = "sszx123456"
  password = props.devices.find(device => device.ip === ip.substring(0, ip.lastIndexOf(".")) + ".0/24")?.password || password
  password = props.devices.find(device => device.ip === ip)?.password || password
  // 回放url示例
  // rtsp://admin:sszx123456@172.30.1.250:554/Streaming/tracks/2001/?starttime=20260917T015207Z&endtime=20260917T031157Z&name=00010000762000000&size=1064144700
  let stream = ip
  if (!url) {
    url = `rtsp://admin:${password}@${ip}:554/Streaming/Channels/101`
  } else {
    url = url.replace("password", password)
    stream = ip + url.match(/\/Streaming\/tracks\/(\d+)\//)[1]
  }
  url = url.replace(":554:554", ":554")
  console.log("拉流", ip, url)
  const response = await fetch(`http://127.0.0.1/index/api/addStreamProxy?app=${app}&stream=${stream}&type=play&secret=aev5nuiInWrzIEKJMJc5suXzE6nhIdgI&vhost=__defaultVhost__&url=${url}`)
  const ret = await response.json()

  if (ret.code !== 0) {
    throw new Error(ret.msg || "添加拉流失败")
  }
  // ★ 保存 ZLM 返回的 key
  proxyKey.value = ret.data?.key
  return {
    stream,
    key: proxyKey.value
  }
}
// async function init() {
//   devices.value.push(...JSON.parse(await window.system.config.readDeviceConfig()))
// }
const play = async (ip, url) => {
  let stream = ip
  if (url) {
    stream = ip + url.match(/\/Streaming\/tracks\/(\d+)\//)[1]
  }
  pc.value = new RTCPeerConnection({
    iceServers: [] // 可加 STUN/TURN
  })

  pc.value.ontrack = (event) => {
    videoEl.value.srcObject = event.streams[0]
  }
  pc.value.addTransceiver('video', { direction: 'recvonly' })
  pc.value.addTransceiver('audio', { direction: 'recvonly' })
  pc.value.createOffer().then((desc) => {
    pc.value.setLocalDescription(desc).then(() => {
      fetch(`http://127.0.0.1/index/api/webrtc?app=${app}&stream=${stream}&type=play`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        responseType: 'json',
        body: desc.sdp
      }).then(res => res.json()).then(ret => {
        if (ret.code != 0) {// mean failed for offer/answer exchange 
          return;
        }
        let answer = {};
        answer.sdp = ret.sdp;
        answer.type = 'answer';
        pc.value.setRemoteDescription(answer).then(() => {
          // log.info(ip, '播放成功');
        }).catch(e => {
          log.error(e);
        });
      });
    });
  }).catch(e => {
    debug.error(e);
  });
}
const start = async (ip) => {
  if (pc.value) {
    stop(ip)
  }
  await pull(ip)
  play(ip)
}
const playback = async (ip, url) => {
  stop(ip)
  await pull(ip, url)
  play(ip, url)
}
const stop = async (ip) => {
  // 1. 停止 video
  if (videoEl.value?.srcObject) {
    videoEl.value.srcObject
      .getTracks()
      .forEach(track => track.stop())

    videoEl.value.srcObject = null
  }

  // 2. 关闭 WebRTC
  if (pc.value) {
    pc.value.ontrack = null
    pc.value.close()
    pc.value = null
  }

  // 3. ★ 删除 ZLMediaKit 拉流代理
  if (proxyKey.value) {
    try {
      const url =
        `http://127.0.0.1/index/api/delStreamProxy` +
        `?secret=aev5nuiInWrzIEKJMJc5suXzE6nhIdgI` +
        `&key=${encodeURIComponent(proxyKey.value)}`

      const response = await fetch(url)
    } catch (e) {
      console.error("删除 ZLM Proxy 失败:", e)
    }

    proxyKey.value = null
  }
}
defineExpose({
  start,
  playback,
  stop
})
onMounted(async () => {
  // init()
})
</script>
