"use client"
import { useState } from "react"
import { useRealTime, useAuth } from "../hooks/useRealTime"
import { timeUtils } from "../utils/time"
import { getDashAtendentesEndpoint } from "../utils/security"

export default function AtendentesPage() {
  const { getHeaders } = useAuth()
  const [selectedDate, setSelectedDate] = useState(timeUtils.getFilters().hoje)

  const { data: atendentesData, loading }: { data: any, loading: boolean } = useRealTime(async () => {
    const headers = getHeaders()
    if (!headers) return null
    const response = await fetch(`${getDashAtendentesEndpoint()}?data=${selectedDate}`, { headers })
    return response.json()
  }, 15000, [selectedDate])

  const atendentes = Array.isArray(atendentesData) ? atendentesData : []

  if (loading && !atendentesData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados dos atendentes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Atendimentos</p>
              <p className="text-3xl font-bold text-blue-600">{atendentesData?.atendimentos?.total_atendimentos || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Concluídos</p>
              <p className="text-3xl font-bold text-green-600">{atendentesData?.atendimentos?.atendimentos_concluidos || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Recebidos</p>
              <p className="text-3xl font-bold text-yellow-600">{atendentesData?.atendimentos?.recebidos_por_ele || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Iniciados</p>
              <p className="text-3xl font-bold text-purple-600">{atendentesData?.atendimentos?.iniciados_por_ele || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Atendentes</h3>
        {atendentes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {atendentes.map((atendente, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {atendente.nome?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{atendente.nome}</p>
                    <p className="text-sm text-gray-600">{atendente.status}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Atendimentos:</span>
                    <span className="font-semibold text-blue-600">{atendente.total_atendimentos || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Satisfação:</span>
                    <span className="font-semibold text-green-600">{(atendente.satisfacao || 0).toFixed(1)}⭐</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum atendente encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}