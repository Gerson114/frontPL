// Utilitários para manipulação de tempo
export const timeUtils = {
  // Filtros de tempo predefinidos
  getFilters: () => {
    const now = new Date()
    return {
      hoje: now.toISOString().split('T')[0],
      ontem: new Date(now.getTime() - 86400000).toISOString().split('T')[0],
      ultimos7dias: new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0],
      mesAtual: now.toISOString().slice(0, 7),
      mesAnterior: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7)
    }
  },

  // Formatar tempo de HH:MM:SS para minutos
  parseTimeToMinutes: (timeString) => {
    if (!timeString) return 0
    const [hours, minutes, seconds] = timeString.split(':').map(Number)
    return hours * 60 + minutes + seconds / 60
  },

  // Formatar minutos para HH:MM:SS
  formatMinutesToTime: (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    const secs = Math.floor((minutes % 1) * 60)
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  },

  // Calcular diferença de tempo
  getTimeDifference: (start, end) => {
    const startTime = new Date(start)
    const endTime = new Date(end)
    return Math.floor((endTime - startTime) / 1000 / 60) // em minutos
  },

  // Verificar se está dentro do SLA
  isWithinSLA: (responseTime, slaMinutes = 5) => {
    return timeUtils.parseTimeToMinutes(responseTime) <= slaMinutes
  },

  // Obter cor baseada na performance
  getPerformanceColor: (value, thresholds = { good: 80, warning: 60 }) => {
    if (value >= thresholds.good) return 'text-green-600'
    if (value >= thresholds.warning) return 'text-yellow-600'
    return 'text-red-600'
  }
}