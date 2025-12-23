import { timeUtils } from '../../utils/time'

export const TimeMetrics = ({ data }) => {
  if (!data) return <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>

  const metrics = [
    {
      title: 'Tempo Médio Atendimento',
      value: data.tempo_medio_atendimento || '00:00:00',
      icon: '⏱️',
      color: timeUtils.isWithinSLA(data.tempo_medio_atendimento) ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Primeira Resposta',
      value: data.tempo_primeira_resposta || '00:00:00',
      icon: '⚡',
      color: timeUtils.isWithinSLA(data.tempo_primeira_resposta, 2) ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Taxa de Abandono',
      value: `${data.taxa_abandono || 0}%`,
      icon: '📉',
      color: (data.taxa_abandono || 0) < 10 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Conversas Ativas',
      value: data.conversas_ativas || 0,
      icon: '💬',
      color: 'text-blue-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            </div>
            <div className="text-2xl">{metric.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}