import api from './apiService'

export const getInfoStudent = async (payload) => {
  try {
    return await api.get('/user/students/me', payload)
  } catch (err) {
    console.error('Lỗi lấy thông tin sinh viên:', err.message)
    throw err
  }
}

export const putInfoStudent = async (payload) => {
  try {
    return await api.put('/user/students/me', payload)
  } catch (err) {
    console.error('Lỗi cập nhật thông tin sinh viên:', err.message)
    throw err
  }
}

export const getInfoTeacher = async (payload) => {
  try {
    return await api.get('/user/teachers/me', payload)
  } catch (err) {
    console.error('Lỗi lấy thông tin giảng viên:', err.message)
    throw err
  }
}

export const putInfoTeacher = async (payload) => {
  try {
    return await api.put('/user/teachers/me', payload)
  } catch (err) {
    console.error('Lỗi cập nhật thông tin giảng viên:', err.message)
    throw err
  }
}

export const getInfoCompanyContact = async (payload) => {
  try {
    return await api.get('/user/companies/me', payload)
  } catch (err) {
    console.error('Lỗi lấy thông tin company contact:', err.message)
    throw err
  }
}

export const putInfoCompanyContact = async (payload) => {
  try {
    return await api.put('/user/companies/me', payload)
  } catch (err) {
    console.error('Lỗi cập nhật thông tin company contact:', err.message)
    throw err
  }
}

export const getInfoMyCompany = async (payload) => {
  try {
    return await api.get('/user/companies/my', payload)
  } catch (err) {
    console.error('Lỗi lấy thông tin công ty của tôi:', err.message)
    throw err
  }
}

export const putInfoMyCompany = async (payload) => {
  try {
    return await api.put('/user/companies/my', payload)
  } catch (err) {
    console.error('Lỗi cập nhật thông tin công ty của tôi:', err.message)
    throw err
  }
}

export const getAllCompany = async (payload) => {
  try {
    return await api.get('/user/companies/all', payload)
  } catch (err) {
    console.error('Lỗi lấy danh sách công ty:', err.message)
    throw err
  }
}

export const getInfoCompanyById = async (payload) => {
  try {
    return await api.get(`/user/companies/${payload}`)
  } catch (err) {
    console.error('Lỗi lấy thông tin công ty:', err.message)
    throw err
  }
}
