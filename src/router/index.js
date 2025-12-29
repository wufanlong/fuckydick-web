import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
]

const router = createRouter({
  history: createWebHistory(), // history 模式
  routes
})

export default router
