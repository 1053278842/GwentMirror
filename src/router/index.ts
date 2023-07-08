import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/mirrordeck'
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/mirrordeck',
      name: 'mirrordeck',
      component: () => import('../views/DeckSearchView.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/手写固定高虚拟列表论文用.vue')
    }
  ]
})

export default router
