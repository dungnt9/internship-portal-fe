import api from './apiService'

/**
 * Get all internships for company with evaluation status
 * @param {string} periodId - Optional period ID filter
 * @returns {Promise} API response
 */
export const getCompanyInternships = async (periodId) => {
  try {
    let url = '/evaluation/companies/internships'
    if (periodId) {
      url += `?periodId=${periodId}`
    }
    return await api.get(url)
  } catch (err) {
    console.error('Lỗi lấy danh sách thực tập:', err.message)
    throw err
  }
}

/**
 * Get detailed evaluation for a specific student
 * @param {number} progressId - Progress ID
 * @returns {Promise} API response
 */
export const getEvaluationDetail = async (progressId) => {
  try {
    return await api.get(`/evaluation/companies/evaluations/${progressId}`)
  } catch (err) {
    console.error('Lỗi lấy chi tiết đánh giá:', err.message)
    throw err
  }
}

/**
 * Update evaluation for a student
 * @param {number} progressId - Progress ID
 * @param {Object} evaluationData - Evaluation data
 * @returns {Promise} API response
 */
export const updateEvaluation = async (progressId, evaluationData) => {
  try {
    return await api.put(`/evaluation/companies/evaluations/${progressId}`, evaluationData)
  } catch (err) {
    console.error('Lỗi cập nhật đánh giá:', err.message)
    throw err
  }
}
