# Electron + 多摄像头平台 API 说明（JS 版）

> 适用场景：
> - Electron Forge
> - 前端使用 Vue（renderer）
> - 需要对接多个摄像头厂家（海康 / 大华 / 其他）
> - 使用 IPC 通信
> - 使用 JavaScript（非 TypeScript）

---

## 二、摄像头相关 API 设计思路

> 仅涉及摄像头部分，不包括商城或其他业务

### 1️⃣ renderer → preload → main → 服务层

```text
Vue 页面
 ↓
renderer/src/api/camera.api.js
 ↓
preload/modules/camera.js
 ↓
ipcMain.handle('camera:xxx')
 ↓
camera.service.js / vendor.adapter.js
```

- renderer 不直接调用 ipcRenderer
- preload 是安全边界，暴露 window.api.camera
- main 处理业务逻辑，调用不同厂商的 adapter

### 2️⃣ 主要模块

#### main/core/camera/
- domain/ → 摄像头实体（Camera、Channel、Stream）
- dto/ → 数据传输对象
- enums/ → 摄像头厂商、流类型、协议类型
- ports/ → 统一接口（CameraPort、StreamPort、PtzPort）
- factory/ → 根据厂商创建摄像头实例
- services/ → 摄像头业务服务（管理、拉流、云台）
- repository/ → 本地存储

#### main/vendors/
- hikvision/ → 海康实现（ISAPI）
- dahua/ → 大华实现（CGI）
- onvif/ → 通用 ONVIF 实现

#### main/stream/
- 流管理（RTSP / FLV / HLS / WebRTC）

### 3️⃣ preload/modules/camera.js

```js
export const cameraApi = {
  getStreamUrl: (cameraId) => ipcRenderer.invoke('camera:getStreamUrl', cameraId),
  movePtz: (cameraId, direction) => ipcRenderer.invoke('camera:movePtz', { cameraId, direction }),
  getStatus: (cameraId) => ipcRenderer.invoke('camera:getStatus', cameraId),
}
```

- 仅做 **ipcRenderer.invoke 封装**
- 提供给 renderer 调用

### 4️⃣ renderer/src/api/camera.api.js

```js
export const getStreamUrl = (cameraId) => window.api.camera.getStreamUrl(cameraId)
export const movePtz = (cameraId, direction) => window.api.camera.movePtz(cameraId, direction)
export const getStatus = (cameraId) => window.api.camera.getStatus(cameraId)
```

- renderer 调用 window.api.camera
- 完全不知道 main 内部实现

---
