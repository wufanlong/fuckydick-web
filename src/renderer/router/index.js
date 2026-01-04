import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/Index.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/config',
    name: 'Config',
    component: () => import('../views/config/Config.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
