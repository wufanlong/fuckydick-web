<template>
    <div ref="logRef" class="log-container pl-4 overflow-y-auto !mr-[-5px] overflow-x-hidden h-full" v-html="logContent">
    </div>
</template>
<script setup name="Log">
const logContent = ref('')
window.system.log.loggingOnRenderer((message) => {
    logContent.value = message;
});
const logRef = ref(null)
onMounted(() => {
    window.system.log.getLog().then(log => {
        logContent.value = log
        scrollToBottom()
    })
})

// 自动滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (!logRef.value) return
  logRef.value.scrollTop = logRef.value.scrollHeight
}

// 监听日志变化
watch(logContent, () => {
  scrollToBottom()
})
</script>