import React from 'react'
import { useSocket } from '../context/SocketContext'
import astronaut from '../assets/astronaut.png'

// ── tiny inline SVG icons ──────────────────────────────────────────────
const IconBattery = ({ color = '#4a7adf' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="4" width="10" height="7" rx="2" stroke={color} strokeWidth="1" />
    <rect x="11" y="6" width="2" height="3" rx="1" fill={color} />
    <rect x="2" y="5" width="7" height="5" rx="1" fill={color} fillOpacity=".5" />
  </svg>
)

const IconO2 = ({ color = '#4a7adf' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5" stroke={color} strokeWidth="1" />
    <text x="7" y="10" textAnchor="middle" fill={color} fontSize="6" fontFamily="monospace">O₂</text>
  </svg>
)

const IconPressure = ({ color = '#3a5ab0' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M4 10 Q7 3 10 10" stroke={color} strokeWidth="1" />
    <line x1="4" y1="10" x2="10" y2="10" stroke={color} strokeWidth="1" />
  </svg>
)

const IconSuitPressure = ({ color = '#3a5ab0' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="3" y="4" width="8" height="8" rx="2" stroke={color} strokeWidth="1" />
    <line x1="7" y1="2" x2="7" y2="4" stroke={color} strokeWidth="1" />
    <line x1="5" y1="2" x2="9" y2="2" stroke={color} strokeWidth="1" />
  </svg>
)

const IconDroplet = ({ color = '#4a7adf' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 2 C4 5 4 9 7 12 C10 9 10 5 7 2Z" stroke={color} strokeWidth="1" />
  </svg>
)

const IconWave = ({ color = '#4a7adf' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7 Q5 4 7 7 Q9 10 11 7" stroke={color} strokeWidth="1" />
  </svg>
)

const IconFan = ({ color = '#4a7adf' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="2" stroke={color} strokeWidth="1" />
    <path
      d="M7 2 Q9 5 7 5 Q5 5 7 2Z M7 12 Q5 9 7 9 Q9 9 7 12Z M2 7 Q5 5 5 7 Q5 9 2 7Z M12 7 Q9 9 9 7 Q9 5 12 7Z"
      fill={color} fillOpacity=".6"
    />
  </svg>
)

const IconScrubber = ({ color = '#3a5ab0' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="4" width="10" height="6" rx="2" stroke={color} strokeWidth="1" />
    <line x1="5" y1="4" x2="5" y2="10" stroke={color} strokeWidth=".7" strokeOpacity=".5" />
    <line x1="8" y1="4" x2="8" y2="10" stroke={color} strokeWidth=".7" strokeOpacity=".5" />
  </svg>
)

const IconHeartRate = ({ color = '#7a4a7a' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M2 7 L4 7 L5 4 L6 10 L7 5 L8 9 L9 7 L12 7"
      stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
)

const IconConsump = ({ color = '#5a4a7a' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="4" stroke={color} strokeWidth="1" />
    <path d="M5 7 Q7 5 9 7" stroke={color} strokeWidth="1" />
  </svg>
)

const IconCO2Out = ({ color = '#5a4a4a' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="4" stroke={color} strokeWidth="1" />
    <path d="M5 7 Q7 9 9 7" stroke={color} strokeWidth="1" />
  </svg>
)

const IconTemp = ({ color = '#4a7adf' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5" stroke={color} strokeWidth="1" />
    <path d="M7 4v3l2 2" stroke={color} strokeWidth="1" strokeLinecap="round" />
  </svg>
)

// ── Improved IMU icons ─────────────────────────────────────────────────
const IconPosX = ({ color = '#4a7adf' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    {/* axes */}
    <line x1="2" y1="12" x2="12" y2="12" stroke={color} strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.6" />
    <line x1="2" y1="2" x2="2" y2="12" stroke={color} strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.6" />
    {/* X axis arrowhead */}
    <polyline points="10,10.5 12,12 10,13.5" stroke={color} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" />
    {/* dot on x-axis */}
    <circle cx="8" cy="12" r="1.4" fill={color} />
    {/* dashed line from origin to dot */}
    <line x1="2" y1="12" x2="8" y2="12" stroke={color} strokeWidth="0.7" strokeDasharray="1.5 1" strokeOpacity="0.45" />
  </svg>
)

const IconPosY = ({ color = '#4a7adf' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    {/* axes */}
    <line x1="2" y1="12" x2="12" y2="12" stroke={color} strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.6" />
    <line x1="2" y1="2" x2="2" y2="12" stroke={color} strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.6" />
    {/* Y axis arrowhead */}
    <polyline points="0.5,4 2,2 3.5,4" stroke={color} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" />
    {/* dot on y-axis */}
    <circle cx="2" cy="6" r="1.4" fill={color} />
    {/* dashed line from origin to dot */}
    <line x1="2" y1="12" x2="2" y2="6" stroke={color} strokeWidth="0.7" strokeDasharray="1.5 1" strokeOpacity="0.45" />
  </svg>
)

const IconCompass = ({ color = '#4a7adf', heading = 0 }: { color?: string; heading?: number }) => {
  const rad = (heading * Math.PI) / 180
  const nx = 7 + 3.5 * Math.sin(rad)
  const ny = 7 - 3.5 * Math.cos(rad)
  const sx = 7 - 2.2 * Math.sin(rad)
  const sy = 7 + 2.2 * Math.cos(rad)
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
      {/* Cardinal ticks */}
      <line x1="7" y1="1.5" x2="7" y2="3" stroke={color} strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.5" />
      <line x1="7" y1="11" x2="7" y2="12.5" stroke={color} strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.5" />
      <line x1="1.5" y1="7" x2="3" y2="7" stroke={color} strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.5" />
      <line x1="11" y1="7" x2="12.5" y2="7" stroke={color} strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.5" />
      {/* Needle */}
      <line x1={sx} y1={sy} x2={nx} y2={ny} stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7" cy="7" r="1" fill={color} />
    </svg>
  )
}

// ── shared sub-components ──────────────────────────────────────────────
const SectionLabel = ({ children, color }: { children: React.ReactNode; color?: string }) => (
  <div style={{
    fontSize: 9, letterSpacing: 3, color: color ?? '#7dd3fc',
    textTransform: 'uppercase', marginBottom: 4,
  }}>
    {children}
  </div>
)

const Divider = () => (
  <div style={{ height: 1, background: 'rgba(56,189,248,0.14)' }} />
)

interface MiniBarProps {
  icon: React.ReactNode
  label: string
  value: string
  pct: number
  fillColor?: string
  valueColor?: string
}

const MiniBar = ({ icon, label, value, pct, fillColor = '#2a2c48', valueColor }: MiniBarProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
    <div style={{
      width: 20, height: 20, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {icon}
    </div>
    <span style={{ fontSize: 10, color: valueColor ?? fillColor, width: 72, flexShrink: 0 }}>{label}</span>
    <div style={{ flex: 1, height: 3, background: '#0f172a', borderRadius: 2, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.35)' }}>
      <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: '100%', background: fillColor, borderRadius: 2, boxShadow: `0 0 4px ${fillColor}33` }} />
    </div>
    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: valueColor ?? fillColor, minWidth: 46, textAlign: 'right' }}>
      {value}
    </span>
  </div>
)

interface GaugeRowProps {
  icon: React.ReactNode
  label: string
  value: string
  pct: number
  fillColor?: string
  valueColor?: string
}

const GaugeRow = ({ icon, label, value, pct, fillColor = '#4a7adf', valueColor }: GaugeRowProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0 }}>
    <div style={{
      width: 22, height: 22, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 6, background: '#0f172a', border: '1px solid rgba(56,189,248,0.2)',
      boxShadow: '0 2px 12px rgba(56,189,248,0.08)',
    }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 9, letterSpacing: 2, color: valueColor ?? fillColor, textTransform: 'uppercase', marginBottom: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{label}</span>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: valueColor ?? fillColor }}>{value}</span>
      </div>
      <div style={{ height: 4, background: '#0f172a', borderRadius: 2, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.35)' }}>
        <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: '100%', background: fillColor, borderRadius: 2, boxShadow: `0 0 14px ${fillColor}33` }} />
      </div>
    </div>
  </div>
)

interface ToggleProps { label: string; on: boolean }
const Toggle = ({ label, on }: ToggleProps) => (
  <div style={{
    background: on ? 'rgba(34,197,94,0.18)' : 'rgba(248,113,113,0.16)',
    border: `1px solid ${on ? 'rgba(34,197,94,0.35)' : 'rgba(248,113,113,0.35)'}`,
    borderRadius: 8, padding: '8px 6px', textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
  }}>
    <div style={{ fontSize: 8, letterSpacing: 1, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 10, fontWeight: 700, color: on ? '#dcfce7' : '#fecaca' }}>{on ? 'ON' : 'OFF'}</div>
  </div>
)

interface AlertCardProps { title: string; sub: string; level?: 'danger' | 'warn' }
const AlertCard = ({ title, sub, level = 'danger' }: AlertCardProps) => (
  <div style={{
    background: level === 'danger' ? 'rgba(248,113,113,0.18)' : 'rgba(250,204,21,0.16)',
    border: `1px solid ${level === 'danger' ? 'rgba(248,113,113,0.35)' : 'rgba(250,204,21,0.32)'}`,
    borderLeft: `4px solid ${level === 'danger' ? '#f87171' : '#fde047'}`,
    borderRadius: 6, padding: '10px 12px', marginBottom: 8,
    boxShadow: level === 'danger' ? '0 4px 12px rgba(248,113,113,0.16)' : '0 4px 12px rgba(250,204,21,0.12)',
  }}>
    <div style={{ fontSize: 12, color: level === 'danger' ? '#fee2e2' : '#fef9c3', fontWeight: 600, marginBottom: 4 }}>{title}</div>
    <div style={{ fontSize: 11, color: '#cbd5e1' }}>{sub}</div>
  </div>
)

interface TaskItemProps { status: 'complete' | 'active' | 'upcoming'; name: string; sub?: string; pct: number }
const TaskItem = ({ status, name, sub, pct }: TaskItemProps) => {
  const statusColor = status === 'complete' ? '#7dd3fc' : status === 'active' ? '#38bdf8' : '#cbd5e1'
  const nameColor = status === 'complete' ? '#e2e8f0' : status === 'active' ? '#e2e8f0' : '#cbd5e1'
  const barColor = status === 'complete' ? '#38bdf8' : status === 'active' ? '#38bdf8' : '#64748b'
  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid #0e0f1c' }}>
      <div style={{ fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: statusColor, marginBottom: 3 }}>
        {status}
      </div>
      <div style={{ fontSize: 12, color: nameColor, marginBottom: sub ? 4 : 5, fontWeight: 500 }}>{name}</div>
      {sub && <div style={{ fontSize: 10, color: '#cbd5e1', marginBottom: 5 }}>{sub}</div>}
      <div style={{ height: 2, background: '#0f172a', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 2 }} />
      </div>
    </div>
  )
}

// ── column wrapper ─────────────────────────────────────────────────────
const Col = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    borderRight: '1px solid rgba(56,189,248,0.12)', padding: '10px 14px',
    display: 'flex', flexDirection: 'column', gap: 8, ...style,
    background: 'rgba(15, 23, 42, 0.92)',
    backdropFilter: 'blur(8px)',
    boxShadow: 'inset 0 0 0 1px rgba(56,189,248,0.05)',
    overflowY: 'auto',
  }}>
    {children}
  </div>
)

// ── ImuBox ─────────────────────────────────────────────────────────────
interface ImuBoxProps {
  label: string
  labelColor: string
  x: number
  y: number
  heading: number
}

const ImuBox = ({ label, labelColor, x, y, heading }: ImuBoxProps) => {
  const rows: Array<{ key: string; icon: React.ReactNode; val: string; sub: string }> = [
    {
      key: 'posx',
      icon: <IconPosX color={labelColor} />,
      val: x.toFixed(1),
      sub: 'X coord',
    },
    {
      key: 'posy',
      icon: <IconPosY color={labelColor} />,
      val: y.toFixed(1),
      sub: 'Y coord',
    },
    {
      key: 'hdg',
      icon: <IconCompass color={labelColor} heading={heading} />,
      val: `${heading.toFixed(1)}°`,
      sub: 'Heading',
    },
  ]

  return (
    <div style={{
      background: 'rgba(15,23,42,0.7)',
      border: `1px solid ${labelColor}28`,
      borderRadius: 8,
      padding: '6px 8px 5px',
      marginBottom: 2,
    }}>
      <div style={{
        fontSize: 8, letterSpacing: 3, color: labelColor,
        textTransform: 'uppercase', opacity: 0.7, marginBottom: 5,
      }}>
        IMU position
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {rows.map(({ key, icon, val, sub }) => (
          <div key={key} style={{
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {/* icon box */}
            <div style={{
              width: 20, height: 20, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 5,
              background: `${labelColor}12`,
              border: `1px solid ${labelColor}28`,
            }}>
              {icon}
            </div>

            {/* label */}
            <span style={{
              fontSize: 9, letterSpacing: 1.5,
              color: labelColor, opacity: 0.7,
              textTransform: 'uppercase',
              width: 52, flexShrink: 0,
            }}>
              {sub}
            </span>

            {/* value */}
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: 10,
              color: labelColor,
              marginLeft: 'auto',
              letterSpacing: 0.5,
            }}>
              {val}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════
export default function Eva1Page() {
  const { evaData } = useSocket()
  console.log('Eva1 page evaData', evaData)

  const defaultEva1 = {
    primary_battery_level: 0,
    secondary_battery_level: 0,
    oxy_pri_storage: 0,
    oxy_sec_storage: 0,
    oxy_pri_pressure: 0,
    oxy_sec_pressure: 0,
    suit_pressure_oxy: 0,
    suit_pressure_co2: 0,
    suit_pressure_other: 0,
    suit_pressure_total: 0,
    helmet_pressure_co2: 0,
    fan_pri_rpm: 0,
    fan_sec_rpm: 0,
    scrubber_a_co2_storage: 0,
    scrubber_b_co2_storage: 0,
    temperature: 0,
    coolant_storage: 0,
    coolant_gas_pressure: 0,
    coolant_liquid_pressure: 0,
    heart_rate: 0,
    oxy_consumption: 0,
    co2_production: 0,
    eva_elapsed_time: 0,
  }

  const defaultEva2 = {
    battery_level: 0,
    oxy_pri_storage: 0,
    oxy_sec_storage: 0,
    oxy_pri_pressure: 0,
    oxy_sec_pressure: 0,
    suit_pressure_oxy: 0,
    suit_pressure_co2: 0,
    suit_pressure_other: 0,
    suit_pressure_total: 0,
    helmet_pressure_co2: 0,
    fan_pri_rpm: 0,
    fan_sec_rpm: 0,
    scrubber_a_co2_storage: 0,
    scrubber_b_co2_storage: 0,
    temperature: 0,
    coolant_storage: 0,
    coolant_gas_pressure: 0,
    coolant_liquid_pressure: 0,
    heart_rate: 0,
    oxy_consumption: 0,
    co2_production: 0,
    eva_elapsed_time: 0,
  }

  const eva1 = ({ ...defaultEva1, ...(evaData?.telemetry.eva1 ?? {}) }) as typeof defaultEva1
  const eva2 = ({ ...defaultEva2, ...(evaData?.telemetry.eva2 ?? {}) }) as typeof defaultEva2
  const missionElapsed = evaData?.telemetry.eva1?.eva_elapsed_time ?? 0
  const missionRunning = evaData?.status?.started ?? false
  const missionLabel = missionRunning ? 'Active — EVA in progress' : 'Standby — Not started'
  const backendConnected = Boolean(evaData)
  const backendStatusLabel = backendConnected ? 'Backend connected' : 'Waiting for backend data'

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const dcu = {
    eva1: {
      oxy: evaData?.dcu?.eva1?.oxy ?? false,
      fan: evaData?.dcu?.eva1?.fan ?? false,
      pump: evaData?.dcu?.eva1?.pump ?? false,
      co2: evaData?.dcu?.eva1?.co2 ?? false,
      batt: {
        lu: evaData?.dcu?.eva1?.batt?.lu ?? false,
        ps: evaData?.dcu?.eva1?.batt?.ps ?? false,
      },
    },
    eva2: {
      batt: evaData?.dcu?.eva2?.batt ?? false,
      oxy: evaData?.dcu?.eva2?.oxy ?? false,
      comm: evaData?.dcu?.eva2?.comm ?? false,
      fan: evaData?.dcu?.eva2?.fan ?? false,
      pump: evaData?.dcu?.eva2?.pump ?? false,
      co2: evaData?.dcu?.eva2?.co2 ?? false,
    },
  }

  const uia = {
    eva1_power: evaData?.uia?.eva1_power ?? false,
    eva1_oxy: evaData?.uia?.eva1_oxy ?? false,
    eva1_water_supply: evaData?.uia?.eva1_water_supply ?? false,
    eva1_water_waste: evaData?.uia?.eva1_water_waste ?? false,
    eva2_power: evaData?.uia?.eva2_power ?? false,
    eva2_oxy: evaData?.uia?.eva2_oxy ?? false,
    eva2_water_supply: evaData?.uia?.eva2_water_supply ?? false,
    eva2_water_waste: evaData?.uia?.eva2_water_waste ?? false,
    oxy_vent: evaData?.uia?.oxy_vent ?? false,
    depress: evaData?.uia?.depress ?? false,
  }

  const imu = {
    eva1: {
      posx: evaData?.imu?.eva1?.posx ?? 0,
      posy: evaData?.imu?.eva1?.posy ?? 0,
      heading: evaData?.imu?.eva1?.heading ?? 0,
    },
    eva2: {
      posx: evaData?.imu?.eva2?.posx ?? 0,
      posy: evaData?.imu?.eva2?.posy ?? 0,
      heading: evaData?.imu?.eva2?.heading ?? 0,
    },
  }

  const error = {
    fan_error: evaData?.error?.fan_error ?? false,
    oxy_error: evaData?.error?.oxy_error ?? false,
    power_error: evaData?.error?.power_error ?? false,
    scrubber_error: evaData?.error?.scrubber_error ?? false,
  }

  // ── color tokens ──────────────────────────────────────────────────
  const blue = '#38BDF8'
  const blueDim = '#0EA5E9'
  const green = '#36E58C'
  const greenDim = '#1DBF73'

  // ── layout styles ─────────────────────────────────────────────────
  const shell: React.CSSProperties = {
    display: 'grid',
    width: '100vw',
    height: '100vh',
    gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(220px, 260px)',
    gridTemplateRows: 'auto 1fr',
    background: '#07101b',
    color: '#e2e8f0',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    overflow: 'hidden',
    boxSizing: 'border-box',
  }

  const topbar: React.CSSProperties = {
    gridColumn: '1 / -1',
    background: 'rgba(15, 20, 28, 0.97)',
    borderBottom: '1px solid rgba(56, 189, 248, 0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 1px 0 rgba(56,189,248,0.08)',
  }

  return (
    <div style={shell}>

      {/* ── top bar ────────────────────────────────────────────────── */}
      <div style={topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            background: '#0f172a', border: '1px solid rgba(56,189,248,0.22)', borderRadius: 4,
            padding: '4px 12px', fontSize: 10, letterSpacing: 3, color: '#cbd5e1', textTransform: 'uppercase',
          }}>
            ISS-EVA-047
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#8890b8', letterSpacing: 1 }}>
              Extravehicular Activity
            </div>
            <div style={{ fontSize: 10, color: backendConnected ? '#c8f9ff' : '#94a3b8', letterSpacing: 1, opacity: 0.95 }}>
              {backendStatusLabel}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 22, fontWeight: 300, color: '#c8cce0', letterSpacing: 4, textShadow: '0 0 10px rgba(56,189,248,0.5)' }}>
            {formatElapsedTime(missionElapsed)}
          </div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: '#8890b8', textTransform: 'uppercase', marginTop: 1 }}>
            mission elapsed
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          border: '1px solid #1a2a1a', borderRadius: 20, padding: '4px 14px',
          fontSize: 10, letterSpacing: 2, color: missionRunning ? '#4a8a5a' : '#4a6a4a',
        }}>
          <div style={{
            width: 5, height: 5, borderRadius: '50%', background: missionRunning ? '#4a8a5a' : '#5a5f76',
            animation: missionRunning ? 'pulse 2s infinite' : undefined,
          }} />
          {missionLabel}
        </div>
      </div>

      {/* ── EVA-1 column ───────────────────────────────────────────── */}
      <Col>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 9, letterSpacing: 3, color: blue, textTransform: 'uppercase' }}>Suit telemetry</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#c8f9ff', textShadow: '0 0 12px rgba(56,189,248,0.22)' }}>EVA-1</span>
        </div>

        {/* hero */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 90, flexShrink: 0, borderRadius: 18, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.22)', boxShadow: '0 0 20px rgba(56,189,248,0.14)' }}>
            <img src={astronaut} alt="EVA-1 astronaut" style={{ width: 72, objectFit: 'contain', filter: 'drop-shadow(0 0 14px rgba(56,189,248,0.45))' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <GaugeRow icon={<IconBattery color={blue} />} label="Primary battery" value={`${eva1.primary_battery_level.toFixed(0)}%`} pct={eva1.primary_battery_level} fillColor={blue} />
            <GaugeRow icon={<IconBattery color={blueDim} />} label="Secondary battery" value={`${eva1.secondary_battery_level.toFixed(0)}%`} pct={eva1.secondary_battery_level} fillColor={blue} />
            <GaugeRow icon={<IconTemp color={blue} />} label="Suit temp" value={`${eva1.temperature.toFixed(1)}°F`} pct={(eva1.temperature / 50) * 100} fillColor={blue} />
            <ImuBox
              label="EVA-1 IMU"
              labelColor={blue}
              x={imu.eva1.posx}
              y={imu.eva1.posy}
              heading={imu.eva1.heading}
            />
          </div>
        </div>

        <Divider />

        <div>
          <SectionLabel>Oxygen</SectionLabel>
          <MiniBar icon={<IconO2 color={blue} />} label="Pri storage" value={`${eva1.oxy_pri_storage.toFixed(0)}%`} pct={eva1.oxy_pri_storage} fillColor={blue} />
          <MiniBar icon={<IconO2 color={blueDim} />} label="Sec storage" value={`${eva1.oxy_sec_storage.toFixed(0)}%`} pct={eva1.oxy_sec_storage} fillColor={blue} />
          <MiniBar icon={<IconPressure color={blueDim} />} label="Pri pressure" value={`${eva1.oxy_pri_pressure.toFixed(1)} PSI`} pct={(eva1.oxy_pri_pressure / 1000) * 100} fillColor={blue} />
          <MiniBar icon={<IconPressure color={blueDim} />} label="Sec pressure" value={`${eva1.oxy_sec_pressure.toFixed(1)} PSI`} pct={(eva1.oxy_sec_pressure / 1000) * 100} fillColor={blue} />
          <MiniBar icon={<IconSuitPressure color={blueDim} />} label="Suit O₂ ps" value={`${eva1.suit_pressure_oxy.toFixed(1)} PSI`} pct={(eva1.suit_pressure_oxy / 5) * 100} fillColor={blue} />
        </div>

        <Divider />

        <div>
          <SectionLabel>Coolant</SectionLabel>
          <MiniBar icon={<IconDroplet color={blue} />} label="Storage" value={`${eva1.coolant_storage.toFixed(0)}%`} pct={eva1.coolant_storage} fillColor={blue} />
          <MiniBar icon={<IconWave color={blue} />} label="Liquid ps" value={`${eva1.coolant_liquid_pressure.toFixed(1)}`} pct={(eva1.coolant_liquid_pressure / 600) * 100} fillColor={blue} />
          <MiniBar icon={<IconDroplet color={blue} />} label="Gas ps" value={`${eva1.coolant_gas_pressure.toFixed(1)}`} pct={(eva1.coolant_gas_pressure / 100) * 100} fillColor={blue} />
        </div>

        <Divider />

        <div>
          <SectionLabel>Fans &amp; Scrubbers</SectionLabel>
          <MiniBar icon={<IconFan color={blue} />} label="Fan primary" value={`${(eva1.fan_pri_rpm / 1000).toFixed(0)}k`} pct={(eva1.fan_pri_rpm / 40000) * 100} fillColor={blue} />
          <MiniBar icon={<IconFan color={blue} />} label="Fan secondary" value={`${eva1.fan_sec_rpm.toFixed(0)}`} pct={(eva1.fan_sec_rpm / 40000) * 100} fillColor={blue} />
          <MiniBar icon={<IconScrubber color={blueDim} />} label="Scrubber A" value={`${eva1.scrubber_a_co2_storage.toFixed(0)}%`} pct={eva1.scrubber_a_co2_storage} fillColor={blue} />
          <MiniBar icon={<IconScrubber color={blueDim} />} label="Scrubber B" value={`${eva1.scrubber_b_co2_storage.toFixed(0)}%`} pct={eva1.scrubber_b_co2_storage} fillColor={blue} />
        </div>

        <Divider />

        <div>
          <SectionLabel>Biometrics</SectionLabel>
          <MiniBar icon={<IconHeartRate color={blue} />} label="Heart rate" value={`${eva1.heart_rate.toFixed(0)} bpm`} pct={(eva1.heart_rate / 200) * 100} fillColor={blue} />
          <MiniBar icon={<IconConsump color={blue} />} label="O₂ consump" value={`${eva1.oxy_consumption.toFixed(2)}`} pct={(eva1.oxy_consumption / 10) * 100} fillColor={blue} />
          <MiniBar icon={<IconCO2Out color={blue} />} label="CO₂ prod" value={`${eva1.co2_production.toFixed(2)}`} pct={(eva1.co2_production / 10) * 100} fillColor={blue} />
        </div>
      </Col>

      {/* ── EVA-2 column ───────────────────────────────────────────── */}
      <Col>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 9, letterSpacing: 3, color: green, textTransform: 'uppercase' }}>Suit telemetry</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#d8fff0', textShadow: '0 0 12px rgba(56,189,248,0.18)' }}>EVA-2</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 90, flexShrink: 0, borderRadius: 18, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(52,211,147,0.08)', border: '1px solid rgba(52,211,147,0.22)', boxShadow: '0 0 20px rgba(52,211,147,0.14)' }}>
            <img src={astronaut} alt="EVA-2 astronaut" style={{ width: 72, objectFit: 'contain', filter: 'drop-shadow(0 0 14px rgba(52,211,147,0.45))' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <GaugeRow icon={<IconBattery color={green} />} label="Primary battery" value={`${eva2.battery_level.toFixed(0)}%`} pct={eva2.battery_level} fillColor={green} />
            <GaugeRow icon={<IconBattery color={greenDim} />} label="Secondary battery" value={`${eva2.battery_level.toFixed(0)}%`} pct={eva2.battery_level} fillColor={green} />
            <GaugeRow icon={<IconTemp color={green} />} label="Suit temp" value={`${eva2.temperature.toFixed(1)}°F`} pct={(eva2.temperature / 50) * 100} fillColor={green} />
            <ImuBox
              label="EVA-2 IMU"
              labelColor={green}
              x={imu.eva2.posx}
              y={imu.eva2.posy}
              heading={imu.eva2.heading}
            />
          </div>
        </div>

        <Divider />

        <div>
          <SectionLabel color={green}>Oxygen</SectionLabel>
          <MiniBar icon={<IconO2 color={green} />} label="Pri storage" value={`${eva2.oxy_pri_storage.toFixed(0)}%`} pct={eva2.oxy_pri_storage} fillColor={green} />
          <MiniBar icon={<IconO2 color={greenDim} />} label="Sec storage" value={`${eva2.oxy_sec_storage.toFixed(0)}%`} pct={eva2.oxy_sec_storage} fillColor={green} />
          <MiniBar icon={<IconPressure color={greenDim} />} label="Pri pressure" value={`${eva2.oxy_pri_pressure.toFixed(1)} PSI`} pct={(eva2.oxy_pri_pressure / 1000) * 100} fillColor={green} />
          <MiniBar icon={<IconPressure color={greenDim} />} label="Sec pressure" value={`${eva2.oxy_sec_pressure.toFixed(1)} PSI`} pct={(eva2.oxy_sec_pressure / 1000) * 100} fillColor={green} />
          <MiniBar icon={<IconSuitPressure color={greenDim} />} label="Suit O₂ ps" value={`${eva2.suit_pressure_oxy.toFixed(1)} PSI`} pct={(eva2.suit_pressure_oxy / 5) * 100} fillColor={green} />
        </div>

        <Divider />

        <div>
          <SectionLabel color={green}>Coolant</SectionLabel>
          <MiniBar icon={<IconDroplet color={green} />} label="Storage" value={`${eva2.coolant_storage.toFixed(0)}%`} pct={eva2.coolant_storage} fillColor={green} />
          <MiniBar icon={<IconWave color={green} />} label="Liquid ps" value={`${eva2.coolant_liquid_pressure.toFixed(1)}`} pct={(eva2.coolant_liquid_pressure / 600) * 100} fillColor={green} />
          <MiniBar icon={<IconDroplet color={green} />} label="Gas ps" value={`${eva2.coolant_gas_pressure.toFixed(1)}`} pct={(eva2.coolant_gas_pressure / 100) * 100} fillColor={green} />
        </div>

        <Divider />

        <div>
          <SectionLabel color={green}>Fans &amp; Scrubbers</SectionLabel>
          <MiniBar icon={<IconFan color={green} />} label="Fan primary" value={`${(eva2.fan_pri_rpm / 1000).toFixed(0)}k`} pct={(eva2.fan_pri_rpm / 40000) * 100} fillColor={green} />
          <MiniBar icon={<IconFan color={green} />} label="Fan secondary" value={`${eva2.fan_sec_rpm.toFixed(0)}`} pct={(eva2.fan_sec_rpm / 40000) * 100} fillColor={green} />
          <MiniBar icon={<IconScrubber color={greenDim} />} label="Scrubber A" value={`${eva2.scrubber_a_co2_storage.toFixed(0)}%`} pct={eva2.scrubber_a_co2_storage} fillColor={green} />
          <MiniBar icon={<IconScrubber color={greenDim} />} label="Scrubber B" value={`${eva2.scrubber_b_co2_storage.toFixed(0)}%`} pct={eva2.scrubber_b_co2_storage} fillColor={green} />
        </div>

        <Divider />

        <div>
          <SectionLabel color={green}>Biometrics</SectionLabel>
          <MiniBar icon={<IconHeartRate color={green} />} label="Heart rate" value={`${eva2.heart_rate.toFixed(0)} bpm`} pct={(eva2.heart_rate / 200) * 100} fillColor={green} />
          <MiniBar icon={<IconConsump color={green} />} label="O₂ consump" value={`${eva2.oxy_consumption.toFixed(2)}`} pct={(eva2.oxy_consumption / 10) * 100} fillColor={green} />
          <MiniBar icon={<IconCO2Out color={green} />} label="CO₂ prod" value={`${eva2.co2_production.toFixed(2)}`} pct={(eva2.co2_production / 10) * 100} fillColor={green} />
        </div>
      </Col>

      {/* ── Systems column ─────────────────────────────────────────── */}
      <Col style={{ borderLeft: '1px solid #0e0f1c' }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#8890b8', textTransform: 'uppercase' }}>
          Systems &amp; Control
        </div>

        <div>
          <SectionLabel>DCU — EVA-1</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5 }}>
            <Toggle label="OXY" on={dcu.eva1.oxy} />
            <Toggle label="FAN" on={dcu.eva1.fan} />
            <Toggle label="PUMP" on={dcu.eva1.pump} />
            <Toggle label="CO₂" on={dcu.eva1.co2} />
            <Toggle label="BATT LU" on={dcu.eva1.batt.lu} />
            <Toggle label="BATT PS" on={dcu.eva1.batt.ps} />
          </div>
        </div>

        <div>
          <SectionLabel>DCU — EVA-2</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5 }}>
            <Toggle label="BATT" on={dcu.eva2.batt} />
            <Toggle label="OXY" on={dcu.eva2.oxy} />
            <Toggle label="COMM" on={dcu.eva2.comm} />
            <Toggle label="FAN" on={dcu.eva2.fan} />
            <Toggle label="PUMP" on={dcu.eva2.pump} />
            <Toggle label="CO₂" on={dcu.eva2.co2} />
          </div>
        </div>

        <div>
          <SectionLabel>UIA Switches</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
            <Toggle label="EVA1 PWR" on={uia.eva1_power} />
            <Toggle label="EVA2 PWR" on={uia.eva2_power} />
            <Toggle label="EVA1 OXY" on={uia.eva1_oxy} />
            <Toggle label="EVA2 OXY" on={uia.eva2_oxy} />
            <Toggle label="H₂O SUP 1" on={uia.eva1_water_supply} />
            <Toggle label="H₂O SUP 2" on={uia.eva2_water_supply} />
            <Toggle label="H₂O WST 1" on={uia.eva1_water_waste} />
            <Toggle label="H₂O WST 2" on={uia.eva2_water_waste} />
            <Toggle label="OXY VENT" on={uia.oxy_vent} />
            <Toggle label="DEPRESS" on={uia.depress} />
          </div>
        </div>

        <div>
          <SectionLabel>Errors</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5 }}>
            <Toggle label="FAN" on={!error.fan_error} />
            <Toggle label="OXY" on={!error.oxy_error} />
            <Toggle label="POWER" on={!error.power_error} />
            <Toggle label="SCRUB" on={!error.scrubber_error} />
          </div>
        </div>
      </Col>

      {/* ── Alerts + Tasks column ──────────────────────────────────── */}
      <Col style={{ borderLeft: '1px solid #0e0f1c' }}>
        <div style={{
          fontSize: 9, letterSpacing: 3, color: '#7dd3fc', textTransform: 'uppercase',
          background: 'rgba(56,189,248,0.07)', padding: '10px 12px', borderRadius: 8,
          border: '1px solid rgba(56,189,248,0.16)',
        }}>
          Caution &amp; Tasks
        </div>

        <div>
          <SectionLabel color="#38bdf8">Active alerts</SectionLabel>
          <AlertCard title="EVA-2 coolant critical" sub="Storage at 0% — immediate action" level="danger" />
          <AlertCard title="EVA-2 fan offline" sub="Primary fan RPM = 0" level="warn" />
          <AlertCard title="EVA-2 DCU standby" sub="All switches off — verify checklist" level="warn" />
        </div>

        <Divider />

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <SectionLabel>Mission tasks</SectionLabel>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#e2e8f0' }}>2 / 4</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ flex: 1, height: 2, background: '#0f172a', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: '65%', height: '100%', background: '#38bdf8', borderRadius: 2, boxShadow: '0 0 10px rgba(56,189,248,0.35)' }} />
            </div>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#e2e8f0' }}>65%</span>
          </div>

          <TaskItem status="complete" name="Pre-EVA suit check" pct={100} />
          <TaskItem status="active" name="Travel to Zone B" sub="Lunar surface · 40% complete" pct={40} />
          <TaskItem status="upcoming" name="Sample collection" sub="Zone B — regolith core" pct={0} />
          <TaskItem status="upcoming" name="Return to airlock" sub="Zone B → Airlock Alpha" pct={0} />

          <button style={{
            marginTop: 12, width: '100%', background: '#0f172a',
            border: '1px solid rgba(56,189,248,0.24)', borderRadius: 5,
            color: '#e2e8f0', padding: 8, fontSize: 10,
            letterSpacing: 2, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            boxShadow: '0 2px 8px rgba(56,189,248,0.12)',
          }}>
            + new task
          </button>
        </div>
      </Col>

    </div>
  )
}
