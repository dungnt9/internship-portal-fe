import api from '@/services/apiService.js'

export const getPositionOfCompany = async (id) => {
  try {
    return await api.post(`/registration/positions/company/${id}`)
  } catch (err) {
    console.error('Lỗi lấy vị trí công ty:', err.message)
    throw err
  }
}

export const getCurrentPeriod = async () => {
  try {
    return await api.get('/registration/period/current')
  } catch (err) {
    console.error('Lỗi lấy kỳ hiện tại:', err.message)
    throw err
  }
}
