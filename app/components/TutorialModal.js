import { useState } from 'react'

export const TutorialModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const tutorialSteps = [
    {
      title: "Bem-vindo ao FrontPlanner",
      content: "Sistema completo de monitoramento de conversas e atendimento em tempo real.",
      icon: "👋"
    },
    {
      title: "Métricas de Tempo",
      content: "Monitore tempo médio de atendimento, primeira resposta e taxa de abandono. Cores indicam performance: Verde (bom), Amarelo (atenção), Vermelho (crítico).",
      icon: "⏱️"
    },
    {
      title: "Status em Tempo Real",
      content: "Acompanhe fila de espera, atendentes online e SLA atual. Dados atualizados automaticamente a cada 30 segundos.",
      icon: "🔄"
    },
    {
      title: "Ranking de Atendentes",
      content: "Veja performance dos atendentes com satisfação, tempo de resposta e status (online/ocupado/offline). Ranking baseado em qualidade.",
      icon: "🏆"
    },
    {
      title: "Gráficos Interativos",
      content: "Dashboard: conversas por hora do dia. Relatórios: conversas por dia do mês. Visualize padrões e picos de atendimento.",
      icon: "📊"
    },
    {
      title: "Filtros de Data",
      content: "Use os filtros no header para analisar períodos específicos. Dashboard para análise diária, Relatórios para análise mensal.",
      icon: "📅"
    }
  ]

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!isOpen) return null

  const step = tutorialSteps[currentStep]

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl animate-bounce">{step.icon}</div>
              <div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-indigo-100 text-sm">Passo {currentStep + 1} de {tutorialSteps.length}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200 hover:rotate-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed mb-6 animate-fadeIn">{step.content}</p>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Progresso</span>
              <span>{Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-600 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                currentStep === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
              }`}
            >
              Anterior
            </button>
            
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Finalizar' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}