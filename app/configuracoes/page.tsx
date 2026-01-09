"use client"
import { useState } from "react"
import { Sidebar } from "../components/Sidebar"

export default function Configuracoes() {
  const [notifications, setNotifications] = useState(true)
  const [pixData, setPixData] = useState({
    chave: "",
    email: "",
    telefone: ""
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Desktop Sidebar */}
      <div className="hidden sm:block fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl">
        <Sidebar currentPage="configuracoes" />
      </div>
      
      {/* Mobile Header */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-50">
        <Sidebar currentPage="configuracoes" />
      </div>

      <div className="sm:ml-64">
        <div className="fixed top-16 sm:top-0 left-0 sm:left-64 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100">
          <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Configurações</h2>
                <p className="text-xs sm:text-sm text-gray-500">Personalize suas preferências do sistema</p>
              </div>
              
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  window.location.href = '/pages/login'
                }}
                className="flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-xs sm:text-sm">Sair</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-32 sm:pt-20 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Configurações PIX */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Dados PIX</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chave PIX</label>
                  <input
                    type="text"
                    value={pixData.chave}
                    onChange={(e) => setPixData({...pixData, chave: e.target.value})}
                    placeholder="Digite sua chave PIX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={pixData.email}
                    onChange={(e) => setPixData({...pixData, email: e.target.value})}
                    placeholder="seu@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={pixData.telefone}
                    onChange={(e) => setPixData({...pixData, telefone: e.target.value})}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
                    Salvar Dados PIX
                  </button>
                </div>
              </div>
            </div>

            {/* Configurações de Sistema */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sistema</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zM12 12h.01" />
                      </svg>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">Notificações</h4>
                      <p className="text-sm text-gray-600">Receber notificações do sistema</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">Atualização Automática</h4>
                      <p className="text-sm text-gray-600">Atualizar dados automaticamente</p>
                    </div>
                  </div>
                  
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}