"use client"
import { useState, useEffect } from "react"
import { useRealTime, useAuth } from "../hooks/useRealTime"
import { timeUtils } from "../utils/time"

export default function AtendentesPage() {
  const { getHeaders } = useAuth()
  const [selectedDate, setSelectedDate] = useState(timeUtils.getFilters().hoje)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { data: atendentesData, loading } = useRealTime(async () => {
    const headers = getHeaders()
    if (!headers) return null
    const response = await fetch(`http://192.168.120.249:8080/conversas/dash-atendentes?data=${selectedDate}`, { headers })
    const data = await response.json()
    console.log('Dados dos atendentes:', data)
    return data
  }, 15000, [selectedDate])

  const atendentes = Array.isArray(atendentesData) ? atendentesData : []
  console.log('Array de atendentes processado:', atendentes)

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'online': return 'bg-green-500'
      case 'ocupado': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'online': return 'Online'
      case 'ocupado': return 'Ocupado'
      case 'offline': return 'Offline'
      default: return 'Desconhecido'
    }
  }

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return `${index + 1}º`
    }
  }

  // Ordenar por satisfação e tempo de resposta
  const sortedAtendentes = [...atendentes].sort((a, b) => {
    const scoreA = (a.satisfacao || 0) * 10 - timeUtils.parseTimeToMinutes(a.tempo_medio_resposta || '00:00:00')
    const scoreB = (b.satisfacao || 0) * 10 - timeUtils.parseTimeToMinutes(b.tempo_medio_resposta || '00:00:00')
    return scoreB - scoreA
  })

  const onlineCount = atendentes.filter(a => a.status === 'online').length
  const ocupadoCount = atendentes.filter(a => a.status === 'ocupado').length
  const totalAtendimentos = atendentes.reduce((sum, a) => sum + (a.total_atendimentos || 0), 0)
  const mediaSatisfacao = atendentes.length > 0 ? 
    atendentes.reduce((sum, a) => sum + (a.satisfacao || 0), 0) / atendentes.length : 0

  if (loading && !atendentesData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados dos atendentes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-center h-16 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600">
          <h1 className="text-xl font-bold text-white tracking-wide">FrontPlanner</h1>
        </div>
        
        <nav className="mt-8 flex-1">
          <div className="px-4 space-y-2">
            <a href="/dashboard" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              Dashboard
            </a>
            
            <a href="/conversas" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Conversas
            </a>
            
            <a href="#" className="flex items-center px-4 py-3 text-gray-700 bg-blue-50 rounded-lg">
              <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Atendentes
            </a>
            
            <a href="/relatorios" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Relatórios
            </a>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={() => {
                localStorage.removeItem('token')
                window.location.href = '/pages/login'
              }}
              className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h2 className="ml-2 sm:ml-4 text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Atendentes</h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm shadow-sm hover:shadow-md transition-shadow"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Métricas Gerais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Atendimentos</p>
                  <p className="text-3xl font-bold text-blue-600">{atendentesData?.atendimentos?.total_atendimentos || 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Concluídos</p>
                  <p className="text-3xl font-bold text-green-600">{atendentesData?.atendimentos?.atendimentos_concluidos || 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Recebidos</p>
                  <p className="text-3xl font-bold text-yellow-600">{atendentesData?.atendimentos?.recebidos_por_ele || 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Iniciados</p>
                  <p className="text-3xl font-bold text-purple-600">{atendentesData?.atendimentos?.iniciados_por_ele || 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas de Tempo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">Tempo Espera Média</p>
                <p className="text-2xl font-bold text-blue-600">{atendentesData?.qualidade?.tempo_espera_media || '0 min'}</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">Tempo Primeira Resp.</p>
                <p className="text-2xl font-bold text-green-600">{atendentesData?.qualidade?.tempo_primeira_resp || '0 min'}</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">Tempo Total Média</p>
                <p className="text-2xl font-bold text-purple-600">{atendentesData?.qualidade?.tempo_total_media || '0 min'}</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">Classificados</p>
                <p className="text-2xl font-bold text-indigo-600">{atendentesData?.atendimentos?.classificados || 0}</p>
              </div>
            </div>
          </div>

          {/* Ranking de Atendentes */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">🏆 Ranking de Performance</h3>
            {sortedAtendentes.length > 0 ? (
              <div className="space-y-4">
                {sortedAtendentes.map((atendente, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold">{getRankIcon(index)}</div>
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {atendente.nome?.charAt(0)?.toUpperCase() || 'A'}
                          </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(atendente.status)} rounded-full border-2 border-white`}></div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{atendente.nome}</p>
                        <p className="text-sm text-gray-600">{getStatusText(atendente.status)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Atendimentos</p>
                        <p className="font-bold text-lg text-blue-600">{atendente.total_atendimentos || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Satisfação</p>
                        <p className={`font-bold text-lg ${timeUtils.getPerformanceColor((atendente.satisfacao || 0) * 20)}`}>
                          {(atendente.satisfacao || 0).toFixed(1)}⭐
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Tempo Resp.</p>
                        <p className={`font-bold ${timeUtils.isWithinSLA(atendente.tempo_medio_resposta, 2) ? 'text-green-600' : 'text-red-600'}`}>
                          {atendente.tempo_medio_resposta || '00:00:00'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500 text-lg">Nenhum atendente ativo no momento</p>
              </div>
            )}
          </div>

          {/* Lista Detalhada de Atendentes */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">👥 Todos os Atendentes</h3>
            </div>
            <div className="p-6">
              {atendentes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {atendentes.map((atendente, index) => (
                    <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {atendente.nome?.charAt(0)?.toUpperCase() || 'A'}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(atendente.status)} rounded-full border-2 border-white`}></div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{atendente.nome}</p>
                          <p className="text-sm text-gray-600">{getStatusText(atendente.status)}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Atendimentos:</span>
                          <span className="font-semibold text-blue-600">{atendente.total_atendimentos || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Satisfação:</span>
                          <span className={`font-semibold ${timeUtils.getPerformanceColor((atendente.satisfacao || 0) * 20)}`}>
                            {(atendente.satisfacao || 0).toFixed(1)}⭐
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tempo Resp.:</span>
                          <span className={`font-semibold ${timeUtils.isWithinSLA(atendente.tempo_medio_resposta, 2) ? 'text-green-600' : 'text-red-600'}`}>
                            {atendente.tempo_medio_resposta || '00:00:00'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-500 text-lg">Nenhum atendente encontrado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}