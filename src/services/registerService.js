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

export const getUpcomingPeriod = async () => {
  try {
    return await api.get('/registration/periods/upcoming')
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

// External Internship APIs
export const getExternalInternships = async () => {
  try {
    return await api.get('/registration/external-internships/me')
  } catch (err) {
    console.error('Lỗi lấy thông tin thực tập ngoài trường:', err.message)
    throw err
  }
}

export const createExternalInternship = async (formData) => {
  try {
    return await api.post('/registration/external-internships', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  } catch (err) {
    console.error('Lỗi tạo thông tin thực tập ngoài trường:', err.message)
    throw err
  }
}

export const getMyApplications = async () => {
  try {
    return await api.get('/registration/applications/me')
  } catch (err) {
    console.error('Lỗi lấy thông tin đăng ký thực tập:', err.message)
    throw err
  }
}

// API để tải lên CV
export const uploadCV = async (formData) => {
  try {
    return await api.post('/registration/applications/upload-cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  } catch (err) {
    console.error('Lỗi tải lên CV:', err.message)
    throw err
  }
}

// API để đăng ký 3 nguyện vọng thực tập
export const registerPreferences = async (preferencesData) => {
  try {
    return await api.post('/registration/applications/register-preferences', preferencesData)
  } catch (err) {
    console.error('Lỗi đăng ký nguyện vọng thực tập:', err.message)
    throw err
  }
}

export const getCompanyProgress = async (periodId) => {
  try {
    let url = '/registration/company-progress'
    if (periodId) {
      url += `?periodId=${periodId}`
    }
    return await api.get(url)
  } catch (err) {
    console.error('Lỗi lấy dữ liệu quá trình thực tập:', err.message)
    throw err
  }
}
