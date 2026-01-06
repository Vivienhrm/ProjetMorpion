import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Profile from '@/views/Profile.vue'
import Game from '@/views/Game.vue'
import Join from '@/views/Join.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/games/:id',
      name: 'Game',
      component: Game
    },
    {
      path: '/join',
      name: 'Join',
      component: Join
    }
  ]
})

export default router
