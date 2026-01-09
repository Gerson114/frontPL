"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import { Sidebar } from "./components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/' || pathname?.includes('/login') || pathname?.includes('/register');

  return (
    <html lang="pt-BR">
      <head>
        <title>FrontPlanner Dashboard</title>
        <meta name="description" content="Dashboard de conversas e atendimento" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {isAuthPage ? (
          children
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Desktop Sidebar */}
            <div className="hidden sm:block fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl">
              <Sidebar currentPage={pathname?.split('/')[1] || 'dashboard'} />
            </div>
            
            {/* Mobile Header */}
            <div className="sm:hidden fixed top-0 left-0 right-0 z-50">
              <Sidebar currentPage={pathname?.split('/')[1] || 'dashboard'} />
            </div>
            
            <div className={pathname === '/dashboard' ? '' : 'sm:ml-64'}>
              {pathname !== '/dashboard' && (
                <div className="hidden sm:block fixed top-0 left-64 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100">
                  <div className="px-4 lg:px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                          {pathname === '/atendentes' ? 'Atendentes' :
                           pathname === '/conversas' ? 'Conversas' :
                           pathname === '/perfil' ? 'Meu Perfil' :
                           pathname === '/configuracoes' ? 'Configurações' : 'Dashboard'}
                        </h2>
                        <p className="text-sm text-gray-500">Dados em tempo real</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Online</span>
                        </div>
                        
                        <button
                          onClick={async () => {
                            await fetch('/api/auth/logout', { method: 'POST' })
                            window.location.href = '/pages/login'
                          }}
                          className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="text-sm">Sair</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className={pathname === '/dashboard' ? 'pt-16 sm:pt-0' : 'pt-16 sm:pt-20'}>
                {children}
              </div>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
