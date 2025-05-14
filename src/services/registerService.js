import api from './apiService'

export const getPositionOfCompany = async (id) => {
  try {
    return await api.get(`/registration/positions/company/${id}`)
  } catch (err) {
    console.error('Lỗi lấy vị trí công ty:', err.message)
    throw err
  }
}

export const getCurrentPeriod = async () => {
  try {
    return await api.get('/registration/periods/current')
  } catch (err) {
    console.error('Lỗi lấy kỳ hiện tại:', err.message)
    throw err
  }
}

export const getListPosition = async () => {
  try {
    return await api.get('/registration/company-positions')
  } catch (err) {
    console.error('Lỗi:', err.message)
    throw err
  }
}

export const createPosition = async (positionData) => {
  try {
    return await api.post('/registration/company-positions', positionData)
  } catch (err) {
    console.error('Lỗi tạo vị trí mới:', err.message)
    throw err
  }
}

export const updatePosition = async (id, positionData) => {
  try {
    return await api.put(`/registration/company-positions/${id}`, positionData)
  } catch (err) {
    console.error('Lỗi cập nhật vị trí:', err.message)
    throw err
  }
}
