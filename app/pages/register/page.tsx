"use client"
import { useState } from "react"
import { sanitizeInput, validateEmail, validatePassword } from "../../utils/security"

export default function Register() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [carregando, setCarregando] = useState(false)
    const [error, setError] = useState('')

    async function handleRegister(event: React.FormEvent) {
        event.preventDefault()
        setError('')
        
        const sanitizedNome = sanitizeInput(nome)
        const sanitizedEmail = sanitizeInput(email)
        const sanitizedPassword = sanitizeInput(password)
        const sanitizedConfirmPassword = sanitizeInput(confirmPassword)
        
        if (!sanitizedNome.trim()) {
            setError('Nome é obrigatório')
            return
        }
        
        if (!validateEmail(sanitizedEmail)) {
            setError('Email inválido')
            return
        }
        
        if (!validatePassword(sanitizedPassword)) {
            setError('Senha deve ter pelo menos 6 caracteres')
            return
        }
        
        if (sanitizedPassword !== sanitizedConfirmPassword) {
            setError('As senhas não coincidem')
            return
        }
        
        setCarregando(true)
        
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: sanitizedNome, 
                    email: sanitizedEmail, 
                    password: sanitizedPassword,
                    confirmPassword: sanitizedConfirmPassword 
                })
            })

            const data = await response.json()
            
            if (data.success) {
                alert('Conta criada com sucesso!')
                window.location.href = '/pages/login'
            } else {
                setError(data.message || 'Erro ao criar conta')
            }
        } catch (error) {
            setError('Erro de conexão')
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#f8fafc] relative overflow-hidden font-sans">
            {/* Background Elements - Mais sutis e modernos */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
            </div>
            
            <div className="max-w-md w-full mx-4 relative z-10">
                <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
                    
                    {/* Header - Minimalista e Profissional */}
                    <div className="pt-10 pb-6 px-8 text-center">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-200">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                            Criar nova conta
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm">
                            Preencha os dados para acessar a plataforma
                        </p>
                    </div>

                    <div className="px-8 pb-10">
                        <form className="space-y-5" onSubmit={handleRegister}>
                            {error && (
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-xs font-medium animate-in fade-in slide-in-from-top-1">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        {error}
                                    </div>
                                </div>
                            )}

                            {/* Input Group */}
                            {[
                                { label: 'Nome Completo', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', value: nome, setter: setNome, type: 'text', placeholder: 'Ex: João Silva' },
                                { label: 'E-mail profissional', icon: 'M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207', value: email, setter: setEmail, type: 'email', placeholder: 'seu@email.com' },
                                { label: 'Senha', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', value: password, setter: setPassword, type: 'password', placeholder: '••••••••' },
                                { label: 'Confirmar Senha', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', value: confirmPassword, setter: setConfirmPassword, type: 'password', placeholder: '••••••••' }
                            ].map((field, idx) => (
                                <div key={idx} className="space-y-1.5">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
                                        {field.label}
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
                                            </svg>
                                        </div>
                                        <input 
                                            type={field.type}
                                            value={field.value}
                                            onChange={(e) => field.setter(e.target.value)}
                                            required
                                            placeholder={field.placeholder}
                                            className="w-full px-4 py-3.5 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                            ))}

                            <button 
                                type="submit"
                                disabled={carregando}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                            >
                                {carregando ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processando...
                                    </span>
                                ) : "Criar Minha Conta"}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-gray-500 text-sm">
                                Já possui cadastro?{' '}
                                <a href="/pages/login" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors">
                                    Acessar conta
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Footer simples */}
                <p className="text-center text-gray-400 text-xs mt-8 tracking-wide">
                    &copy; 2024 Sua Empresa. Todos os direitos reservados.
                </p>
            </div>
        </div>
    )
}