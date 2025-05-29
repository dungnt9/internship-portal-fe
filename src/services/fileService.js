import axios from 'axios'
import Cookies from 'js-cookie'

const fileApi = axios.create({
  baseURL: 'http://localhost:8003', // Direct to registration service
})

// Add authorization header for file requests
fileApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// View file in browser
export const viewFile = (filePath) => {
  try {
    return `${fileApi.defaults.baseURL}/files/view?path=${encodeURIComponent(filePath)}`
  } catch (err) {
    console.error('Error creating file view URL:', err)
    throw err
  }
}

// Download file
export const downloadFile = (filePath) => {
  try {
    return `${fileApi.defaults.baseURL}/files/download?path=${encodeURIComponent(filePath)}`
  } catch (err) {
    console.error('Error creating file download URL:', err)
    throw err
  }
}

// Get file info
export const getFileInfo = async (filePath) => {
  try {
    const response = await fileApi.get(`/files/info?path=${encodeURIComponent(filePath)}`)
    return response.data
  } catch (err) {
    console.error('Error getting file info:', err)
    throw err
  }
}

export default fileApi
