<template>
    <v-virtual-scroll class="config h-full w-full"
    :items="['1']">
    <template v-slot:default="{ item }">
        <RecordersConfig />
        <v-divider inset class="my-4"></v-divider>
        <DeviceConfig />
        <v-divider inset class="my-4"></v-divider>
    </template>
  </v-virtual-scroll>
</template>

<script setup lang="ts" name="Config">
import RecordersConfig from './components/RecordersConfig.vue'
import DeviceConfig from './components/DeviceConfig.vue'
</script>

<style scoped>
.config > .v-virtual-scroll__item {
    width: 100%;
}
</style>