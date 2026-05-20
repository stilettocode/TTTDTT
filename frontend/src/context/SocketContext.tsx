// context/SocketContext.tsx
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import type { RoverData, EvaData, LtvData, LtvErrorsData, MetricWarningAlert, MatrixUpdate } from '../types'

interface VoiceCaption {
  text: string
  ts: number
}

interface SocketContextType {
  roverData: RoverData | null
  evaData: EvaData | null
  ltvData: LtvData | null
  ltvErrorsData: LtvErrorsData | null
  metricWarnings: MetricWarningAlert[]
  matrixUpdate: MatrixUpdate | null
  voiceCaption: VoiceCaption | null
  sendVoiceString: (voiceString: string) => void
  sendCorvusPtt: () => void
}

const SocketContext = createContext<SocketContextType | null>(null)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [roverData, setRoverData] = useState<RoverData | null>(null)
  const [evaData, setEvaData] = useState<EvaData | null>(null)
  const [ltvData, setLtvData] = useState<LtvData | null>(null)
  const [ltvErrorsData, setLtvErrorsData] = useState<LtvErrorsData | null>(null)
  const [metricWarnings, setMetricWarnings] = useState<MetricWarningAlert[]>([])
  const [matrixUpdate, setMatrixUpdate] = useState<MatrixUpdate | null>(null)
  const [voiceCaption, setVoiceCaption] = useState<VoiceCaption | null>(null)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = io('http://localhost:5001', {
      transports: ['polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    socket.on('rover-telemetry', (data: RoverData) => setRoverData(data))
    socket.on('eva-telemetry', (data: EvaData) => setEvaData(data))
    socket.on('ltv-telemetry', (data: LtvData) => setLtvData(data))
    socket.on('ltv-errors-telemetry', (data: LtvErrorsData) => setLtvErrorsData(data))
    socket.on('matrix-update', (data: MatrixUpdate) => setMatrixUpdate(data))
    socket.on('voiceString', (text: unknown) => {
      setVoiceCaption({ text: String(text ?? ''), ts: Date.now() })
    })
    socket.on('metric-warning', (data: MetricWarningAlert | MetricWarningAlert[]) => {
      const incoming = Array.isArray(data) ? data : [data]
      const timestamped = incoming.map((alert) => ({
        ...alert,
        id: alert.id ?? `${Date.now()}-${Math.random()}`,
        local_timestamp: alert.local_timestamp ?? new Date().toISOString()
      }))

      setMetricWarnings((current) => [...timestamped, ...current].slice(0, 5))
    })

    socketRef.current = socket
    return () => { socket.disconnect() }
  }, [])

  const sendVoiceString = (voiceString: string) => {
    socketRef.current?.emit('voiceString', voiceString)
  }

  const sendCorvusPtt = () => {
    socketRef.current?.emit('corvus-ptt')
  }

  return (
    <SocketContext.Provider value={{
      roverData,
      evaData,
      ltvData,
      ltvErrorsData,
      metricWarnings,
      matrixUpdate,
      voiceCaption,
      sendVoiceString,
      sendCorvusPtt,
    }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) throw new Error('useSocket must be used within a SocketProvider')
  return context
}
