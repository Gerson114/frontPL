import { useState, useEffect } from 'react'

export const useRealTime = (fetchFunction, interval = 30000, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchData = async () => {
    try {
      setError(null)
      const result = await fetchFunction()
      setData(result)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err.message)
      console.error('Erro ao buscar dados:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchData()
    const intervalId = setInterval(fetchData, interval)
    return () => clearInterval(intervalId)
  }, [interval, ...dependencies])

  return { data, loading, error, lastUpdate, refetch: fetchData }
}

export const useAuth = () => {
  const checkAuth = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/auth/verify`, {
        method: 'GET',
        credentials: 'include'
      })
      return response.ok
    } catch {
      return false
    }
  }

  const getHeaders = () => {
    return {
      'Content-Type': 'application/json'
    }
  }

  const logout = async () => {
    try {
      await fetch(`${getApiUrl()}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Erro no logout:', error)
    }
    window.location.href = '/pages/login'
  }

  return { checkAuth, getHeaders, logout }
}