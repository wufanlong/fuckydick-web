
<template>
  尊雕
  <v-divider :thickness="16"></v-divider>
  {{ count }}
  <button @click="count++">Click me</button>
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
