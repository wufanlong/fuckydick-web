<template>
  <router-view></router-view>
</template>

<script setup>
import { devtools } from '@vue/devtools'
console.log(process.env.NODE_ENV)

if(process.env.NODE_ENV.trim() === 'development') {
    devtools.connect('http://localhost', 8098)
}
</script>

<style scoped>
</style>
