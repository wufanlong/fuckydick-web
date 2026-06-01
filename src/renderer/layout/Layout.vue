<template>
  <div class="h-full flex flex-row justify-center">
    <v-tabs
      v-model="tab"
      class="h-full"
      align-tabs="center"
      direction="vertical"
      color="deep-purple-accent-4"
    >
      <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
        {{ tab.label }}
      </v-tab>
    </v-tabs>
    <v-tabs-window class="flex-grow h-full" v-model="tab">
      <v-tabs-window-item
        class="h-full"
        v-for="tab in tabs" :key="tab.value" :value="tab.value"
      >
        <router-view />
    </v-tabs-window-item>
  </v-tabs-window>
  </div>
</template>

<script setup lang="ts" name="Layout">
import { useRouter } from 'vue-router'
const router = useRouter();
const tab = ref("1")
const tabs = [
  { label: "首页", value: "1", name: "Home" },
  { label: "录像机", value: "2", name: "Recorders" },
  { label: "配置", value: "3", name: "Config" },
]
watch(tab, (newVal) => {
  const selectedTab = tabs.find((t) => t.value === newVal)
  if (selectedTab) {
    router.replace({ name: selectedTab.name })
  }
})

</script>