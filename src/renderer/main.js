import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light'
  }
})
console.log('Renderer process started')
createApp(App).use(vuetify).use(router).mount('#app')
