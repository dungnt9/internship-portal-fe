import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiLogin } from '@/services/userService'
import Cookies from 'js-cookie'
import router from '@/router'
import { useUserStore } from './userStore'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref(null)

    const isAuthenticated = computed(() => {
      return Boolean(token.value) && token.value !== 'null' && token.value !== 'undefined'
    })

    const clearAuth = () => {
      token.value = null
      Cookies.remove('token')
      Cookies.remove('isAuthenticated')
    }

    const setToken = (value) => {
      if (value && value !== 'null' && value !== 'undefined') {
        token.value = value
      }
    }

    const login = async (payload) => {
      try {
        const response = await apiLogin(payload)
        console.log('Login response:', response.data.accessToken)
        setToken(response.data.accessToken)
        // const userStore = useUserStore()
        // await userStore.fetchUser(true)
      } catch (error) {
        console.error('Error logging in:', error)
        throw error
      }
    }

    const logout = () => {
      clearAuth()
      const userStore = useUserStore()
      userStore.clearUser()
      router.push('/dang-nhap')
    }

    return {
      token,
      isAuthenticated,
      setToken,
      login,
      logout,
      clearAuth,
    }
  },
  {
    persist: true,
  },
)
