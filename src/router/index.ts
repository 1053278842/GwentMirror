import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DeckSearchView from '../views/DeckSearchView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/mirrordeck'
    },
    {
      path: '/mirrordeck',
      name: 'mirrordeck',
      component: DeckSearchView
    },
  ]
})

export default router
