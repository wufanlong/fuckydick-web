<template>
    <div class="log-container pl-4" v-html="logContent">
    </div>
</template>
<script setup name="Log">
const logContent = ref('')
window.system.log.loggingOnRenderer((message) => {
    logContent.value = message;
});
onMounted(() => {
    window.system.log.getLog().then(log => {
        logContent.value = log
    })
})
</script>