import api from './apiService'

// Lấy thông tin thực tập hiện tại của sinh viên
export const getCurrentProgress = async () => {
  try {
    return await api.get('/registration/student-progress/current')
  } catch (err) {
    console.error('Lỗi lấy thông tin thực tập:', err.message)
    throw err
  }
}

// Cập nhật thông tin thực tập
export const updateProgress = async (updateData) => {
  try {
    return await api.put('/registration/student-progress/current', updateData)
  } catch (err) {
    console.error('Lỗi cập nhật thông tin thực tập:', err.message)
    throw err
  }
}
