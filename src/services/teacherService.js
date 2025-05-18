import api from './apiService'

export const getTeacherProgress = async (periodId, status) => {
  try {
    let url = '/registration/teacher-progress'
    const params = new URLSearchParams()

    if (periodId) {
      params.append('periodId', periodId)
    }

    if (status) {
      params.append('status', status)
    }

    const queryString = params.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    return await api.get(url)
  } catch (err) {
    console.error('Lỗi lấy dữ liệu thực tập sinh viên:', err.message)
    throw err
  }
}

export const getProgressDetail = async (progressId) => {
  try {
    return await api.get(`/registration/teacher-progress/${progressId}`)
  } catch (err) {
    console.error('Lỗi lấy chi tiết thực tập:', err.message)
    throw err
  }
}

export const confirmProgress = async (progressId, confirm = true) => {
  try {
    return await api.put(`/registration/teacher-progress/${progressId}/confirm`, { confirm })
  } catch (err) {
    console.error('Lỗi xác nhận thực tập:', err.message)
    throw err
  }
}

export const getAllPeriods = async () => {
  try {
    return await api.get('/registration/periods')
  } catch (err) {
    console.error('Lỗi lấy danh sách kỳ thực tập:', err.message)
    throw err
  }
}
