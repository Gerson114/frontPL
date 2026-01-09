"use client"
import { useState, useEffect } from "react"
import { Sidebar } from "../components/Sidebar"
import { TutorialModal } from "../components/TutorialModal"

interface StatsData {
  novas_conversas?: number
  pendentes_anteriores?: number
  total_concluidos?: number
  total_em_andamento?: number
  total_pendentes?: number
  grafico_horas?: Array<{ hora: number; total: number }>
}

interface StatsMes {
  novas_conversas?: number
  pendentes_anteriores?: number
  total_concluidos?: number
  total_em_andamento?: number
  total_pendentes?: number
  grafico_dias?: Array<{ dia: number; total: number }>
}

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toISOString().split('T')[0]
  })
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7))
  const [tutorialOpen, setTutorialOpen] = useState(false)
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [statsMes, setStatsMes] = useState<StatsMes | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Verificar autenticação
  useEffect(() => {
    // Não precisa verificar token no localStorage pois agora usa httpOnly cookies
    // A autenticação será verificada automaticamente nas requisições
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/proxy?path=/conversas/stats&query=data=${selectedDate}`)

      if (response.ok) {
        const data = await response.json()
        setStatsData(data)
        setLastUpdate(new Date())
      } else if (response.status === 401) {
        window.location.href = '/pages/login'
      } else {
        setStatsData(null)
      }
    } catch (error) {
      setStatsData(null)
    }
  }

  const fetchMonthlyData = async () => {
    try {
      const response = await fetch(`/api/proxy?path=/conversas/stats-mes&query=mes=${selectedMonth}`)

      if (response.ok) {
        const data = await response.json()
        setStatsMes(data)
      } else if (response.status === 401) {
        window.location.href = '/pages/login'
      } else {
        setStatsMes(null)
      }
    } catch (error) {
      setStatsMes(null)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchData(), fetchMonthlyData()])
      setLoading(false)
    }
    loadData()

    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [selectedDate, selectedMonth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando métricas em tempo real...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Desktop Sidebar */}
      <div className="hidden sm:block fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl">
        <Sidebar currentPage="dashboard" />
      </div>
      
      {/* Mobile Header */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-50">
        <Sidebar currentPage="dashboard" />
      </div>

      <div className="sm:ml-64">
        <div className="fixed top-16 sm:top-0 left-0 sm:left-64 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100">
          <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Dashboard Completo</h2>
                  <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Dados diários e mensais em tempo real</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                  <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2 w-full sm:w-auto">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <label className="text-xs font-medium text-gray-600">Dia:</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      max={(() => {
                        const yesterday = new Date()
                        yesterday.setDate(yesterday.getDate() - 1)
                        return yesterday.toISOString().split('T')[0]
                      })()}
                      className="px-2 sm:px-3 py-1 sm:py-2 border-0 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer text-gray-900 font-medium flex-1 sm:flex-none"
                      style={{
                        colorScheme: 'light',
                        WebkitAppearance: 'none',
                        MozAppearance: 'textfield'
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2 w-full sm:w-auto">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <label className="text-xs font-medium text-gray-600">Mês:</label>
                    <input
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="px-2 sm:px-3 py-1 sm:py-2 border-0 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer text-gray-900 font-medium flex-1 sm:flex-none"
                      style={{
                        colorScheme: 'light',
                        WebkitAppearance: 'none',
                        MozAppearance: 'textfield'
                      }}
                    />
                  </div>
                </div>
                
                <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
                
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Online</span>
                  </div>
                  
                  <button
                    onClick={() => setTutorialOpen(true)}
                    className="flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md flex-1 sm:flex-none"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs sm:text-sm">Tutorial</span>
                  </button>
                  
                  <button
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' })
                      window.location.href = '/pages/login'
                    }}
                    className="flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md flex-1 sm:flex-none"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-xs sm:text-sm">Sair</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-32 sm:pt-20 p-4 sm:p-6">
          {lastUpdate && (
            <div className="mb-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-800">Última atualização: {lastUpdate.toLocaleTimeString()}</span>
              </div>
              <div className="text-xs text-blue-600">Atualizando a cada 30s</div>
            </div>
          )}

          {/* Seção Dados Diários */}
          <div className="mb-8 pt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-3">Dados Diários</span>
              {selectedDate}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Novas Conversas</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">{statsData?.novas_conversas || 0}</p>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center ml-3">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Pendentes Anteriores</p>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{statsData?.pendentes_anteriores || 0}</p>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center ml-3">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Concluídos</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">{statsData?.total_concluidos || 0}</p>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center ml-3">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Em Andamento</p>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-600">{statsData?.total_em_andamento || 0}</p>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center ml-3">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Conversas</p>
                    <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{(statsData?.novas_conversas || 0) + (statsData?.total_concluidos || 0) + (statsData?.total_em_andamento || 0)}</p>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center ml-3">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Pendentes</p>
                    <p className="text-2xl sm:text-3xl font-bold text-red-600">{statsData?.total_pendentes || 0}</p>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center ml-3">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 mb-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl font-bold text-gray-900">Conversas por Hora - Diário</h4>
                {statsData?.grafico_horas && (() => {
                  const maxValue = Math.max(...(statsData.grafico_horas?.map((h: any) => h.total) || [0]))
                  const peakHour = statsData.grafico_horas?.find((h: any) => h.total === maxValue)?.hora
                  return (
                    <div className="hidden sm:flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="font-bold">{peakHour}h</span>
                        <span className="text-blue-100 text-sm">pico</span>
                      </div>
                    </div>
                  )
                })()}
              </div>
              
              {/* Mobile Layout */}
              <div className="sm:hidden">
                <div className="grid grid-cols-6 gap-1 mb-4">
                  {statsData?.grafico_horas && statsData.grafico_horas.length > 0 ? (
                    Array.from({length: 24}, (_, i) => {
                      const hourData = statsData.grafico_horas?.find((item: any) => item.hora === i)
                      const total = hourData?.total || 0
                      const maxTotal = Math.max(...(statsData.grafico_horas?.map((h: any) => h.total) || [1]))
                      const intensity = maxTotal > 0 ? (total / maxTotal) : 0
                      
                      return (
                        <div key={i} className="flex flex-col items-center">
                          <div 
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                              total > 0 
                                ? 'text-white' 
                                : 'bg-gray-100 text-gray-400'
                            }`}
                            style={{
                              backgroundColor: total > 0 ? `rgba(59, 130, 246, ${0.3 + intensity * 0.7})` : '#f3f4f6'
                            }}
                          >
                            {total > 0 ? total : ''}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{i}h</div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="col-span-6 flex items-center justify-center py-8 text-gray-500 text-sm">
                      Nenhum dado disponível
                    </div>
                  )}
                </div>
                
                {/* Mobile Summary */}
                {statsData?.grafico_horas && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Pico:</span>
                        <span className="font-bold text-blue-600 ml-1">
                          {Math.max(...(statsData.grafico_horas?.map((h: any) => h.total) || [0]))}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total:</span>
                        <span className="font-bold text-blue-600 ml-1">
                          {statsData.grafico_horas?.reduce((sum: number, h: any) => sum + h.total, 0) || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Desktop Layout */}
              <div className="hidden sm:block">
                <div className="relative min-h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-end justify-between space-x-2" style={{ minHeight: '288px', paddingTop: '40px' }}>
                      {statsData?.grafico_horas && statsData.grafico_horas.length > 0 ? (
                        Array.from({length: 24}, (_, i) => {
                          const hourData = statsData.grafico_horas?.find((item: any) => item.hora === i)
                          const total = hourData?.total || 0
                          const maxTotal = Math.max(...(statsData.grafico_horas?.map((h: any) => h.total) || [1]))
                          const height = maxTotal > 0 ? (total / maxTotal) * 200 : 0
                          
                          return (
                            <div key={i} className="flex flex-col items-center flex-1 group">
                              <div className="relative mb-2">
                                {total > 0 && (
                                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                                    {total} conversas
                                  </div>
                                )}
                                <div className="text-xs font-bold text-blue-700 mb-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm border border-blue-200 whitespace-nowrap">
                                  {total > 0 ? total : ''}
                                </div>
                              </div>
                              <div className="relative w-full">
                                <div 
                                  className="w-full bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 rounded-t-lg shadow-lg transition-all duration-700 ease-out group-hover:from-blue-700 group-hover:via-blue-600 group-hover:to-blue-500 group-hover:shadow-xl"
                                  style={{ 
                                    height: `${height}px`, 
                                    minHeight: total > 0 ? '8px' : '3px',
                                    boxShadow: total > 0 ? '0 4px 20px rgba(59, 130, 246, 0.3)' : 'none'
                                  }}
                                >
                                  {total > 0 && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 rounded-t-lg"></div>
                                  )}
                                </div>
                                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-200 rounded-b-lg"></div>
                              </div>
                              <div className="text-xs text-gray-600 mt-2 font-semibold bg-gray-50 px-2 py-1 rounded-md">{i}h</div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-500">
                          <p>Nenhum dado de gráfico disponível</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Grid lines */}
                    <div className="absolute inset-6 pointer-events-none">
                      {[0, 25, 50, 75, 100].map((percent) => (
                        <div 
                          key={percent}
                          className="absolute left-0 right-0 border-t border-gray-300/30"
                          style={{ bottom: `${(percent / 100) * 200 + 32}px` }}
                        >
                          <span className="absolute -left-8 -top-2 text-xs text-gray-500">
                            {Math.round((percent / 100) * (Math.max(...(statsData?.grafico_horas?.map((h: any) => h.total) || [0]))))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção Dados Mensais */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mr-3">Dados Mensais</span>
              {selectedMonth}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Novas Conversas (Mês)</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">{statsMes?.novas_conversas || 0}</p>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center ml-3">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Pendentes Anteriores (Mês)</p>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{statsMes?.pendentes_anteriores || 0}</p>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center ml-3">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Concluídos (Mês)</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">{statsMes?.total_concluidos || 0}</p>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center ml-3">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Em Andamento (Mês)</p>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-600">{statsMes?.total_em_andamento || 0}</p>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center ml-3">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Conversas (Mês)</p>
                    <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{(statsMes?.novas_conversas || 0) + (statsMes?.total_concluidos || 0) + (statsMes?.total_em_andamento || 0)}</p>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center ml-3">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Pendentes (Mês)</p>
                    <p className="text-2xl sm:text-3xl font-bold text-red-600">{statsMes?.total_pendentes || 0}</p>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center ml-3">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl font-bold text-gray-900">Conversas por Dia do Mês</h4>
                {statsMes?.grafico_dias && (() => {
                  const maxValue = Math.max(...(statsMes.grafico_dias?.map((d: any) => d.total) || [0]))
                  const peakDay = statsMes.grafico_dias?.find((d: any) => d.total === maxValue)?.dia
                  return (
                    <div className="hidden sm:flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="font-bold">{peakDay}</span>
                        <span className="text-green-100 text-sm">pico</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="font-bold">{statsMes.grafico_dias?.reduce((sum: number, d: any) => sum + d.total, 0) || 0}</span>
                        <span className="text-emerald-100 text-sm">total</span>
                      </div>
                    </div>
                  )
                })()}
              </div>
              
              {/* Mobile Layout */}
              <div className="sm:hidden">
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {statsMes?.grafico_dias && statsMes.grafico_dias.length > 0 ? (
                    Array.from({length: 31}, (_, i) => {
                      const day = i + 1
                      const dayData = statsMes.grafico_dias?.find((item: any) => item.dia === day)
                      const total = dayData?.total || 0
                      const maxTotal = Math.max(...(statsMes.grafico_dias?.map((d: any) => d.total) || [1]))
                      const intensity = maxTotal > 0 ? (total / maxTotal) : 0
                      
                      return (
                        <div key={day} className="flex flex-col items-center">
                          <div 
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                              total > 0 
                                ? 'text-white' 
                                : 'bg-gray-100 text-gray-400'
                            }`}
                            style={{
                              backgroundColor: total > 0 ? `rgba(34, 197, 94, ${0.3 + intensity * 0.7})` : '#f3f4f6'
                            }}
                          >
                            {total > 0 ? (total > 99 ? '99+' : total) : ''}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{day}</div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="col-span-7 flex items-center justify-center py-8 text-gray-500 text-sm">
                      Nenhum dado disponível
                    </div>
                  )}
                </div>
                
                {/* Mobile Summary */}
                {statsMes?.grafico_dias && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Pico:</span>
                        <span className="font-bold text-green-600 ml-1">
                          {Math.max(...(statsMes.grafico_dias?.map((d: any) => d.total) || [0]))}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total:</span>
                        <span className="font-bold text-green-600 ml-1">
                          {statsMes.grafico_dias?.reduce((sum: number, d: any) => sum + d.total, 0) || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Desktop Layout */}
              <div className="hidden sm:block">
                <div className="relative min-h-96 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-end justify-between space-x-1 overflow-x-auto" style={{ minHeight: '288px', paddingTop: '40px' }}>
                      {statsMes?.grafico_dias && statsMes.grafico_dias.length > 0 ? (
                        Array.from({length: 31}, (_, i) => {
                          const day = i + 1
                          const dayData = statsMes.grafico_dias?.find((item: any) => item.dia === day)
                          const total = dayData?.total || 0
                          const maxTotal = Math.max(...(statsMes.grafico_dias?.map((d: any) => d.total) || [1]))
                          const height = maxTotal > 0 ? (total / maxTotal) * 200 : 0
                          
                          return (
                            <div key={day} className="flex flex-col items-center flex-1 min-w-0 group">
                              <div className="relative mb-2">
                                {total > 0 && (
                                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                                    {total} conversas
                                  </div>
                                )}
                                <div className="text-xs font-bold text-green-700 mb-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm border border-green-200 whitespace-nowrap">
                                  {total > 0 ? total : ''}
                                </div>
                              </div>
                              <div className="relative w-full">
                                <div 
                                  className="w-full bg-gradient-to-t from-green-600 via-green-500 to-green-400 rounded-t-lg shadow-lg transition-all duration-700 ease-out group-hover:from-green-700 group-hover:via-green-600 group-hover:to-green-500 group-hover:shadow-xl"
                                  style={{ 
                                    height: `${height}px`, 
                                    minHeight: total > 0 ? '8px' : '3px',
                                    boxShadow: total > 0 ? '0 4px 20px rgba(34, 197, 94, 0.3)' : 'none'
                                  }}
                                >
                                  {total > 0 && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 rounded-t-lg"></div>
                                  )}
                                </div>
                                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-green-200 rounded-b-lg"></div>
                              </div>
                              <div className="text-xs text-gray-600 mt-2 font-semibold bg-gray-50 px-2 py-1 rounded-md">{day}</div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-500">
                          <p>Nenhum dado de gráfico disponível</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Grid lines */}
                    <div className="absolute inset-6 pointer-events-none">
                      {[0, 25, 50, 75, 100].map((percent) => (
                        <div 
                          key={percent}
                          className="absolute left-0 right-0 border-t border-gray-300/30"
                          style={{ bottom: `${(percent / 100) * 200 + 32}px` }}
                        >
                          <span className="absolute -left-8 -top-2 text-xs text-gray-500">
                            {Math.round((percent / 100) * (Math.max(...(statsMes?.grafico_dias?.map((d: any) => d.total) || [0]))))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <TutorialModal isOpen={tutorialOpen} onClose={() => setTutorialOpen(false)} />
    </div>
  )
}