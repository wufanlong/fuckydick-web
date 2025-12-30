
<template>
  💖 尊雕
  <v-divider :thickness="16"></v-divider>
  {{ count }}
  <button class="font-bold" @click="count++"><span class="font-bold">Click me</span></button>
</template>

<script setup>

defineProps({
  msg: String,
})

const count = ref(0)
</script>
<style scoped>
  .read-the-docs {
    color: #888;
}
</style>
