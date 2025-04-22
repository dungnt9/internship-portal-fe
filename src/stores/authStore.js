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

    const clearAuth = () => {
      token.value = null
      Cookies.remove('token')
    }

    const setToken = (value) => {
      if (value && value !== 'null' && value !== 'undefined') {
        token.value = value
        Cookies.set('token', value)
      } else {
        clearAuth()
      }
    }

    const login = async (payload) => {
      try {
        const response = await apiLogin(payload)
        console.log('Login response:', response.data)
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
