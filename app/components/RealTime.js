import { useState, useEffect } from 'react'

export const RealTimeTimer = ({ startTime, isActive = true }) => {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!isActive || !startTime) return

    const interval = setInterval(() => {
      const now = new Date()
      const start = new Date(startTime)
      const diff = Math.floor((now - start) / 1000)
      setElapsed(diff)
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, isActive])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getColorClass = () => {
    if (elapsed < 300) return 'text-green-600' // < 5 min
    if (elapsed < 900) return 'text-yellow-600' // < 15 min
    return 'text-red-600' // > 15 min
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
      <span className={`font-mono text-sm font-bold ${getColorClass()}`}>
        {formatTime(elapsed)}
      </span>
    </div>
  )
}

export const QueueStatus = ({ filaEspera }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
      <h4 className="font-semibold text-gray-900 mb-2">Fila de Espera</h4>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-orange-600">{filaEspera?.total || 0}</p>
          <p className="text-xs text-gray-500">pessoas aguardando</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-700">{filaEspera?.tempo_medio || '00:00'}</p>
          <p className="text-xs text-gray-500">tempo médio</p>
        </div>
      </div>
    </div>
  )
}