"use client"
import { useState } from "react"
import { useRealTime, useAuth } from "../hooks/useRealTime"

export default function ConversasPage() {
  const { getHeaders } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { data: conversas, loading } = useRealTime(async () => {
    const headers = getHeaders()
    if (!headers) return null
    const response = await fetch(`http://192.168.120.249:8080/conversas/all`, { headers })
    return response.json()
  }, 30000)

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'concluido': return 'bg-green-100 text-green-800'
      case 'em_andamento': return 'bg-blue-100 text-blue-800'
      case 'pendente': return 'bg-yellow-100 text-yellow-800'
      case 'novo': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  if (loading && !conversas) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando conversas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar currentPage="conversas" />
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
                <h2 className="ml-2 sm:ml-4 text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Conversas</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Lista de Conversas */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">💬 Todas as Conversas</h3>
              <p className="text-sm text-gray-600 mt-1">
                {Array.isArray(conversas) ? conversas.length : 0} conversas encontradas
              </p>
            </div>
            <div className="p-6">
              {Array.isArray(conversas) && conversas.length > 0 ? (
                <div className="space-y-4">
                  {conversas.map((conversa, index) => (
                    <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {conversa.cliente_nome || 'Cliente não identificado'}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversa.status)}`}>
                              {conversa.status?.replace('_', ' ').toUpperCase() || 'SEM STATUS'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Telefone:</strong> {conversa.cliente_telefone || 'Não informado'}
                          </p>
                          {conversa.atendente_nome && (
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Atendente:</strong> {conversa.atendente_nome}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>Criado: {formatDate(conversa.data_criacao)}</p>
                          {conversa.data_atualizacao && (
                            <p>Atualizado: {formatDate(conversa.data_atualizacao)}</p>
                          )}
                        </div>
                      </div>
                      
                      {conversa.ultima_mensagem && (
                        <div className="bg-gray-50 rounded-lg p-3 mt-3">
                          <p className="text-sm text-gray-700">
                            <strong>Última mensagem:</strong> {conversa.ultima_mensagem}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>ID: {conversa.id}</span>
                          {conversa.canal && <span>Canal: {conversa.canal}</span>}
                        </div>
                        <button className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors">
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-500 text-lg">Nenhuma conversa encontrada</p>
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