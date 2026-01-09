"use client"
import { useState } from "react"
import { useRealTime, useAuth } from "../hooks/useRealTime"
import { getConversasAllEndpoint } from "../utils/security"

export default function ConversasPage() {
  const { getHeaders } = useAuth()

  const { data: conversas, loading }: { data: any, loading: boolean } = useRealTime(async () => {
    const response = await fetch('/api/proxy?path=/conversas/all')
    if (response.status === 401) {
      window.location.href = '/pages/login'
      return []
    }
    return response.json()
  }, 30000)

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'concluido': return 'bg-green-100 text-green-800'
      case 'em_andamento': return 'bg-blue-100 text-blue-800'
      case 'pendente': return 'bg-yellow-100 text-yellow-800'
      case 'novo': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  if (loading && !conversas) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando conversas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-6">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">💬 Conversas</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {Array.isArray(conversas) ? conversas.length : 0} conversas
          </p>
        </div>
        <div className="p-2 sm:p-6">
          {Array.isArray(conversas) && conversas.length > 0 ? (
            <div className="space-y-2 sm:space-y-4">
              {conversas.map((conversa, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4 border hover:shadow-lg transition-all">
                  {/* Mobile Layout */}
                  <div className="sm:hidden">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm truncate flex-1 mr-2">
                        {conversa.cliente_nome || 'Cliente não identificado'}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversa.status)}`}>
                        {conversa.status?.replace('_', ' ').toUpperCase() || 'SEM STATUS'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                      <div>
                        <span className="font-medium">Tel:</span> {conversa.cliente_telefone || 'N/A'}
                      </div>
                      {conversa.atendente_nome && (
                        <div className="truncate">
                          <span className="font-medium">Atend:</span> {conversa.atendente_nome}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                      <span>{formatDate(conversa.data_criacao).split(' ')[0]}</span>
                      <span>{formatDate(conversa.data_criacao).split(' ')[1]}</span>
                    </div>
                    
                    {conversa.ultima_mensagem && (
                      <div className="bg-gray-100 rounded p-2 mb-2">
                        <p className="text-xs text-gray-700 line-clamp-2">
                          {conversa.ultima_mensagem}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500">ID: {conversa.id}</span>
                      <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs">
                        Ver
                      </button>
                    </div>
                  </div>
                  
                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
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
                      <div className="bg-gray-100 rounded-lg p-3 mt-3">
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
                      <button className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-sm sm:text-lg">Nenhuma conversa encontrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}