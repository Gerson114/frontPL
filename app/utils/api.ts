export const getApiUrl = () => {
  // Se estiver na Netlify, usar Netlify Functions
  if (typeof window !== 'undefined' && window.location.hostname.includes('netlify.app')) {
    return '/.netlify/functions/proxy'
  }
  // Caso contrário, usar Next.js API Routes (localhost)
  return '/api/proxy'
}

export const makeApiCall = async (method: 'GET' | 'POST', params: any) => {
  const apiUrl = getApiUrl()
  
  if (method === 'GET') {
    const queryParams = new URLSearchParams(params).toString()
    return fetch(`${apiUrl}?${queryParams}`)
  }
  
  return fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
}