<template>
  <video ref="videoEl" autoplay playsinline controls></video>
</template>

<script setup name="StreamPlayer">
import { ref, onMounted } from 'vue'
import log from 'electron-log/renderer'

const videoEl = ref(null)
const props = defineProps({
})
const app = 'live'  // ZLM 默认应用名
let pc;
const pull = async (ip) => {
  const url = `rtsp://admin:sszx123456@${ip}:554/Streaming/Channels/101`
  const response = await fetch(`http://127.0.0.1/index/api/addStreamProxy?app=${app}&stream=${ip}&type=play&secret=aev5nuiInWrzIEKJMJc5suXzE6nhIdgI&vhost=__defaultVhost__&url=${url}`)
  return response
}
const play = async (ip) => {
  if (pc) {
    stop(ip)
  }
  pc = new RTCPeerConnection({
    iceServers: [] // 可加 STUN/TURN
  })

  pc.ontrack = (event) => {
    videoEl.value.srcObject = event.streams[0]
  }
  pc.addTransceiver('video', { direction: 'recvonly' })
  pc.addTransceiver('audio', { direction: 'recvonly' })
  pc.createOffer().then((desc) => {
    pc.setLocalDescription(desc).then(() => {
      fetch(`http://127.0.0.1/index/api/webrtc?app=${app}&stream=${ip}&type=play`, {
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
        pc.setRemoteDescription(answer).then(() => {
          log.info(ip, '播放成功');
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
  await pull(ip)
  play(ip)
}
const stop = (ip) => {
  // 1. 停止所有 track
  if (videoEl.value?.srcObject) {
    videoEl.value.srcObject.getTracks().forEach(track => {
      track.stop();
    });
    videoEl.value.srcObject = null;
  }
  
  // 2. 关闭 PeerConnection
  if (pc) {
    pc.ontrack = null;
    pc.close();
    pc = null;
  }
  
  log.info(ip, '已停止播放');
}
defineExpose({
  start,
  stop
})
onMounted(async () => {
})
</script>
