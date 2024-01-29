import axios from 'axios'
import router from './router'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
})

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      router.push({ name: 'erro' })
    }
    return Promise.reject(error)
  },
)
export default axiosInstance
