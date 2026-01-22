<template>
  <video ref="videoEl" autoplay playsinline controls></video>
</template>

<script setup name="StreamPlayer">
import { ref, onMounted } from 'vue'
import log from 'electron-log/renderer'

const videoEl = ref(null)
const props = defineProps({
  streamId: String,
})
const app = 'live'  // ZLM 默认应用名
const pull = async () => {
  const url = "rtsp://admin:sszx123456@172.30.0.186:554/Streaming/Channels/101"
  const response = await fetch(`http://127.0.0.1/index/api/addStreamProxy?app=${app}&stream=${props.streamId}&type=play&secret=aev5nuiInWrzIEKJMJc5suXzE6nhIdgI&vhost=__defaultVhost__&url=${url}`)
  return response
}
const play = async () => {
  const pc = new RTCPeerConnection({
    iceServers: [] // 可加 STUN/TURN
  })

  pc.ontrack = (event) => {
    videoEl.value.srcObject = event.streams[0]
  }
  pc.addTransceiver('video', { direction: 'recvonly' })
  pc.addTransceiver('audio', { direction: 'recvonly' })
  pc.createOffer().then((desc) => {
    pc.setLocalDescription(desc).then(() => {
      fetch(`http://127.0.0.1/index/api/webrtc?app=${app}&stream=${props.streamId}&type=play`, {
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
        log.info('answer:', ret.sdp);
        pc.setRemoteDescription(answer).then(() => {
          log.info('播放成功');
        }).catch(e => {
          log.error(e);
        });
      });
    });
  }).catch(e => {
    debug.error(e);
  });
}
onMounted(async () => {
  await pull()
  play()
})
</script>
