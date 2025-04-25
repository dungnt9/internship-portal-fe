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

    //Vì là
    const isAuthenticated = computed(() => {
      return Boolean(token.value) && token.value !== 'null' && token.value !== 'undefined'
    })

    const clearAuth = () => {
      Cookies.remove('token')
    }

    const login = async (payload) => {
      try {
        const response = await apiLogin(payload)
        token.value = response.data.accessToken
        Cookies.set('token', response.data.accessToken)
        // const userStore = useUserStore()
        // await userStore.fetchUser(true)
      } catch (error) {
        console.error('Error logging in:', error)
        throw error
      }
    }

    const logout = () => {
      clearAuth()
      localStorage.removeItem('auth')
      // const userStore = useUserStore()
      // userStore.clearUser()
      router.push('/dang-nhap')
    }

    return {
      token,
      isAuthenticated,
      login,
      logout,
      clearAuth,
    }
  },
  {
    persist: true,
  },
)
