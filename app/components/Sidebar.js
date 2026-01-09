"use client"
import { useState } from "react"

export const Sidebar = ({ currentPage = "dashboard" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" },
    { id: "conversas", label: "Conversas", href: "/conversas", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
    { id: "atendentes", label: "Atendentes", href: "/atendentes", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" },
    { id: "perfil", label: "Meu Perfil", href: "/perfil", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "configuracoes", label: "Configurações", href: "/configuracoes", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" }
  ]

  const getCurrentDate = () => {
    const now = new Date()
    const day = now.getDate().toString().padStart(2, '0')
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    return { day, month }
  }

  const { day, month } = getCurrentDate()

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-center h-16 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 px-2">
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide text-center">DashPlanner</h1>
        </div>
        
        <nav className="mt-4 sm:mt-8 flex-1">
          <div className="px-2 sm:px-4 space-y-1 sm:space-y-2">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-center px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                  currentPage === item.id
                    ? "text-gray-700 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 ${currentPage === item.id ? "text-blue-600" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
          
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
            <button
              onClick={() => {
                localStorage.removeItem('token')
                window.location.href = '/pages/login'
              }}
              className="flex items-center w-full px-2 sm:px-4 py-2 sm:py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sair</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between h-16 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 px-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white z-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 className="text-lg font-bold text-white tracking-wide">DashPlanner</h1>
          
          <div className="flex items-center space-x-2 text-white text-sm">
            <span>{day}</span>
            <span>/</span>
            <span>{month}</span>
          </div>
        </div>
        
        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        
        {/* Mobile Menu Sidebar */}
        <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex items-center justify-between h-16 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 px-4">
            <h1 className="text-lg font-bold text-white tracking-wide">DashPlanner</h1>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="mt-4">
            <div className="px-4 space-y-2">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? "text-gray-700 bg-blue-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <svg className={`w-5 h-5 mr-3 ${currentPage === item.id ? "text-blue-600" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </a>
              ))}
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
                <span>Sair</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}