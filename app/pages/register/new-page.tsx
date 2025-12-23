"use client"
import { useState } from "react"
import { apiService } from "../services/api"

export default function Register() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleRegister(event: React.FormEvent) {
        event.preventDefault()
        
        if (password !== confirmPassword) {
            alert('As senhas não coincidem')
            return
        }
        
        setLoading(true)
        
        try {
            await apiService.register(nome, email, password)
            alert('Conta criada com sucesso!')
            window.location.href = '/pages/login'
        } catch (error) {
            alert('Erro ao criar conta. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Criar nova conta
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div>
                        <input
                            type="text"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Nome completo"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Confirmar senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                        >
                            {loading ? 'Criando...' : 'Criar conta'}
                        </button>
                    </div>
                    <div className="text-center">
                        <a href="/pages/login" className="text-amber-600 hover:text-amber-700">
                            Já tem conta? Faça login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}