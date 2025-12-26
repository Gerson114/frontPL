import { getApiUrl } from '../utils/security'

class ApiService {
  private baseURL = getApiUrl()
  
  private getHeaders() {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: { ...this.getHeaders(), ...options.headers }
    })

    if (response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/pages/login'
      throw new Error('Unauthorized')
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Auth
  async login(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    if (!response.ok) throw new Error('Login failed')
    
    const data = await response.json()
    localStorage.setItem('token', data.token)
    return data
  }

  async register(name: string, email: string, password: string) {
    const response = await fetch(`${this.baseURL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    
    if (!response.ok) throw new Error('Registration failed')
    return response.json()
  }

  // Dashboard data
  async getStats() {
    return this.request('/conversas/stats')
  }

  async getStatsData(data?: string) {
    const params = data ? `?data=${data}` : ''
    return this.request(`/conversas/stats-data${params}`)
  }

  async getStatsMes(mes?: string) {
    const params = mes ? `?mes=${mes}` : ''
    return this.request(`/conversas/stats-mes${params}`)
  }

  async getDashAtendentes(data?: string) {
    const params = data ? `?data=${data}` : ''
    return this.request(`/conversas/dash-atendentes${params}`)
  }

  async getConversas() {
    return this.request('/conversas/all')
  }

  async getMensagens() {
    return this.request('/mensagens')
  }
}

export const apiService = new ApiService()