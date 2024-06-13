import axios from 'axios'
import router from './router'

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      router.push({ name: 'erro' })
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
