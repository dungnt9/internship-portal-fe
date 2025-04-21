import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiLogin } from '@/services/authService'
import Cookies from 'js-cookie'
import router from '@/router'
import { useUserStore } from './userStore'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref(null)

    const initializeAuth = async () => {
      const cookieToken = Cookies.get('token')

      // Chỉ set token nếu nó tồn tại và hợp lệ
      if (cookieToken && cookieToken !== 'null' && cookieToken !== 'undefined') {
        token.value = cookieToken
        // Sync user data ngay khi có token hợp lệ
        try {
          const userStore = useUserStore()
          await userStore.fetchUser(true)
        } catch (error) {
          console.error('Failed to sync user data:', error)
          clearAuth()
        }
      } else {
        // Clear nếu token không hợp lệ
        clearAuth()
        const userStore = useUserStore()
        userStore.clearUser()
      }
    }

    const isAuthenticated = computed(() => {
      return Boolean(token.value) && token.value !== 'null' && token.value !== 'undefined'
    })

    const clearAuth = () => {
      token.value = null
      // Xóa tất cả cookies liên quan
      Cookies.remove('token', { path: '/' })
      Cookies.remove('isAuthenticated', { path: '/' })
    }

    const setToken = (value) => {
      if (value && value !== 'null' && value !== 'undefined') {
        token.value = value
        // Set cookie với path và expiry rõ ràng
        Cookies.set('token', value, {
          expires: 365,
          path: '/',
        })
      } else {
        clearAuth()
      }
    }

    const login = async (params) => {
      try {
        const response = await apiLogin(params)
        setToken(response.accessToken)
        // Fetch user data sau khi login thành công
        const userStore = useUserStore()
        await userStore.fetchUser(true)
      } catch (error) {
        console.error('Error logging in:', error)
        throw error
      }
    }

    const logout = () => {
      clearAuth()
      setToken(null)
      const userStore = useUserStore()
      userStore.clearUser()
      Cookies.remove('isAuthenticated')
      Cookies.remove('token') // Thêm dòng này\
      router.push('/dang-nhap')
    }

    return {
      isAuthenticated,
      token,
      setToken,
      login,
      logout,
      clearAuth,
      initializeAuth,
    }
  },
  {
    persist: true,
  },
)
