<template>
  <v-sheet border rounded>
    <v-data-table items-per-page="-1" items-per-page-text="" hover striped="even" :headers="headers" density="compact" hide-default-footer
      :hide-default-footer="recorders.length < 11" :items="recorders">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            录像机配置
          </v-toolbar-title>

          <v-btn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="新增" border @click="add"></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon color="medium-emphasis" icon="mdi-content-copy" size="small" @click="copy(item.id)"></v-icon>
          <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="edit(item.id)"></v-icon>
          <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="remove(item.id)"></v-icon>
        </div>
      </template>

    </v-data-table>
  </v-sheet>

  <v-dialog v-model="dialog" max-width="500">
    <v-card :title="`${isEditing ? '修改' : '新增'}录像机`"
      :subtitle="`${isEditing ? '修改' : '新增'}${isEditing ? formModel.deviceName : '录像机'}`">
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="formModel.deviceName" label="设备名称"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="formModel.school" label="学校"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="formModel.ip" label="IP地址"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="formModel.password" label="密码"></v-text-field>
          </v-col>
        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="取消" variant="plain" @click="dialog = false"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="保存" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts" name="RecordersConfig">
import { shallowRef } from 'vue'


function createNewRecord() {
  return { id: null, deviceName: null, school: null, ip: null, password: null }
}

const recorders = ref([])
const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const isEditing = ref(false)

const headers = [
  // { title: 'id', key: 'id' },
  { title: '设备名称', key: 'deviceName' },
  { title: '位置', key: 'school' },
  { title: 'IP地址', key: 'ip' },
  { title: '密码', key: 'password' },
  { title: '操作', key: 'actions', align: 'end', sortable: false },
]

onMounted(() => {
  init()
})

function copy(id) {
  isEditing.value = false
  const found = recorders.value.find(recorder => recorder.id === id)
  formModel.value = createNewRecord()
  Object.assign(formModel.value, found)
  formModel.value.id = Date.now()

  window.system.config.writeRecorderConfig(JSON.stringify(recorders.value))
  save()
}
function add() {
  isEditing.value = false
  formModel.value = createNewRecord()
  dialog.value = true
}

function edit(id) {
  isEditing.value = true
  const found = recorders.value.find(recorder => recorder.id === id)

  formModel.value = {
    id: found.id,
    deviceName: found.deviceName,
    school: found.school,
    ip: found.ip,
    password: found.password,
  }

  dialog.value = true
}

function remove(id) {
  const index = recorders.value.findIndex(recorder => recorder.id === id)
  recorders.value.splice(index, 1)
  window.system.config.writeRecorderConfig(JSON.stringify(recorders.value))
}

function save() {
  if (isEditing.value) {
    const index = recorders.value.findIndex(recorder => recorder.id === formModel.value.id)
    recorders.value[index] = formModel.value
  } else {
    formModel.value.id = Date.now()
    recorders.value.push(formModel.value)
  }
  window.system.config.writeRecorderConfig(JSON.stringify(recorders.value))

  dialog.value = false
}

async function init() {
  
  dialog.value = false
  formModel.value = createNewRecord()
  recorders.value.push(...JSON.parse(await window.system.config.readRecorderConfig()))
}
</script>