// import { getUserInformation } from '@/services/authService'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref(null)

    // async function fetchUser() {
    //   try {
    //     const userInfo = await getUserInformation()
    //     if (!userInfo) {
    //       throw new Error('User info is null')
    //     }
    //     user.value = userInfo
    //     return userInfo
    //   } catch (error) {
    //     console.error('Error fetching user:', error)
    //     user.value = null
    //     throw error
    //   }
    // }

    function setUser(newUser) {
      user.value = newUser
    }

    function clearUser() {
      user.value = null
    }

    return {
      user,
      // fetchUser,
      setUser,
      clearUser,
    }
  },
  {
    persist: {
      paths: ['user'],
    },
  },
)
