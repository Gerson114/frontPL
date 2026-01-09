"use client"
import { useState } from "react"
import { sanitizeInput, validateEmail, validatePassword } from "../../utils/security"
import { makeApiCall } from "../../utils/api"

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [carregando, setCarregando] = useState(false)
    const [error, setError] = useState('')

    async function handleLogin(event: React.FormEvent) {
        event.preventDefault()
        setError('')
        
        const sanitizedEmail = sanitizeInput(email)
        const sanitizedPassword = sanitizeInput(password)
        
        if (!validateEmail(sanitizedEmail)) {
            setError('Email inválido')
            return
        }
        
        if (!validatePassword(sanitizedPassword)) {
            setError('Senha deve ter pelo menos 6 caracteres')
            return
        }
        
        setCarregando(true)
        
        try {
            const response = await makeApiCall('POST', {
                path: '/login',
                email: sanitizedEmail, 
                password: sanitizedPassword 
            })

            const data = await response.json()
            
            if (data.success) {
                window.location.href = '/dashboard'
            } else {
                setError(data.message || 'Credenciais inválidas')
            }
        } catch (error) {
            setError('Erro de conexão')
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#F8FAFC] relative overflow-hidden font-sans">
            {/* Background Minimalista - Design Moderno */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-70"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-70"></div>
            </div>
            
            <div className="max-w-md w-full mx-4 relative z-10">
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                    
                    {/* Header Refinado */}
                    <div className="pt-12 pb-8 px-8 text-center">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100 transform -rotate-3">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0020 20c.304 0 .599-.041.88-.121m-1.318-5.561A10.003 10.003 0 0112 3c4.783 0 8.791 3.346 9.809 7.841m-2.181 4.614A9.92 9.92 0 0112 15c-1.34 0-2.618-.265-3.784-.744" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Login
                        </h1>
                        <p className="text-slate-500 mt-2 text-sm font-medium">
                            Bem-vindo de volta! Acesse sua conta.
                        </p>
                    </div>

                    <div className="px-8 pb-12">
                        <form className="space-y-5" onSubmit={handleLogin}>
                            {error && (
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-xs font-semibold animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        {error}
                                    </div>
                                </div>
                            )}

                            {/* Inputs com micro-interações */}
                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">
                                    Endereço de E-mail
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="email" 
                                        placeholder="exemplo@dominio.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3.5 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-200 text-slate-700 font-medium placeholder-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                                        Senha
                                    </label>
                                    <a href="#" className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold uppercase tracking-tighter transition-colors">
                                        Esqueceu?
                                    </a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3.5 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-200 text-slate-700 font-medium placeholder-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center py-1">
                                <label className="flex items-center cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer" />
                                    <span className="ml-2.5 text-sm text-slate-500 group-hover:text-slate-700 font-medium transition-colors">Permanecer conectado</span>
                                </label>
                            </div>

                            <button 
                                type="submit"
                                disabled={carregando}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-indigo-100 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {carregando ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Autenticando...
                                    </span>
                                ) : "Acessar Sistema"}
                            </button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                            <p className="text-slate-500 text-sm font-medium">
                                Novo por aqui?{' '}
                                <a href="/pages/register" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors ml-1">
                                    Crie sua conta agora
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}