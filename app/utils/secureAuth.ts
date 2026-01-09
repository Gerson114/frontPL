// Utilitário de autenticação segura
export const secureAuth = {
  // Login seguro - salva token em httpOnly cookie
  async login(email: string, password: string) {
    const response = await fetch('/api/auth/secure-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return response
  },

  // Logout seguro - remove cookie
  async logout() {
    await fetch('/api/auth/secure-logout', { method: 'POST' })
    window.location.href = '/pages/login'
  },

  // Verificar autenticação
  async verify() {
    try {
      const response = await fetch('/api/auth/verify', { method: 'GET' })
      return response.ok
    } catch {
      return false
    }
  },

  // Headers para requisições autenticadas
  getHeaders() {
    return {
      'Content-Type': 'application/json'
    }
  }
}