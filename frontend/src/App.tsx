import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:5001'

interface EvaData {
  batt_time_left?: number
  oxy_pri_storage?: number
  oxy_sec_storage?: number
  oxy_pri_pressure?: number
  oxy_sec_pressure?: number
  oxy_time_left?: number
  heart_rate?: number
  oxy_consumption?: number
  co2_production?: number
  suit_pressure_oxy?: number
  suit_pressure_co2?: number
  suit_pressure_other?: number
  suit_pressure_total?: number
  fan_pri_rpm?: number
  fan_sec_rpm?: number
  helmet_pressure_co2?: number
  scrubber_a_co2_storage?: number
  scrubber_b_co2_storage?: number
  temperature?: number
  coolant_ml?: number
  coolant_gas_pressure?: number
  coolant_liquid_pressure?: number
}

interface TelemetryData {
  telemetry: {
    eva_time: number
    eva1: EvaData
    eva2: EvaData
  }
  local_timestamp?: string
  error?: string
}

function App() {
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })
    
    socket.on('connect', () => {
      console.log('Socket.IO connected')
    })

    socket.on('telemetry', (data: TelemetryData) => {
      setTelemetryData(data)
    })

    socket.on('error', (errorData: { error: string; local_timestamp?: string }) => {
      console.error('Error:', errorData.error)
    })

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected')
    })

    socket.on('connect_error', (error: Error) => {
      console.error('Connection error:', error)
    })

    socketRef.current = socket

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  const formatValue = (value: number | undefined): string => {
    if (value === undefined || value === null) return 'N/A'
    return typeof value === 'number' ? value.toFixed(2) : String(value)
  }

  const renderEvaData = (eva: EvaData | undefined, label: string) => {
    if (!eva) return <div><h2>{label}</h2><div>No data available</div></div>
    
    return (
      <div>
        <h2>{label}</h2>
        <div>Battery Time Left: {formatValue(eva.batt_time_left)}</div>
        <div>Oxygen Primary Storage: {formatValue(eva.oxy_pri_storage)}</div>
        <div>Oxygen Secondary Storage: {formatValue(eva.oxy_sec_storage)}</div>
        <div>Oxygen Primary Pressure: {formatValue(eva.oxy_pri_pressure)}</div>
        <div>Oxygen Secondary Pressure: {formatValue(eva.oxy_sec_pressure)}</div>
        <div>Oxygen Time Left: {eva.oxy_time_left ?? 'N/A'}</div>
        <div>Heart Rate: {formatValue(eva.heart_rate)}</div>
        <div>Oxygen Consumption: {formatValue(eva.oxy_consumption)}</div>
        <div>CO2 Production: {formatValue(eva.co2_production)}</div>
        <div>Suit Pressure O2: {formatValue(eva.suit_pressure_oxy)}</div>
        <div>Suit Pressure CO2: {formatValue(eva.suit_pressure_co2)}</div>
        <div>Suit Pressure Other: {formatValue(eva.suit_pressure_other)}</div>
        <div>Suit Pressure Total: {formatValue(eva.suit_pressure_total)}</div>
        <div>Fan Primary RPM: {formatValue(eva.fan_pri_rpm)}</div>
        <div>Fan Secondary RPM: {formatValue(eva.fan_sec_rpm)}</div>
        <div>Helmet Pressure CO2: {formatValue(eva.helmet_pressure_co2)}</div>
        <div>Scrubber A CO2 Storage: {formatValue(eva.scrubber_a_co2_storage)}</div>
        <div>Scrubber B CO2 Storage: {formatValue(eva.scrubber_b_co2_storage)}</div>
        <div>Temperature: {formatValue(eva.temperature)}</div>
        <div>Coolant ML: {formatValue(eva.coolant_ml)}</div>
        <div>Coolant Gas Pressure: {formatValue(eva.coolant_gas_pressure)}</div>
        <div>Coolant Liquid Pressure: {formatValue(eva.coolant_liquid_pressure)}</div>
      </div>
    )
  }

  return (
    <div>
      <h1>Telemetry Data</h1>
      {telemetryData?.telemetry ? (
        <div>
          <div>EVA Time: {telemetryData.telemetry.eva_time ?? 'N/A'}</div>
          {renderEvaData(telemetryData.telemetry.eva1, 'EVA1')}
          {renderEvaData(telemetryData.telemetry.eva2, 'EVA2')}
          {telemetryData.local_timestamp && (
            <div>Last Update: {telemetryData.local_timestamp}</div>
          )}
        </div>
      ) : (
        <div>Waiting for data...</div>
      )}
    </div>
  )
}

export default App
