"use client"
import { useState } from "react"
import { TutorialModal } from "./TutorialModal"

export const Sidebar = ({ currentPage = "dashboard" }) => {
  const [tutorialOpen, setTutorialOpen] = useState(false)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" },
    { id: "conversas", label: "Conversas", href: "/conversas", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
    { id: "atendentes", label: "Atendentes", href: "/atendentes", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" },
    { id: "relatorios", label: "Relatórios", href: "/relatorios", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }
  ]

  return (
    <>
      <div className="flex items-center justify-center h-16 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600">
        <h1 className="text-xl font-bold text-white tracking-wide">FrontPlanner</h1>
      </div>
      
      <nav className="mt-8 flex-1">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id
                  ? "text-gray-700 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <svg className={`w-5 h-5 mr-3 ${currentPage === item.id ? "text-blue-600" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.label}
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
            Sair
          </button>
        </div>
      </nav>

      <TutorialModal isOpen={tutorialOpen} onClose={() => setTutorialOpen(false)} />
    </>
  )
}