
import { defineStore } from 'pinia'
import { api } from '@/utils/axios'

export const useAuthStore = defineStore('auth', () => {

  const token = ref<string | null>(null)
  const user = ref<any>(null)

  const isLoggedIn = computed(() => !!token.value)

  // Initialisation automatique du token depuis localStorage
  if (process.client) {
    const savedToken = localStorage.getItem('token')
    if (savedToken && savedToken !== 'null' && savedToken !== 'undefined') {
      token.value = savedToken
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/login', { email, password })
      token.value = res.data.token || null
      user.value = res.data.user || null
      localStorage.setItem('token', token.value!)
    } catch (err) {
      console.error('Login failed:', err)
      throw err
    }
  }

  const logout = async () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, isLoggedIn, login, logout }
})
