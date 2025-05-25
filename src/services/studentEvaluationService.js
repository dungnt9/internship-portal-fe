// src/services/studentEvaluationService.js
import api from './apiService'

// Lấy báo cáo thực tập của sinh viên
export const getMyReport = async () => {
  try {
    return await api.get('/evaluation/students/my-report')
  } catch (err) {
    console.error('Lỗi lấy báo cáo thực tập:', err.message)
    throw err
  }
}

// Cập nhật báo cáo thực tập
export const updateMyReport = async (data, file) => {
  try {
    const formData = new FormData()

    if (data) {
      formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
    }

    if (file) {
      formData.append('file', file)
    }

    return await api.put('/evaluation/students/my-report', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  } catch (err) {
    console.error('Lỗi cập nhật báo cáo thực tập:', err.message)
    throw err
  }
}

// Lấy đánh giá từ công ty
export const getMyEvaluation = async () => {
  try {
    return await api.get('/evaluation/students/my-evaluation')
  } catch (err) {
    console.error('Lỗi lấy đánh giá từ công ty:', err.message)
    throw err
  }
}
