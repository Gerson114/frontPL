"use client"
import { useState } from "react"

export default function TestAuth() {
  const [results, setResults] = useState<any[]>([])

  const addResult = (test: string, status: string, data: any) => {
    setResults(prev => [...prev, { test, status, data, time: new Date().toLocaleTimeString() }])
  }

  const runTests = async () => {
    setResults([])
    
    // Teste 1: Verificar cookies
    addResult("Cookies", "info", document.cookie || "Nenhum cookie encontrado")
    
    // Teste 2: Auth Verify
    try {
      const authRes = await fetch('https://dashplanner.onrender.com/auth/verify', { 
        credentials: 'include' 
      })
      const authData = await authRes.json()
      addResult("Auth Verify", authRes.ok ? "success" : "error", authData)
    } catch (err: any) {
      addResult("Auth Verify", "error", err.message)
    }

    // Teste 3: Stats endpoint
    try {
      const statsRes = await fetch('https://dashplanner.onrender.com/conversas/stats', { 
        credentials: 'include' 
      })
      const statsData = statsRes.ok ? await statsRes.json() : `Status: ${statsRes.status}`
      addResult("Stats API", statsRes.ok ? "success" : "error", statsData)
    } catch (err: any) {
      addResult("Stats API", "error", err.message)
    }

    // Teste 4: Login test
    try {
      const loginRes = await fetch('https://dashplanner.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: 'test@test.com', password: 'test123' })
      })
      const loginData = await loginRes.json()
      addResult("Login Test", loginRes.ok ? "success" : "error", loginData)
    } catch (err: any) {
      addResult("Login Test", "error", err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Teste de Autenticação httpOnly Cookies</h1>
        
        <button 
          onClick={runTests}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mb-8"
        >
          Executar Testes
        </button>

        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              result.status === 'success' ? 'bg-green-50 border-green-500' :
              result.status === 'error' ? 'bg-red-50 border-red-500' :
              'bg-blue-50 border-blue-500'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{result.test}</h3>
                <span className="text-sm text-gray-500">{result.time}</span>
              </div>
              <div className={`text-sm ${
                result.status === 'success' ? 'text-green-700' :
                result.status === 'error' ? 'text-red-700' :
                'text-blue-700'
              }`}>
                <pre className="whitespace-pre-wrap">{JSON.stringify(result.data, null, 2)}</pre>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">📋 Como Interpretar:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>🟢 <strong>Success:</strong> Endpoint funcionando corretamente</li>
            <li>🔴 <strong>Error:</strong> Problema na requisição ou configuração</li>
            <li>🔵 <strong>Info:</strong> Informação sobre cookies no navegador</li>
          </ul>
        </div>
      </div>
    </div>
  )
}