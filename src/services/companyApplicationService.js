// services/companyApplicationService.js
import api from './apiService'

// API lấy danh sách đơn đăng ký đang chờ duyệt
export const getPendingApplications = async () => {
  try {
    return await api.get('/registration/company-applications/pending')
  } catch (err) {
    console.error('Lỗi lấy danh sách đơn đăng ký chờ duyệt:', err.message)
    throw err
  }
}

// API duyệt/từ chối đơn đăng ký
export const takeActionOnApplication = async (applicationDetailId, action) => {
  try {
    return await api.put('/registration/company-applications/action', {
      applicationDetailId,
      action, // "APPROVE" hoặc "REJECT"
    })
  } catch (err) {
    console.error('Lỗi xử lý đơn đăng ký:', err.message)
    throw err
  }
}

// API lấy lịch sử đơn đăng ký
export const getApplicationsHistory = async (periodId, status) => {
  try {
    let url = '/registration/company-applications/history'
    let params = []

    if (periodId) params.push(`periodId=${periodId}`)
    if (status) params.push(`status=${status}`)

    if (params.length > 0) {
      url += '?' + params.join('&')
    }

    return await api.get(url)
  } catch (err) {
    console.error('Lỗi lấy lịch sử đơn đăng ký:', err.message)
    throw err
  }
}

// API lấy danh sách kỳ thực tập
export const getAllPeriods = async () => {
  try {
    return await api.get('/registration/periods')
  } catch (err) {
    console.error('Lỗi lấy danh sách kỳ thực tập:', err.message)
    throw err
  }
}
