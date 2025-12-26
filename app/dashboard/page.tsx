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

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers: any = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversas/stats?data=${selectedDate}`, {
        method: 'GET',
        mode: 'cors',
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setStatsData(data)
        setLastUpdate(new Date())
      } else {
        setStatsData(null)
      }
    } catch (error) {
      setStatsData(null)
    }
  }

  const fetchMonthlyData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers: any = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversas/stats-mes?mes=${selectedMonth}`, {
        method: 'GET',
        mode: 'cors',
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setStatsMes(data)
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
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl">
        <Sidebar currentPage="dashboard" />
      </div>

      <div className="ml-64">
        <div className="fixed top-0 left-64 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Dashboard Completo</h2>
                  <p className="text-sm text-gray-500 hidden sm:block">Dados diários e mensais em tempo real</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <label className="text-xs text-gray-600 font-medium">Dia:</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      max={(() => {
                        const yesterday = new Date()
                        yesterday.setDate(yesterday.getDate() - 1)
                        return yesterday.toISOString().split('T')[0]
                      })()}
                      className="px-3 py-2 border-0 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 text-sm shadow-sm hover:shadow-md transition-all cursor-pointer text-gray-900 font-medium"
                      style={{
                        colorScheme: 'light',
                        WebkitAppearance: 'none',
                        MozAppearance: 'textfield'
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <label className="text-xs text-gray-600 font-medium">Mês:</label>
                    <input
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="px-3 py-2 border-0 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 text-sm shadow-sm hover:shadow-md transition-all cursor-pointer text-gray-900 font-medium"
                      style={{
                        colorScheme: 'light',
                        WebkitAppearance: 'none',
                        MozAppearance: 'textfield'
                      }}
                    />
                  </div>
                </div>
                
                <div className="h-6 w-px bg-gray-300"></div>
                
                <div className="flex items-center space-x-2">
                  <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Online</span>
                  </div>
                  
                  <button
                    onClick={() => setTutorialOpen(true)}
                    className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">Tutorial</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      localStorage.removeItem('token')
                      window.location.href = '/pages/login'
                    }}
                    className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">Sair</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 p-4 sm:p-6">
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
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Conversas por Hora - Diário</h4>
              <div className="h-64 flex items-end justify-between space-x-1">
                {statsData?.grafico_horas && statsData.grafico_horas.length > 0 ? (
                  Array.from({length: 24}, (_, i) => {
                    const hourData = statsData.grafico_horas?.find((item: any) => item.hora === i)
                    const total = hourData?.total || 0
                    const maxTotal = Math.max(...(statsData.grafico_horas?.map((h: any) => h.total) || [1]))
                    const height = maxTotal > 0 ? (total / maxTotal) * 200 : 0
                    
                    return (
                      <div key={i} className="flex flex-col items-center flex-1">
                        <div className="text-xs font-medium text-gray-600 mb-1">{total > 0 ? total : ''}</div>
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                          style={{ height: `${height}px`, minHeight: total > 0 ? '4px' : '2px' }}
                        ></div>
                        <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-center">{i}h</div>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-500">
                    <p>Nenhum dado de gráfico disponível</p>
                  </div>
                )}
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
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Conversas por Dia do Mês</h4>
              <div className="h-64 flex items-end justify-between space-x-1 overflow-x-auto">
                {statsMes?.grafico_dias && statsMes.grafico_dias.length > 0 ? (
                  Array.from({length: 31}, (_, i) => {
                    const day = i + 1
                    const dayData = statsMes.grafico_dias?.find((item: any) => item.dia === day)
                    const total = dayData?.total || 0
                    const maxTotal = Math.max(...(statsMes.grafico_dias?.map((d: any) => d.total) || [1]))
                    const height = maxTotal > 0 ? (total / maxTotal) * 200 : 0
                    
                    return (
                      <div key={day} className="flex flex-col items-center flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-600 mb-1">{total > 0 ? total : ''}</div>
                        <div 
                          className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm transition-all duration-500 hover:from-green-600 hover:to-green-500"
                          style={{ height: `${height}px`, minHeight: total > 0 ? '4px' : '2px' }}
                        ></div>
                        <div className="text-xs text-gray-500 mt-1">{day}</div>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-500">
                    <p>Nenhum dado de gráfico disponível</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <TutorialModal isOpen={tutorialOpen} onClose={() => setTutorialOpen(false)} />
    </div>
  )
}