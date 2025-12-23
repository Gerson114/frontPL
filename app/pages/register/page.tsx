"use client"
import { useState } from "react"

export default function Register() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [carregando, setCarregando] = useState(false)

    async function handleRegister(event: React.FormEvent) {
        event.preventDefault()
        
        if (password !== confirmPassword) {
            alert('As senhas não coincidem')
            return
        }
        
        setCarregando(true)
        
        try {
            const response = await fetch('http://192.168.120.249:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name: nome, 
                    email, 
                    password,
                    confirmPassword 
                })
            })

            if (!response.ok) {
                const errorData = await response.text()
                console.error('Erro do servidor:', response.status, errorData)
                throw new Error('Erro ao criar conta')
            }

            const data = await response.json()
            console.log('Sucesso:', data)
            alert('Conta criada com sucesso!')
            
        } catch (error) {
            console.error('Erro no registro:', error)
            alert('Erro ao criar conta. Tente novamente.')
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-20 left-20 w-32 h-32 bg-amber-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-24 h-24 bg-orange-300 rounded-full opacity-30 animate-bounce"></div>
                <div className="absolute top-1/2 left-10 w-16 h-16 bg-yellow-200 rounded-full opacity-25"></div>
            </div>
            
            <div className="max-w-md w-full mx-4 relative z-10">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
                    <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 px-8 py-8 relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10 text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow-sm">
                                Criar Conta
                            </h1>
                            <p className="text-amber-100 mt-2 text-sm font-medium">
                                Cadastre-se para começar
                            </p>
                        </div>
                    </div>

                    <div className="px-8 py-10">
                        <form className="space-y-6" onSubmit={handleRegister}>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    👤 Nome
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Seu nome completo"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        required
                                        className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-400 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white placeholder-gray-400 text-gray-800 font-medium shadow-sm hover:shadow-md"
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    📧 E-mail
                                </label>
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-400 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white placeholder-gray-400 text-gray-800 font-medium shadow-sm hover:shadow-md"
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    🔒 Senha
                                </label>
                                <div className="relative">
                                    <input 
                                        type="password" 
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-400 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white placeholder-gray-400 text-gray-800 font-medium shadow-sm hover:shadow-md"
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    🔐 Confirmar Senha
                                </label>
                                <div className="relative">
                                    <input 
                                        type="password" 
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-400 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white placeholder-gray-400 text-gray-800 font-medium shadow-sm hover:shadow-md"
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={carregando}
                                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {carregando ? (
                                        <>
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Criando conta...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                            Criar Conta
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="border-t border-gray-200 flex-1"></div>
                                <span className="px-4 text-gray-500 text-sm font-medium">ou</span>
                                <div className="border-t border-gray-200 flex-1"></div>
                            </div>
                            <p className="text-gray-600 text-sm font-medium">
                                Já tem uma conta?{' '}
                                <a href="/pages/login" className="text-amber-600 hover:text-amber-700 font-bold hover:underline transition-all">
                                    Faça login
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}