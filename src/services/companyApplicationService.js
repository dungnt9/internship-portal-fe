import api from './apiService'

// Function to get all periods
export const getAllPeriods = async () => {
  try {
    return await api.get('/registration/periods')
  } catch (err) {
    console.error('Lỗi lấy danh sách kỳ thực tập:', err.message)
    throw err
  }
}

// Function to get all company applications
export const getAllApplications = async (status) => {
  try {
    let url = '/registration/company-applications/history'
    if (status) {
      url += `?status=${status}`
    }
    return await api.get(url)
  } catch (err) {
    console.error('Lỗi lấy danh sách đơn đăng ký:', err.message)
    throw err
  }
}

// Function to get pending applications
export const getPendingApplications = async () => {
  try {
    return await api.get('/registration/company-applications/pending')
  } catch (err) {
    console.error('Lỗi lấy danh sách đơn đăng ký chờ duyệt:', err.message)
    throw err
  }
}

// Function to take action on an application
export const takeActionOnApplication = async (applicationDetailId, action) => {
  try {
    return await api.put('/registration/company-applications/action', {
      applicationDetailId,
      action,
    })
  } catch (err) {
    console.error('Lỗi xử lý đơn đăng ký:', err.message)
    throw err
  }
}
