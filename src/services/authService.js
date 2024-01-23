import axios from 'axios'
import router from '@/router'

let authenticated = false

export function isLoggedIn() {
  return authenticated
}

export async function login(login, password) {
  try {
    const response = await axios.post('http://localhost:3001/login', { user: { login, password } })
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
    await axios.delete('http://localhost:3001/logout')
    authenticated = false
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Logout failed:', error)
    throw error
  }
}
