"use client"
import { useState } from "react"
import { useRealTime, useAuth } from "../hooks/useRealTime"

export default function ConversasPage() {
  const { getHeaders } = useAuth()

  const { data: conversas, loading }: { data: any, loading: boolean } = useRealTime(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/pages/login'
      return []
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/conversas/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/pages/login'
      return []
    }
    return response.json()
  }, 30000)

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'concluido': return 'bg-emerald-100 text-emerald-800 border border-emerald-200'
      case 'em_andamento': return 'bg-sky-100 text-sky-800 border border-sky-200'
      case 'pendente': return 'bg-amber-100 text-amber-800 border border-amber-200'
      case 'novo': return 'bg-violet-100 text-violet-800 border border-violet-200'
      default: return 'bg-slate-100 text-slate-800 border border-slate-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  if (loading && !conversas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Carregando conversas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-6 bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 min-h-screen">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50">
          <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">💬 Conversas</h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {Array.isArray(conversas) ? conversas.length : 0} conversas
          </p>
        </div>
        <div className="p-2 sm:p-6">
          {Array.isArray(conversas) && conversas.length > 0 ? (
            <div className="space-y-2 sm:space-y-4">
              {conversas.map((conversa, index) => (
                <div key={index} className="bg-gradient-to-r from-white to-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200 hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
                  {/* Mobile Layout */}
                  <div className="sm:hidden">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900 text-sm truncate flex-1 mr-2">
                        {conversa.cliente_nome || 'Cliente não identificado'}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversa.status)}`}>
                        {conversa.status?.replace('_', ' ').toUpperCase() || 'SEM STATUS'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-2">
                      <div>
                        <span className="font-medium">Tel:</span> {conversa.cliente_telefone || 'N/A'}
                      </div>
                      {conversa.atendente_nome && (
                        <div className="truncate">
                          <span className="font-medium">Atend:</span> {conversa.atendente_nome}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                      <span>{formatDate(conversa.data_criacao).split(' ')[0]}</span>
                      <span>{formatDate(conversa.data_criacao).split(' ')[1]}</span>
                    </div>
                    
                    {conversa.ultima_mensagem && (
                      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-2 mb-2 border border-indigo-100">
                        <p className="text-xs text-slate-700 line-clamp-2">
                          {conversa.ultima_mensagem}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2 border-t border-indigo-100">
                      <span className="text-xs text-slate-500">ID: {conversa.id}</span>
                      <button className="px-2 py-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg text-xs hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 shadow-sm">
                        Ver
                      </button>
                    </div>
                  </div>
                  
                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-slate-900">
                            {conversa.cliente_nome || 'Cliente não identificado'}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversa.status)}`}>
                            {conversa.status?.replace('_', ' ').toUpperCase() || 'SEM STATUS'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          <strong>Telefone:</strong> {conversa.cliente_telefone || 'Não informado'}
                        </p>
                        {conversa.atendente_nome && (
                          <p className="text-sm text-slate-600 mb-2">
                            <strong>Atendente:</strong> {conversa.atendente_nome}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm text-slate-500">
                        <p>Criado: {formatDate(conversa.data_criacao)}</p>
                        {conversa.data_atualizacao && (
                          <p>Atualizado: {formatDate(conversa.data_atualizacao)}</p>
                        )}
                      </div>
                    </div>
                    
                    {conversa.ultima_mensagem && (
                      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-3 mt-3 border border-indigo-100">
                        <p className="text-sm text-slate-700">
                          <strong>Última mensagem:</strong> {conversa.ultima_mensagem}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-indigo-100">
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>ID: {conversa.id}</span>
                        {conversa.canal && <span>Canal: {conversa.canal}</span>}
                      </div>
                      <button className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg text-xs hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 shadow-sm">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl">
              <p className="text-slate-500 text-sm sm:text-lg font-medium">Nenhuma conversa encontrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}