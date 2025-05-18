import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'trang-chu',
      component: () => import('../views/HomeView.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/dang-nhap',
      name: 'dang-nhap',
      component: () => import('../views/LoginView.vue'),
      meta: { layout: 'default', requiresGuest: true },
    },
    {
      path: '/dang-ky',
      name: 'dang-ky',
      component: () => import('../views/RegisterView.vue'),
      meta: { layout: 'default', requiresGuest: true },
    },
    {
      path: '/quen-mat-khau',
      name: 'quen-mat-khau',
      component: () => import('../views/ForgetPasswordView.vue'),
      meta: { layout: 'default', requiresGuest: true },
    },
    {
      path: '/doi-mat-khau',
      name: 'doi-mat-khau',
      component: () => import('../views/ChangePasswordView.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/thong-tin-ca-nhan',
      name: 'thong-tin-ca-nhan',
      component: () => import('../views/ProfileView.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/danh-sach-doanh-nghiep',
      name: 'danh-sach-doanh-nghiep',
      component: () => import('../views/CompanyListView.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/duyet-thuc-tap',
      name: 'duyet-thuc-tap',
      component: () => import('../views/ApproveCV.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/qua-trinh-thuc-tap-sv',
      name: 'qua-trinh-thuc-tap-sv',
      component: () => import('../views/InternshipProgress.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/xac-nhan-thuc-tap',
      name: 'xac-nhan-thuc-tap',
      component: () => import('../views/ConfirmInternship.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/thuc-tap-cua-toi',
      name: 'thuc-tap-cua-toi',
      component: () => import('../views/StudentInternshipProgressView.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/lich-su-duyet',
      name: 'lich-su-duyet',
      component: () => import('../views/ApplicationHistory.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/thong-tin-doanh-nghiep',
      name: 'thong-tin-doanh-nghiep',
      component: () => import('../views/CompanyDetailView.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/vi-tri-tuyen-dung',
      name: 'vi-tri-tuyen-dung',
      component: () => import('../views/PositionListView.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/dang-ky-nguyen-vong',
      name: 'dang-ky-nguyen-vong',
      component: () => import('../views/RegistrationView.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/dang-ky-thuc-tap-don-vi-chua-lien-ket',
      name: 'dang-ky-thuc-tap-don-vi-chua-lien-ket',
      component: () => import('../views/ExternalInternship.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/danh-gia',
      name: 'danh-gia',
      component: () => import('../views/EvaluationView.vue'),
      meta: { layout: 'default', requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = Cookies.get('token')

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      const authStore = useAuthStore()
      authStore.clearAuth()
      next({ name: 'dang-nhap' })
    } else {
      next()
    }
  } else if (to.matched.some((record) => record.meta.requiresGuest)) {
    if (token) {
      next({ name: 'trang-chu' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
