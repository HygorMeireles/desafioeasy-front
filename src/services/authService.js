import axios from 'axios'
import router from '@/router'

const TOKEN_KEY = 'authToken'

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
let authenticated = !!localStorage.getItem(TOKEN_KEY)

export function isLoggedIn() {
  return authenticated
}

export async function login(login, password) {
  try {
    const response = await axios.post('http://localhost:3001/login', { user: { login, password } })

    const authToken = response.data.authentication_token

    localStorage.setItem(TOKEN_KEY, authToken)

    authenticated = true

    router.push({ name: 'dashboard' })

    return response.data
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}

export async function logout() {
  try {
    const token = getToken()

    await axios.delete('http://localhost:3001/logout', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    localStorage.removeItem(TOKEN_KEY)
    authenticated = false
    router.push({ name: 'login' })
  }
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
