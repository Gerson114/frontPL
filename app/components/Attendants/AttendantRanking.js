import { timeUtils } from '../../utils/time'

export const AttendantRanking = ({ atendentes }) => {
  if (!atendentes || atendentes.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Ranking de Atendentes</h3>
        <p className="text-gray-500 text-center py-8">Nenhum atendente ativo</p>
      </div>
    )
  }

  // Ordenar por satisfação e tempo de resposta
  const sortedAtendentes = [...atendentes].sort((a, b) => {
    const scoreA = (a.satisfacao || 0) * 10 - timeUtils.parseTimeToMinutes(a.tempo_medio_resposta || '00:00:00')
    const scoreB = (b.satisfacao || 0) * 10 - timeUtils.parseTimeToMinutes(b.tempo_medio_resposta || '00:00:00')
    return scoreB - scoreA
  })

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'online': return 'bg-green-500'
      case 'ocupado': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return `${index + 1}º`
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Ranking de Atendentes</h3>
      <div className="space-y-4">
        {sortedAtendentes.map((atendente, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="text-lg font-bold">{getRankIcon(index)}</div>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {atendente.nome?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(atendente.status)} rounded-full border-2 border-white`}></div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{atendente.nome}</p>
                <p className="text-sm text-gray-600">{atendente.total_atendimentos || 0} atendimentos</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Satisfação</p>
                  <p className={`font-bold ${timeUtils.getPerformanceColor((atendente.satisfacao || 0) * 20)}`}>
                    {(atendente.satisfacao || 0).toFixed(1)}⭐
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Tempo Resp.</p>
                  <p className={`font-bold text-sm ${timeUtils.isWithinSLA(atendente.tempo_medio_resposta, 2) ? 'text-green-600' : 'text-red-600'}`}>
                    {atendente.tempo_medio_resposta || '00:00:00'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}