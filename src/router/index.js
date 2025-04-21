import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { layout: 'default' },
    },
    {
      path: '/dang-ky-thuc-tap',
      name: 'dang-ky-thuc-tap',
      component: () => import('../views/Registration.vue'),
      meta: { layout: 'default' },
    },
    {
      path: '/danh-gia',
      name: 'danh-gia',
      component: () => import('../views/Evaluation.vue'),
      meta: { layout: 'default' },
    },
  ],
})

export default router
