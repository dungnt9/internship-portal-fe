// src/services/companyContactService.js
import api from './apiService'

/**
 * Get all company contacts from the current user's company
 * @returns {Promise} API response
 */
export const getCompanyContacts = async () => {
  try {
    return await api.get('/user/companies/contacts')
  } catch (err) {
    console.error('Lỗi lấy danh sách liên hệ công ty:', err.message)
    throw err
  }
}

/**
 * Get specific company contact by ID
 * @param {number} contactId - Contact ID
 * @returns {Promise} API response
 */
export const getCompanyContactById = async (contactId) => {
  try {
    return await api.get(`/user/companies/contacts/${contactId}`)
  } catch (err) {
    console.error('Lỗi lấy thông tin liên hệ:', err.message)
    throw err
  }
}

/**
 * Create new company contact
 * @param {Object} contactData - Contact data
 * @param {string} contactData.name - Full name
 * @param {string} contactData.position - Job position
 * @param {string} contactData.email - Email address
 * @param {string} contactData.phone - Phone number
 * @param {string} contactData.password - Password
 * @returns {Promise} API response
 */
export const createCompanyContact = async (contactData) => {
  try {
    return await api.post('/user/companies/contacts', contactData)
  } catch (err) {
    console.error('Lỗi tạo liên hệ công ty:', err.message)
    throw err
  }
}

/**
 * Update company contact
 * @param {number} contactId - Contact ID
 * @param {Object} contactData - Updated contact data
 * @param {string} contactData.name - Full name
 * @param {string} contactData.position - Job position
 * @param {string} contactData.email - Email address (optional for update)
 * @param {string} contactData.phone - Phone number (optional for update)
 * @returns {Promise} API response
 */
export const updateCompanyContact = async (contactId, contactData) => {
  try {
    return await api.put(`/user/companies/contacts/${contactId}`, contactData)
  } catch (err) {
    console.error('Lỗi cập nhật liên hệ công ty:', err.message)
    throw err
  }
}

/**
 * Delete company contact (soft delete)
 * @param {number} contactId - Contact ID
 * @returns {Promise} API response
 */
export const deleteCompanyContact = async (contactId) => {
  try {
    return await api.delete(`/user/companies/contacts/${contactId}`)
  } catch (err) {
    console.error('Lỗi xóa liên hệ công ty:', err.message)
    throw err
  }
}
