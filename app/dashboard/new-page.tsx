"use client"
import { useState, useEffect } from "react"
import { apiService } from "../services/api"

interface StatsData {
  data: string
  total_conversas: number
  conversas_ativas: number
  conversas_concluidas: number
  grafico_por_hora: Array<{hora: number, total: number}>
}

interface StatsMes {
  mes: string
  total_conversas: number
  media_diaria: number
  grafico_por_dia: Array<{dia: number, total: number}>
}

export default function Dashboard() {
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [statsMes, setStatsMes] = useState<StatsMes | null>(null)
  const [atendentes, setAtendentes] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [selectedDate, selectedMonth])

  async function loadData() {
    setLoading(true)
    try {
      const [dataStats, mesStats, dashAtendentes] = await Promise.all([
        apiService.getStatsData(selectedDate),
        apiService.getStatsMes(selectedMonth),
        apiService.getDashAtendentes(selectedDate)
      ])
      
      setStatsData(dataStats)
      setStatsMes(mesStats)
      setAtendentes(dashAtendentes)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Análise de conversas e atendimentos</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token')
              window.location.href = '/pages/login'
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Sair
          </button>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data para análise diária
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mês para análise mensal
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Daily Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total do Dia</p>
                <p className="text-2xl font-bold text-gray-900">{statsData?.total_conversas || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ativas</p>
                <p className="text-2xl font-bold text-gray-900">{statsData?.conversas_ativas || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-gray-900">{statsData?.conversas_concluidas || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas Mensais</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total do Mês</p>
                <p className="text-3xl font-bold text-gray-900">{statsMes?.total_conversas || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Média Diária</p>
                <p className="text-xl font-semibold text-gray-700">{statsMes?.media_diaria?.toFixed(1) || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversas por Hora</h3>
            <div className="space-y-2">
              {statsData?.grafico_por_hora?.map((item) => (
                <div key={item.hora} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.hora}:00</span>
                  <div className="flex items-center">
                    <div 
                      className="bg-amber-200 h-4 rounded mr-2" 
                      style={{width: `${(item.total / Math.max(...(statsData?.grafico_por_hora?.map(h => h.total) || [1]))) * 100}px`}}
                    ></div>
                    <span className="text-sm font-medium">{item.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Atendentes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Atendentes do Dia</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.isArray(atendentes) && atendentes.length > 0 ? atendentes.map((atendente, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-amber-600 font-semibold">
                        {atendente.nome?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{atendente.nome}</p>
                      <p className="text-sm text-gray-500">{atendente.conversas} conversas</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    atendente.status === 'online' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {atendente.status}
                  </span>
                </div>
              )) : (
                <p className="text-gray-500 col-span-full text-center py-8">Nenhum atendente encontrado</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}