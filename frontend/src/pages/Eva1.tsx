import React from 'react'
import { useSocket } from '../context/SocketContext'

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

// ── spacesuit SVG ──────────────────────────────────────────────────────
const SpaceSuit = ({ variant }: { variant: 'eva1' | 'eva2' }) => {
  const isEva2 = variant === 'eva2'
  const bodyFill = isEva2 ? '#0f1a12' : '#11131e'
  const bodyStroke = isEva2 ? '#1a2e1e' : '#1e2240'
  const innerFill = isEva2 ? '#0a1a0d' : '#0a0d1a'
  const innerStroke = isEva2 ? '#1e4028' : '#2a3060'
  const panelFill = isEva2 ? '#0c150e' : '#0d0f1c'
  const panelStroke = isEva2 ? '#162014' : '#1a1d38'
  const dotColor = isEva2 ? '#4aaf7a' : '#4a7adf'
  const barColor = isEva2 ? '#4aaf7a' : '#4a7adf'
  const ringColor = isEva2 ? '#4aaf7a' : '#4a7adf'
  const unitLabel = isEva2 ? 'UNIT 2' : 'UNIT 1'
  const unitColor = isEva2 ? '#1a4a2a' : '#2a3a7a'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
      <svg width="80" height="130" viewBox="0 0 80 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* helmet */}
        <ellipse cx="40" cy="18" rx="14" ry="15" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <ellipse cx="40" cy="17" rx="9" ry="10" fill={innerFill} stroke={innerStroke} strokeWidth="1" />
        <ellipse cx="40" cy="16" rx="6" ry="7" fill={innerFill} fillOpacity=".8" />
        {/* torso */}
        <rect x="20" y="30" width="40" height="48" rx="12" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <rect x="23" y="35" width="34" height="36" rx="9" fill={panelFill} stroke={panelStroke} strokeWidth="1" />
        {/* chest panel */}
        <rect x="28" y="40" width="24" height="12" rx="4" fill={innerFill} stroke={innerStroke} strokeWidth=".8" />
        <circle cx="31" cy="46" r="2.5" fill={isEva2 ? '#1e4030' : '#1e3060'} />
        <circle cx="31" cy="46" r="1.5" fill={dotColor} fillOpacity=".7" />
        <circle cx="40" cy="46" r="2.5" fill={isEva2 ? '#1e4030' : '#1e3060'} />
        <circle cx="40" cy="46" r="1.5" fill={dotColor} fillOpacity=".5" />
        <circle cx="49" cy="46" r="2.5" fill={isEva2 ? '#1e4030' : '#1e3060'} />
        <circle cx="49" cy="46" r="1.5" fill={dotColor} fillOpacity=".3" />
        {/* chest bars */}
        <rect x="29" y="57" width="22" height="3" rx="1.5" fill={panelStroke} />
        <rect x="29" y="57" width="22" height="3" rx="1.5" fill={barColor} fillOpacity=".4" />
        <rect x="29" y="62" width={isEva2 ? '10' : '14'} height="3" rx="1.5" fill={panelStroke} />
        <rect x="29" y="62" width={isEva2 ? '10' : '14'} height="3" rx="1.5"
          fill={isEva2 ? '#c44a4a' : barColor} fillOpacity=".4" />
        {/* arms */}
        <rect x="8" y="32" width="14" height="36" rx="7" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <rect x="10" y="38" width="10" height="20" rx="5" fill={panelFill} />
        <rect x="58" y="32" width="14" height="36" rx="7" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <rect x="60" y="38" width="10" height="20" rx="5" fill={panelFill} />
        {/* legs */}
        <rect x="26" y="76" width="12" height="30" rx="6" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <rect x="42" y="76" width="12" height="30" rx="6" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        {/* boots */}
        <rect x="28" y="102" width="8" height="12" rx="4" fill={panelFill} stroke={panelStroke} strokeWidth="1" />
        <rect x="44" y="102" width="8" height="12" rx="4" fill={panelFill} stroke={panelStroke} strokeWidth="1" />
        {/* halo ring */}
        <circle cx="40" cy="55" r="20" stroke={ringColor} strokeWidth=".5" strokeOpacity=".15" />
        {/* EVA-2 warning indicator */}
        {isEva2 && (
          <>
            <circle cx="13" cy="52" r="3" fill="#c44a4a" fillOpacity=".5" />
            <circle cx="13" cy="52" r="1.5" fill="#c44a4a" />
          </>
        )}
      </svg>
      <span style={{ fontSize: 10, letterSpacing: 2, color: unitColor, textTransform: 'uppercase' as const }}>
        {unitLabel}
      </span>
    </div>
  )
}

// ── shared sub-components ──────────────────────────────────────────────
const SectionLabel = ({ children, color }: { children: React.ReactNode; color?: string }) => (
  <div style={{
    fontSize: 9, letterSpacing: 3, color: color ?? '#2e3050',
    textTransform: 'uppercase', marginBottom: 8,
  }}>
    {children}
  </div>
)

const Divider = () => (
  <div style={{ height: 1, background: '#0e0f1c' }} />
)

interface MiniBarProps {
  icon: React.ReactNode
  label: string
  value: string
  pct: number
  fillColor?: string
  valueColor?: string
}

const MiniBar = ({ icon, label, value, pct, fillColor = '#2a2c48', valueColor = '#3a3c58' }: MiniBarProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
    <div style={{
      width: 20, height: 20, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {icon}
    </div>
    <span style={{ fontSize: 10, color: '#3a3c58', width: 72, flexShrink: 0 }}>{label}</span>
    <div style={{ flex: 1, height: 3, background: '#0d0e1a', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: '100%', background: fillColor, borderRadius: 2 }} />
    </div>
    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: valueColor, minWidth: 46, textAlign: 'right' }}>
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
      width: 28, height: 28, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 6, background: '#0d0e1a', border: '1px solid #14152a',
    }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 9, letterSpacing: 2, color: '#2e3050', textTransform: 'uppercase', marginBottom: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{label}</span>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: valueColor ?? fillColor }}>{value}</span>
      </div>
      <div style={{ height: 4, background: '#0d0e1a', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: '100%', background: fillColor, borderRadius: 2 }} />
      </div>
    </div>
  </div>
)

interface ToggleProps { label: string; on: boolean }
const Toggle = ({ label, on }: ToggleProps) => (
  <div style={{
    background: '#0a0b14', border: '1px solid #12131f',
    borderRadius: 5, padding: '6px 4px', textAlign: 'center',
  }}>
    <div style={{ fontSize: 8, letterSpacing: 1, color: '#2e3050', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
    <div style={{ fontSize: 9, fontWeight: 500, color: on ? '#4a8a5a' : '#7a3a3a' }}>{on ? 'ON' : 'OFF'}</div>
  </div>
)

interface AlertCardProps { title: string; sub: string; level?: 'danger' | 'warn' }
const AlertCard = ({ title, sub, level = 'danger' }: AlertCardProps) => (
  <div style={{
    background: level === 'danger' ? '#0f0a0a' : '#0f0c08',
    border: `1px solid ${level === 'danger' ? '#1e1010' : '#1e1608'}`,
    borderLeft: `2px solid ${level === 'danger' ? '#7a2a2a' : '#7a5a1a'}`,
    borderRadius: 4, padding: '8px 10px', marginBottom: 6,
  }}>
    <div style={{ fontSize: 11, color: level === 'danger' ? '#b07070' : '#a08050', fontWeight: 500, marginBottom: 2 }}>{title}</div>
    <div style={{ fontSize: 10, color: '#3a3050' }}>{sub}</div>
  </div>
)

interface TaskItemProps { status: 'complete' | 'active' | 'upcoming'; name: string; sub?: string; pct: number }
const TaskItem = ({ status, name, sub, pct }: TaskItemProps) => {
  const statusColor = status === 'complete' ? '#3a6a4a' : status === 'active' ? '#4a4a8a' : '#2e3050'
  const nameColor = status === 'complete' ? '#4a6a5a' : status === 'active' ? '#8890b8' : '#2e3060'
  const barColor = status === 'complete' ? '#2a4a3a' : '#3a3a7a'
  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid #0e0f1c' }}>
      <div style={{ fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: statusColor, marginBottom: 3 }}>
        {status}
      </div>
      <div style={{ fontSize: 12, color: nameColor, marginBottom: sub ? 4 : 5, fontWeight: 500 }}>{name}</div>
      {sub && <div style={{ fontSize: 10, color: '#2e3050', marginBottom: 5 }}>{sub}</div>}
      <div style={{ height: 2, background: '#0d0e1a', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 2 }} />
      </div>
    </div>
  )
}

// ── column wrapper ─────────────────────────────────────────────────────
const Col = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    borderRight: '1px solid #0e0f1c', padding: '18px 16px',
    display: 'flex', flexDirection: 'column', gap: 14, ...style,
  }}>
    {children}
  </div>
)

// ── ImuBox ─────────────────────────────────────────────────────────────
const ImuBox = ({ label, labelColor, x, y, heading }: {
  label: string; labelColor: string; x: number; y: number; heading: number
}) => (
  <div style={{
    background: '#0a0b14', border: '1px solid #12131f',
    borderRadius: 5, padding: '8px 10px', marginBottom: 6,
  }}>
    <div style={{ fontSize: 8, letterSpacing: 2, color: labelColor, marginBottom: 5, textTransform: 'uppercase' as const }}>{label}</div>
    {[['POS X', x.toFixed(3)], ['POS Y', y.toFixed(3)], ['HEADING', `${heading}°`]].map(([k, v]) => (
      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
        <span style={{ fontSize: 9, color: '#2a2c48' }}>{k}</span>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#5a5c80' }}>{v}</span>
      </div>
    ))}
  </div>
)

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
const blue = '#4DA3FF'
const blueDim = '#2D7DFF'
const green = '#36E58C'
const greenDim = '#1DBF73'
const warn = '#FFB84D'
const danger = '#FF5A5A'
const dim = '#4B5275'

  // ── layout styles ─────────────────────────────────────────────────
  const shell: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 230px',
    gridTemplateRows: '52px 1fr',
    minHeight: '100vh',
    background: '#070810',
    color: '#c8cce0',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
  }

  const topbar: React.CSSProperties = {
    gridColumn: '1 / -1',
    background: '#070810',
    borderBottom: '1px solid #12131f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
  }

  return (
    <div style={shell}>

      {/* ── top bar ────────────────────────────────────────────────── */}
      <div style={topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            background: '#0d0e1a', border: '1px solid #1a1b2e', borderRadius: 4,
            padding: '4px 12px', fontSize: 10, letterSpacing: 3, color: '#3a3c58', textTransform: 'uppercase',
          }}>
            ISS-EVA-047
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#8890b8', letterSpacing: 1 }}>
            Extravehicular Activity
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 22, fontWeight: 300, color: '#c8cce0', letterSpacing: 4 }}>
            {formatElapsedTime(missionElapsed)}
          </div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: '#2e3050', textTransform: 'uppercase', marginTop: 1 }}>
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 9, letterSpacing: 3, color: '#2e3050', textTransform: 'uppercase' }}>Suit telemetry</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: blue }}>EVA-1</span>
        </div>        <div style={{ fontSize: 10, color: backendConnected ? '#4a8a5a' : '#7a6a6a', marginBottom: 10 }}>
          {backendStatusLabel}
        </div>
        {/* hero */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <SpaceSuit variant="eva1" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <GaugeRow icon={<IconBattery color={blue} />} label="Primary battery" value={`${eva1.primary_battery_level}%`} pct={eva1.primary_battery_level} fillColor={blue} />
            <GaugeRow icon={<IconBattery color={blueDim} />} label="Secondary battery" value={`${eva1.secondary_battery_level}%`} pct={eva1.secondary_battery_level} fillColor={blue} />
            <GaugeRow icon={<IconTemp color={blue} />} label="Suit temp" value={`${eva1.temperature.toFixed(1)}°F`} pct={(eva1.temperature / 50) * 100} fillColor={blue} />
          </div>
        </div>

        <Divider />

        <div>
          <SectionLabel>Oxygen</SectionLabel>
          <MiniBar icon={<IconO2 color={blue} />} label="Pri storage" value={`${eva1.oxy_pri_storage}%`} pct={eva1.oxy_pri_storage} fillColor={blue} valueColor={blue} />
          <MiniBar icon={<IconO2 color={blueDim} />} label="Sec storage" value={`${eva1.oxy_sec_storage}%`} pct={eva1.oxy_sec_storage} fillColor={blue} valueColor={blue} />
          <MiniBar icon={<IconPressure color={blueDim} />} label="Pri pressure" value={`${eva1.oxy_pri_pressure} PSI`} pct={(eva1.oxy_pri_pressure / 1000) * 100} fillColor={dim} />
          <MiniBar icon={<IconPressure color={blueDim} />} label="Sec pressure" value={`${eva1.oxy_sec_pressure} PSI`} pct={(eva1.oxy_sec_pressure / 1000) * 100} fillColor={dim} />
          <MiniBar icon={<IconSuitPressure color={blueDim} />} label="Suit O₂ ps" value={`${eva1.suit_pressure_oxy} PSI`} pct={(eva1.suit_pressure_oxy / 5) * 100} fillColor={blue} valueColor={blue} />
        </div>

        <Divider />

        <div>
          <SectionLabel>Coolant</SectionLabel>
          <MiniBar icon={<IconDroplet color={blue} />} label="Storage" value={`${eva1.coolant_storage}%`} pct={eva1.coolant_storage} fillColor={blue} valueColor={blue} />
          <MiniBar icon={<IconWave color={blue} />} label="Liquid ps" value={`${eva1.coolant_liquid_pressure}`} pct={(eva1.coolant_liquid_pressure / 600) * 100} fillColor={blue} valueColor={blue} />
          <MiniBar icon={<IconDroplet color={dim} />} label="Gas ps" value={`${eva1.coolant_gas_pressure}`} pct={(eva1.coolant_gas_pressure / 100) * 100} fillColor={dim} />
        </div>

        <Divider />

        <div>
          <SectionLabel>Fans &amp; Scrubbers</SectionLabel>
          <MiniBar icon={<IconFan color={blue} />} label="Fan primary" value={`${(eva1.fan_pri_rpm / 1000).toFixed(0)}k`} pct={(eva1.fan_pri_rpm / 40000) * 100} fillColor={blue} valueColor={blue} />
          <MiniBar icon={<IconFan color={dim} />} label="Fan secondary" value={`${eva1.fan_sec_rpm}`} pct={(eva1.fan_sec_rpm / 40000) * 100} fillColor={dim} />
          <MiniBar icon={<IconScrubber color={blueDim} />} label="Scrubber A" value={`${eva1.scrubber_a_co2_storage}%`} pct={eva1.scrubber_a_co2_storage} fillColor={dim} />
          <MiniBar icon={<IconScrubber color={blueDim} />} label="Scrubber B" value={`${eva1.scrubber_b_co2_storage}%`} pct={eva1.scrubber_b_co2_storage} fillColor={dim} />
        </div>

        <Divider />

        <div>
          <SectionLabel>Biometrics</SectionLabel>
          <MiniBar icon={<IconHeartRate />} label="Heart rate" value={`${eva1.heart_rate} bpm`} pct={(eva1.heart_rate / 200) * 100} fillColor="#7a4a7a" />
          <MiniBar icon={<IconConsump />} label="O₂ consump" value={`${eva1.oxy_consumption}`} pct={(eva1.oxy_consumption / 10) * 100} fillColor={dim} />
          <MiniBar icon={<IconCO2Out />} label="CO₂ prod" value={`${eva1.co2_production}`} pct={(eva1.co2_production / 10) * 100} fillColor={dim} />
        </div>
      </Col>

      {/* ── EVA-2 column ───────────────────────────────────────────── */}
      <Col>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 9, letterSpacing: 3, color: '#2e3050', textTransform: 'uppercase' }}>Suit telemetry</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: green }}>EVA-2</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <SpaceSuit variant="eva2" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <GaugeRow icon={<IconBattery color={green} />} label="Battery" value={`${eva2.battery_level}%`} pct={eva2.battery_level} fillColor={green} />
            <GaugeRow icon={<IconDroplet color={danger} />} label="Coolant storage" value={`${eva2.coolant_storage}%`} pct={eva2.coolant_storage} fillColor={danger} valueColor={danger} />
            <GaugeRow icon={<IconTemp color={green} />} label="Suit temp" value={`${eva2.temperature.toFixed(1)}°F`} pct={(eva2.temperature / 50) * 100} fillColor={green} />
          </div>
        </div>

        <Divider />

        <div>
          <SectionLabel>Oxygen</SectionLabel>
          <MiniBar icon={<IconO2 color={green} />} label="Pri storage" value={`${eva2.oxy_pri_storage}%`} pct={eva2.oxy_pri_storage} fillColor={green} valueColor={green} />
          <MiniBar icon={<IconO2 color={greenDim} />} label="Sec storage" value={`${eva2.oxy_sec_storage}%`} pct={eva2.oxy_sec_storage} fillColor={green} valueColor={green} />
          <MiniBar icon={<IconPressure color={greenDim} />} label="Pri pressure" value={`${eva2.oxy_pri_pressure} PSI`} pct={(eva2.oxy_pri_pressure / 1000) * 100} fillColor={dim} />
          <MiniBar icon={<IconPressure color={greenDim} />} label="Sec pressure" value={`${eva2.oxy_sec_pressure} PSI`} pct={(eva2.oxy_sec_pressure / 1000) * 100} fillColor={dim} />
          <MiniBar icon={<IconSuitPressure color={greenDim} />} label="Suit O₂ ps" value={`${eva2.suit_pressure_oxy} PSI`} pct={(eva2.suit_pressure_oxy / 5) * 100} fillColor={green} valueColor={green} />
          <MiniBar icon={<IconCO2Out color={warn} />} label="Suit CO₂" value={`${eva2.suit_pressure_co2.toFixed(2)}`} pct={(eva2.suit_pressure_co2 / 0.5) * 100} fillColor={warn} valueColor={warn} />
        </div>

        <Divider />

        <div>
          <SectionLabel>Coolant</SectionLabel>
          <MiniBar icon={<IconDroplet color={danger} />} label="Storage" value={`${eva2.coolant_storage}%`} pct={eva2.coolant_storage} fillColor={danger} valueColor={danger} />
          <MiniBar icon={<IconWave color={green} />} label="Liquid ps" value={`${eva2.coolant_liquid_pressure}`} pct={(eva2.coolant_liquid_pressure / 600) * 100} fillColor={green} valueColor={green} />
          <MiniBar icon={<IconDroplet color={dim} />} label="Gas ps" value={`${eva2.coolant_gas_pressure}`} pct={(eva2.coolant_gas_pressure / 100) * 100} fillColor={dim} />
        </div>

        <Divider />

        <div>
          <SectionLabel>Fans &amp; Scrubbers</SectionLabel>
          <MiniBar icon={<IconFan color={danger} />} label="Fan primary" value={`${eva2.fan_pri_rpm} rpm`} pct={(eva2.fan_pri_rpm / 40000) * 100} fillColor={danger} valueColor={danger} />
          <MiniBar icon={<IconFan color={dim} />} label="Fan secondary" value={`${eva2.fan_sec_rpm}`} pct={(eva2.fan_sec_rpm / 40000) * 100} fillColor={dim} />
          <MiniBar icon={<IconScrubber color={warn} />} label="Scrubber A" value={`${eva2.scrubber_a_co2_storage}%`} pct={eva2.scrubber_a_co2_storage} fillColor={warn} valueColor={warn} />
          <MiniBar icon={<IconScrubber color={warn} />} label="Scrubber B" value={`${eva2.scrubber_b_co2_storage}%`} pct={eva2.scrubber_b_co2_storage} fillColor={warn} valueColor={warn} />
        </div>

        <Divider />

        <div>
          <SectionLabel>Biometrics</SectionLabel>
          <MiniBar icon={<IconHeartRate />} label="Heart rate" value={`${eva2.heart_rate} bpm`} pct={(eva2.heart_rate / 200) * 100} fillColor="#7a4a7a" />
          <MiniBar icon={<IconConsump />} label="O₂ consump" value={`${eva2.oxy_consumption}`} pct={(eva2.oxy_consumption / 10) * 100} fillColor={dim} />
          <MiniBar icon={<IconCO2Out />} label="CO₂ prod" value={`${eva2.co2_production}`} pct={(eva2.co2_production / 10) * 100} fillColor={dim} />
        </div>
      </Col>

      {/* ── Systems column ─────────────────────────────────────────── */}
      <Col style={{ borderLeft: '1px solid #0e0f1c' }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#2e3050', textTransform: 'uppercase' }}>
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

        <div>
          <SectionLabel>IMU Position</SectionLabel>
          <ImuBox label="EVA-1" labelColor="#2a3a6a" x={imu.eva1.posx} y={imu.eva1.posy} heading={imu.eva1.heading} />
          <ImuBox label="EVA-2" labelColor="#1a3a2a" x={imu.eva2.posx} y={imu.eva2.posy} heading={imu.eva2.heading} />
        </div>
      </Col>

      {/* ── Alerts + Tasks column ──────────────────────────────────── */}
      <Col style={{ borderLeft: '1px solid #0e0f1c' }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#2e3050', textTransform: 'uppercase' }}>
          Caution &amp; Tasks
        </div>

        <div>
          <SectionLabel color="#6a2a2a">Active alerts</SectionLabel>
          <AlertCard title="EVA-2 coolant critical" sub="Storage at 0% — immediate action" level="danger" />
          <AlertCard title="EVA-2 fan offline" sub="Primary fan RPM = 0" level="warn" />
          <AlertCard title="EVA-2 DCU standby" sub="All switches off — verify checklist" level="warn" />
        </div>

        <Divider />

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <SectionLabel>Mission tasks</SectionLabel>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#2e3050' }}>2 / 4</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ flex: 1, height: 2, background: '#0d0e1a', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: '65%', height: '100%', background: '#3a3a6a', borderRadius: 2 }} />
            </div>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#3a3a6a' }}>65%</span>
          </div>

          <TaskItem status="complete" name="Pre-EVA suit check" pct={100} />
          <TaskItem status="active" name="Travel to Zone B" sub="Lunar surface · 40% complete" pct={40} />
          <TaskItem status="upcoming" name="Sample collection" sub="Zone B — regolith core" pct={0} />
          <TaskItem status="upcoming" name="Return to airlock" sub="Zone B → Airlock Alpha" pct={0} />

          <button style={{
            marginTop: 12, width: '100%', background: 'transparent',
            border: '1px solid #14152a', borderRadius: 5,
            color: '#2e3050', padding: 8, fontSize: 10,
            letterSpacing: 2, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          }}>
            + new task
          </button>
        </div>
      </Col>

    </div>
  )
}
