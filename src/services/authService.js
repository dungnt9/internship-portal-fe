import api from './apiService'

export const apiLogin = async (payload) => {
  try {
    return await api.post('/auth/login', payload)
  } catch (err) {
    console.error('Lỗi đăng nhập:', err.message)
  }
}

// export const
