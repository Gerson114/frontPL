"use client"
import { useState, useEffect } from "react"
import { useRealTime, useAuth } from "../hooks/useRealTime"
import { Sidebar } from "../components/Sidebar"
import { TutorialModal } from "../components/TutorialModal"
import { timeUtils } from "../utils/time"

interface StatsData {
  novas_conversas?: number
  pendentes_anteriores?: number
  total_concluidos?: number
  total_em_andamento?: number
  total_pendentes?: number
  grafico_horas?: Array<{ hora: number; total: number }>
}

export default function Dashboard() {
  const { getHeaders } = useAuth()
  const [selectedDate, setSelectedDate] = useState(timeUtils.getFilters().hoje)
  const [selectedMonth, setSelectedMonth] = useState(timeUtils.getFilters().mesAtual)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tutorialOpen, setTutorialOpen] = useState(false)

  const { data: statsData, loading: statsLoading, lastUpdate }: {
    data: StatsData | null
    loading: boolean
    lastUpdate: Date | null
  } = useRealTime(async () => {
    try {
      const token = localStorage.getItem('token')
      const headers: any = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`http://192.168.120.249:8080/conversas/stats?data=${selectedDate}`, {
        method: 'GET',
        mode: 'cors',
        headers
      })
      if (!response.ok) {
        console.log('API Response:', response.status, response.statusText)
        return null
      }
      const data = await response.json()
      console.log('📊 Dados da API recebidos:', data)
      return data
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
      return null
    }
  }, 30000, [selectedDate])

  const { data: statsMes } = useRealTime(async () => {
    try {
      const token = localStorage.getItem('token')
      const headers: any = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`http://192.168.120.249:8080/conversas/stats-mes?mes=${selectedMonth}`, {
        method: 'GET',
        mode: 'cors',
        headers
      })
      if (!response.ok) {
        console.log('API Monthly Response:', response.status, response.statusText)
        return null
      }
      const data = await response.json()
      console.log('📅 Dados mensais da API:', data)
      return data
    } catch (error) {
      console.error('Erro ao buscar dados mensais:', error)
      return null
    }
  }, 60000, [selectedMonth])

  if (statsLoading && !statsData) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar currentPage="dashboard" />
      </div>

      <div className="flex-1 lg:ml-0">
        <div className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Dashboard</h2>
                  <p className="text-sm text-gray-500 hidden sm:block">Monitoramento em tempo real</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm shadow-sm hover:shadow-md transition-all"
                  />
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm shadow-sm hover:shadow-md transition-all"
                  />
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

        <div className="p-4 sm:p-6">
          {lastUpdate && (
            <div className="mb-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-800">Última atualização: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Carregando...'}</span>
              </div>
              <div className="text-xs text-blue-600">Atualizando a cada 30s</div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
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

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Conversas por Hora - Diário</h3>
            <div className="h-64 flex items-end justify-between space-x-1">
              {Array.from({length: 24}, (_, i) => {
                const hourData = statsData?.grafico_horas?.find((item: any) => item.hora === i)
                const total = hourData?.total || 0
                const maxTotal = Math.max(...(statsData?.grafico_horas?.map((h: any) => h.total) || [1]))
                const height = maxTotal > 0 ? (total / maxTotal) * 200 : 0
                
                return (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <div className="text-xs font-medium text-gray-600 mb-1">{total}</div>
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                      style={{ height: `${height}px`, minHeight: total > 0 ? '4px' : '2px' }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-center">{i}h</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      <TutorialModal isOpen={tutorialOpen} onClose={() => setTutorialOpen(false)} />
    </div>
  )
}