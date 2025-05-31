import axios from 'axios'
import Cookies from 'js-cookie'

const evaluationFileApi = axios.create({
  baseURL: 'http://localhost:8004', // Evaluation service port
})

// Add authorization header for file requests
evaluationFileApi.interceptors.request.use(
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

// View file in browser for evaluation service
export const viewEvaluationFile = (filePath) => {
  try {
    return `${evaluationFileApi.defaults.baseURL}/files/view?path=${encodeURIComponent(filePath)}`
  } catch (err) {
    console.error('Error creating evaluation file view URL:', err)
    throw err
  }
}
