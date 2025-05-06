import api from './apiService'

export const apiLogin = async (payload) => {
  try {
    return await api.post('/auth/login', payload)
  } catch (err) {
    console.error('Lỗi đăng nhập:', err.message)
    throw err
  }
}

export const forgotPassword = async (payload) => {
  try {
    return await api.post('/auth/forgot-password', payload)
  } catch (err) {
    console.error('Lỗi quên mật khẩu:', err.message)
  }
}
