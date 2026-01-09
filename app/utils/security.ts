export const sanitizeInput = (input: string): string => {
  return input.trim()
    .replace(/[<>"'&]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .slice(0, 1000) // Limit length
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 8 && password.length <= 128
}

export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://dashplanner.onrender.com'
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

export const getLoginEndpoint = (): string => {
  return `${getApiUrl()}${process.env.NEXT_PUBLIC_LOGIN_ENDPOINT || '/login'}`
}

export const getRegisterEndpoint = (): string => {
  return `${getApiUrl()}${process.env.NEXT_PUBLIC_REGISTER_ENDPOINT || '/register'}`
}

export const getStatsEndpoint = (): string => {
  return `${getApiUrl()}${process.env.NEXT_PUBLIC_STATS_ENDPOINT || '/conversas/stats'}`
}

export const getStatsMesEndpoint = (): string => {
  return `${getApiUrl()}${process.env.NEXT_PUBLIC_STATS_MES_ENDPOINT || '/conversas/stats-mes'}`
}

export const getDashAtendentesEndpoint = (): string => {
  return `${getApiUrl()}${process.env.NEXT_PUBLIC_DASH_ATENDENTES_ENDPOINT || '/conversas/dash-atendentes'}`
}

export const getConversasAllEndpoint = (): string => {
  return `${getApiUrl()}${process.env.NEXT_PUBLIC_CONVERSAS_ALL_ENDPOINT || '/conversas/all'}`
}

export const getConversasEndpoint = (): string => {
  return `${getApiUrl()}${process.env.NEXT_PUBLIC_CONVERSAS_ENDPOINT || '/conversas'}`
}