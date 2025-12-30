const fs = require('fs')
const path = require('path')

// ===== 修改为你的 src 根目录 =====
const ROOT = path.resolve(
  'C:/Users/DannyChan/Desktop/wufanlong/project/fuckydick-web/src'
)

// ===== 需要创建的目录（终极结构）=====
const DIRS = [
  // main
  'main/bootstrap',
  'main/window',
  'main/ipc/camera',
  'main/ipc/system',
  'main/core/camera/domain',
  'main/core/camera/dto',
  'main/core/camera/enums',
  'main/core/camera/factory',
  'main/core/camera/ports',
  'main/core/camera/services',
  'main/core/camera/repository',
  'main/core/plugin',
  'main/core/auth',
  'main/vendors/hikvision/isapi',
  'main/vendors/hikvision/mapper',
  'main/vendors/dahua/cgi',
  'main/vendors/dahua/mapper',
  'main/vendors/onvif/discovery',
  'main/vendors/onvif/ptz',
  'main/stream/rtsp',
  'main/stream/hls',
  'main/stream/flv',
  'main/stream/webrtc',
  'main/infra/http',
  'main/infra/xml',
  'main/infra/crypto',
  'main/infra/process',
  'main/infra/fs',
  'main/storage/sqlite',
  'main/storage/migrate',
  'main/logger',
  'main/config',
  'main/types',

  // preload
  'preload/bridge',
  'preload/types',

  // renderer
  'renderer/src/app',
  'renderer/src/modules/device',
  'renderer/src/modules/preview',
  'renderer/src/modules/playback',
  'renderer/src/modules/ptz',
  'renderer/src/modules/setting',
  'renderer/src/components/camera',
  'renderer/src/components/stream',
  'renderer/src/components/common',
  'renderer/src/services',
  'renderer/src/store',
  'renderer/src/router',
  'renderer/src/composables',
  'renderer/src/utils',
  'renderer/src/assets',
  'renderer/src/styles'
]

// ===== 需要创建的文件 =====
const FILES = [
  // main
  'main/index.js',
  'main/bootstrap/app.bootstrap.js',
  'main/bootstrap/ipc.bootstrap.js',
  'main/bootstrap/plugin.bootstrap.js',

  'main/window/main.window.js',
  'main/window/preview.window.js',
  'main/window/setting.window.js',

  'main/ipc/index.js',
  'main/ipc/camera/camera.ipc.js',
  'main/ipc/camera/device.ipc.js',
  'main/ipc/camera/stream.ipc.js',
  'main/ipc/camera/ptz.ipc.js',
  'main/ipc/system/file.ipc.js',
  'main/ipc/system/printer.ipc.js',
  'main/ipc/system/updater.ipc.js',

  'main/core/camera/domain/camera.entity.js',
  'main/core/camera/domain/channel.entity.js',
  'main/core/camera/domain/stream.entity.js',

  'main/core/camera/dto/camera.dto.js',
  'main/core/camera/dto/stream.dto.js',

  'main/core/camera/enums/vendor.enum.js',
  'main/core/camera/enums/stream-type.enum.js',
  'main/core/camera/enums/protocol.enum.js',

  'main/core/camera/factory/camera.factory.js',
  'main/core/camera/factory/vendor.factory.js',

  'main/core/camera/ports/camera.port.js',
  'main/core/camera/ports/stream.port.js',
  'main/core/camera/ports/ptz.port.js',

  'main/core/camera/services/camera.service.js',
  'main/core/camera/services/stream.service.js',
  'main/core/camera/services/ptz.service.js',

  'main/core/camera/repository/camera.repo.js',

  'main/core/plugin/plugin.interface.js',
  'main/core/plugin/plugin.loader.js',
  'main/core/plugin/plugin.manager.js',

  'main/core/auth/credential.store.js',

  'main/vendors/hikvision/isapi/device.api.js',
  'main/vendors/hikvision/isapi/stream.api.js',
  'main/vendors/hikvision/isapi/ptz.api.js',
  'main/vendors/hikvision/mapper/hik.mapper.js',
  'main/vendors/hikvision/hik.adapter.js',

  'main/vendors/dahua/cgi/device.api.js',
  'main/vendors/dahua/mapper/dahua.mapper.js',
  'main/vendors/dahua/dahua.adapter.js',

  'main/vendors/onvif/onvif.adapter.js',

  'main/stream/stream.manager.js',

  'main/logger/app.logger.js',
  'main/logger/device.logger.js',
  'main/logger/stream.logger.js',

  'main/config/app.config.js',
  'main/config/vendor.config.js',
  'main/config/stream.config.js',

  'main/types/global.d.js',

  // preload
  'preload/index.js',
  'preload/bridge/camera.bridge.js',
  'preload/bridge/stream.bridge.js',
  'preload/bridge/system.bridge.js',
  'preload/types/api.d.js',

  // renderer
  'renderer/src/app/bootstrap.js',
  'renderer/src/app/permission.js',

  'renderer/src/services/camera.service.js',
  'renderer/src/services/stream.service.js',

  'renderer/src/store/camera.store.js',

  'renderer/src/router/index.js',

  'renderer/src/composables/useCamera.js'
]

// Vue 文件单独处理
const VUE_FILES = [
  'renderer/src/modules/device/DeviceList.vue',
  'renderer/src/modules/device/DeviceAdd.vue',
  'renderer/src/modules/device/DeviceDetail.vue',
  'renderer/src/modules/preview/LiveView.vue',
  'renderer/src/modules/playback/PlaybackView.vue',
  'renderer/src/modules/ptz/PtzPanel.vue',
  'renderer/src/modules/setting/VendorConfig.vue',

  'renderer/src/components/camera/CameraCard.vue',
  'renderer/src/components/stream/StreamPlayer.vue'
]

// ===== 创建目录 =====
DIRS.forEach(dir => {
  const fullPath = path.join(ROOT, dir)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
    console.log('📁 创建目录:', fullPath)
  }
})

// ===== 创建 JS 文件 =====
FILES.forEach(file => {
  const fullPath = path.join(ROOT, file)
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(
      fullPath,
      `/**
 * Auto generated file
 * Path: ${file}
 */
`,
      'utf8'
    )
    console.log('📄 创建文件:', fullPath)
  }
})

// ===== 创建 Vue 文件 =====
VUE_FILES.forEach(file => {
  const fullPath = path.join(ROOT, file)
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(
      fullPath,
`<template>
  <div></div>
</template>

<script setup>
// Auto generated component
</script>

<style scoped>
</style>
`,
      'utf8'
    )
    console.log('🧩 创建 Vue 文件:', fullPath)
  }
})

console.log('\n🎉 安防平台【完整 JS 架构】生成完成')
