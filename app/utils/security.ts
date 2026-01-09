export const sanitizeInput = (input: string): string => {
  return input.trim()
    .replace(/[<>"'&]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .slice(0, 1000)
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 8 && password.length <= 128
}

export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || '/api/backend'
}

export const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })
}