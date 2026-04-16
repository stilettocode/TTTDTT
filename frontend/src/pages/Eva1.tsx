import React from 'react'
import { useSocket } from '../context/SocketContext'
import astronaut from '../assets/astronaut.png'

// ══════════════════════════════════════════════════════════════════════
// ICONS — 18×18, descriptive
// ══════════════════════════════════════════════════════════════════════

const IconBattery = ({ color = '#4a7adf' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="5" width="13" height="9" rx="2" stroke={color} strokeWidth="1.2" />
    <rect x="14" y="8" width="3" height="4" rx="1" fill={color} />
    <rect x="2.5" y="6.5" width="2.5" height="6" rx="0.5" fill={color} fillOpacity=".75" />
    <rect x="6" y="6.5" width="2.5" height="6" rx="0.5" fill={color} fillOpacity=".5" />
    <rect x="9.5" y="6.5" width="2.5" height="6" rx="0.5" fill={color} fillOpacity=".3" />
  </svg>
)

const IconO2 = ({ color = '#4a7adf' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="5" y="5" width="8" height="11" rx="3" stroke={color} strokeWidth="1.2" />
    <line x1="9" y1="2" x2="9" y2="5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    <line x1="7" y1="2" x2="11" y2="2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <text x="9" y="13" textAnchor="middle" fill={color} fontSize="5.5" fontFamily="monospace" fontWeight="bold">O₂</text>
  </svg>
)

const IconPressure = ({ color = '#3a5ab0' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M3 14 A6 6 0 0 1 15 14" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="9" cy="14" r="1.2" fill={color} />
    <line x1="9" y1="14" x2="13" y2="8.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    <line x1="4" y1="14" x2="5.5" y2="14" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.45" />
    <line x1="14.5" y1="14" x2="13" y2="14" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.45" />
    <line x1="9" y1="8" x2="9" y2="9.5" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.45" />
  </svg>
)

const IconSuitPressure = ({ color = '#3a5ab0' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M6 16 L5 11 C4 10 4 8 6 7 L9 6 L12 7 C14 8 14 10 13 11 L12 16 Z" stroke={color} strokeWidth="1.1" strokeLinejoin="round" />
    <circle cx="9" cy="4.5" r="2" stroke={color} strokeWidth="1.1" />
    <line x1="9" y1="10" x2="9" y2="13" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
    <polyline points="7.5,11.5 9,13 10.5,11.5" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" />
  </svg>
)

const IconDroplet = ({ color = '#4a7adf' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 2 C5 6 4 11 5.5 14 A4 4 0 0 0 12.5 14 C14 11 13 6 9 2Z" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.18" />
    <path d="M7 13 Q9 11.5 11 13" stroke={color} strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.55" />
  </svg>
)

const IconWave = ({ color = '#4a7adf' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="2" y="6" width="14" height="7" rx="2" stroke={color} strokeWidth="1" strokeOpacity="0.45" />
    <path d="M3.5 9.5 Q5.5 7 7.5 9.5 Q9.5 12 11.5 9.5 Q13.5 7 15 9.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)

const IconFan = ({ color = '#4a7adf' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="2.2" stroke={color} strokeWidth="1.1" />
    <path d="M9 2 Q12.5 5.5 9 6.5 Q5.5 7.5 9 2Z" fill={color} fillOpacity=".65" />
    <path d="M9 16 Q5.5 12.5 9 11.5 Q12.5 10.5 9 16Z" fill={color} fillOpacity=".65" />
    <path d="M2 9 Q5.5 5.5 6.5 9 Q7.5 12.5 2 9Z" fill={color} fillOpacity=".65" />
    <path d="M16 9 Q12.5 12.5 11.5 9 Q10.5 5.5 16 9Z" fill={color} fillOpacity=".65" />
    <circle cx="9" cy="9" r="1.3" fill={color} />
  </svg>
)

const IconScrubber = ({ color = '#3a5ab0' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="3" y="4" width="12" height="11" rx="2" stroke={color} strokeWidth="1.2" />
    <line x1="3" y1="7.5" x2="15" y2="7.5" stroke={color} strokeWidth="0.85" strokeOpacity=".5" />
    <line x1="3" y1="10.5" x2="15" y2="10.5" stroke={color} strokeWidth="0.85" strokeOpacity=".5" />
    <line x1="3" y1="13" x2="15" y2="13" stroke={color} strokeWidth="0.85" strokeOpacity=".35" />
    <line x1="7" y1="2" x2="7" y2="4" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <line x1="11" y1="2" x2="11" y2="4" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const IconHeartRate = ({ color = '#7a4a7a' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M1.5 9 L4.5 9 L6 5 L7.5 13.5 L9 5.5 L10.5 12 L12 9 L16.5 9"
      stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconConsump = ({ color = '#5a4a7a' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 14 L9 8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M9 8 C6 8 4 6 4 4 C4 3 5 2.5 6 3 C7 3.5 7.5 5 9 5 C10.5 5 11 3.5 12 3 C13 2.5 14 3 14 4 C14 6 12 8 9 8Z"
      stroke={color} strokeWidth="1" fill={color} fillOpacity="0.15" />
    <polyline points="7,12 9,14 11,12" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
  </svg>
)

const IconCO2Out = ({ color = '#5a4a4a' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 4 L9 10" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M9 10 C6 10 4 12 4 14 C4 15 5 15.5 6 15 C7 14.5 7.5 13 9 13 C10.5 13 11 14.5 12 15 C13 15.5 14 15 14 14 C14 12 12 10 9 10Z"
      stroke={color} strokeWidth="1" fill={color} fillOpacity="0.15" />
    <polyline points="7,6 9,4 11,6" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
  </svg>
)

const IconTemp = ({ color = '#4a7adf' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="7.5" y="2" width="3" height="10" rx="1.5" stroke={color} strokeWidth="1.1" />
    <circle cx="9" cy="14.5" r="2.5" stroke={color} strokeWidth="1.1" fill={color} fillOpacity="0.22" />
    <rect x="8.2" y="7" width="1.6" height="5.5" rx="0.8" fill={color} fillOpacity="0.7" />
    <line x1="10.5" y1="5" x2="12.5" y2="5" stroke={color} strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.5" />
    <line x1="10.5" y1="7.5" x2="12.5" y2="7.5" stroke={color} strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.5" />
    <line x1="10.5" y1="10" x2="12.5" y2="10" stroke={color} strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.5" />
  </svg>
)

const IconPosX = ({ color = '#4a7adf' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <line x1="2" y1="15" x2="16" y2="15" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.6" />
    <line x1="2" y1="3" x2="2" y2="15" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.6" />
    <polyline points="13,13 16,15 13,17" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" />
    <circle cx="11" cy="15" r="2" fill={color} />
    <line x1="2" y1="15" x2="11" y2="15" stroke={color} strokeWidth="0.8" strokeDasharray="2 1.5" strokeOpacity="0.4" />
    <text x="3.5" y="12.5" fill={color} fontSize="5.5" fontFamily="monospace" fillOpacity="0.65">X</text>
  </svg>
)

const IconPosY = ({ color = '#4a7adf' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <line x1="2" y1="15" x2="16" y2="15" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.6" />
    <line x1="2" y1="3" x2="2" y2="15" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.6" />
    <polyline points="0,6 2,3 4,6" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" />
    <circle cx="2" cy="8" r="2" fill={color} />
    <line x1="2" y1="15" x2="2" y2="8" stroke={color} strokeWidth="0.8" strokeDasharray="2 1.5" strokeOpacity="0.4" />
    <text x="5" y="7.5" fill={color} fontSize="5.5" fontFamily="monospace" fillOpacity="0.65">Y</text>
  </svg>
)

const IconCompass = ({ color = '#4a7adf', heading = 0 }: { color?: string; heading?: number }) => {
  const rad = ((heading ?? 0) * Math.PI) / 180
  const nx = 9 + 5 * Math.sin(rad)
  const ny = 9 - 5 * Math.cos(rad)
  const sx = 9 - 3 * Math.sin(rad)
  const sy = 9 + 3 * Math.cos(rad)
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.5" stroke={color} strokeWidth="1.1" strokeOpacity="0.45" />
      <line x1="9" y1="1.5" x2="9" y2="3.5" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.65" />
      <line x1="9" y1="14.5" x2="9" y2="16.5" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.35" />
      <line x1="1.5" y1="9" x2="3.5" y2="9" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.35" />
      <line x1="14.5" y1="9" x2="16.5" y2="9" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.35" />
      <text x="9" y="5" textAnchor="middle" fill={color} fontSize="3.5" fontFamily="monospace" fillOpacity="0.7">N</text>
      <line x1={sx} y1={sy} x2={nx} y2={ny} stroke={color} strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="9" cy="9" r="1.4" fill={color} />
    </svg>
  )
}

// ══════════════════════════════════════════════════════════════════════
// SHARED UI COMPONENTS
// ══════════════════════════════════════════════════════════════════════

const SectionLabel = ({ children, color }: { children: React.ReactNode; color?: string }) => (
  <div style={{ fontSize: 9, letterSpacing: 3, color: color ?? '#7dd3fc', textTransform: 'uppercase', marginBottom: 5 }}>
    {children}
  </div>
)

const Divider = () => <div style={{ height: 1, background: 'rgba(56,189,248,0.14)' }} />

interface MiniBarProps { icon: React.ReactNode; label: string; value: string; pct: number; fillColor?: string }
const MiniBar = ({ icon, label, value, pct, fillColor = '#2a2c48' }: MiniBarProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
    <div style={{ width: 22, height: 22, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </div>
    <span style={{ fontSize: 11, color: fillColor, width: 84, flexShrink: 0 }}>{label}</span>
    <div style={{ flex: 1, height: 4, background: '#0f172a', borderRadius: 2, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.35)' }}>
      <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: '100%', background: fillColor, borderRadius: 2, boxShadow: `0 0 6px ${fillColor}44` }} />
    </div>
    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: fillColor, minWidth: 60, textAlign: 'right' }}>{value}</span>
  </div>
)

interface GaugeRowProps { icon: React.ReactNode; label: string; value: string; pct: number; fillColor?: string }
const GaugeRow = ({ icon, label, value, pct, fillColor = '#4a7adf' }: GaugeRowProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
    <div style={{ width: 28, height: 28, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: '#0f172a', border: '1px solid rgba(56,189,248,0.2)', boxShadow: '0 2px 12px rgba(56,189,248,0.08)' }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10, letterSpacing: 1.5, color: fillColor, textTransform: 'uppercase', marginBottom: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{label}</span>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}>{value}</span>
      </div>
      <div style={{ height: 5, background: '#0f172a', borderRadius: 2, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.35)' }}>
        <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: '100%', background: fillColor, borderRadius: 2, boxShadow: `0 0 14px ${fillColor}44` }} />
      </div>
    </div>
  </div>
)

interface ToggleProps { label: string; on: boolean }
const Toggle = ({ label, on }: ToggleProps) => (
  <div style={{ background: on ? 'rgba(34,197,94,0.18)' : 'rgba(248,113,113,0.16)', border: `1px solid ${on ? 'rgba(34,197,94,0.35)' : 'rgba(248,113,113,0.35)'}`, borderRadius: 8, padding: '7px 6px', textAlign: 'center' }}>
    <div style={{ fontSize: 8, letterSpacing: 1, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
    <div style={{ fontSize: 11, fontWeight: 700, color: on ? '#86efac' : '#fca5a5' }}>{on ? 'ON' : 'OFF'}</div>
  </div>
)

// Error: false = no error (green), true = error (red)
interface ErrorToggleProps { label: string; error: boolean }
const ErrorToggle = ({ label, error }: ErrorToggleProps) => (
  <div style={{
    background: error ? 'rgba(248,113,113,0.2)' : 'rgba(34,197,94,0.14)',
    border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : 'rgba(34,197,94,0.32)'}`,
    borderLeft: `3px solid ${error ? '#f87171' : '#4ade80'}`,
    borderRadius: 8, padding: '8px 8px', textAlign: 'left',
    boxShadow: error ? '0 0 12px rgba(248,113,113,0.2)' : 'none',
  }}>
    <div style={{ fontSize: 8, letterSpacing: 1, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
    <div style={{ fontSize: 12, fontWeight: 700, color: error ? '#fca5a5' : '#86efac', fontFamily: 'DM Mono, monospace' }}>
      {error ? 'TRUE' : 'FALSE'}
    </div>
  </div>
)

interface AlertCardProps { title: string; sub: string; level?: 'danger' | 'warn' }
const AlertCard = ({ title, sub, level = 'danger' }: AlertCardProps) => (
  <div style={{ background: level === 'danger' ? 'rgba(248,113,113,0.18)' : 'rgba(250,204,21,0.16)', border: `1px solid ${level === 'danger' ? 'rgba(248,113,113,0.35)' : 'rgba(250,204,21,0.32)'}`, borderLeft: `4px solid ${level === 'danger' ? '#f87171' : '#fde047'}`, borderRadius: 6, padding: '10px 12px', marginBottom: 8 }}>
    <div style={{ fontSize: 12, color: level === 'danger' ? '#fee2e2' : '#fef9c3', fontWeight: 600, marginBottom: 4 }}>{title}</div>
    <div style={{ fontSize: 11, color: '#cbd5e1' }}>{sub}</div>
  </div>
)

interface TaskItemProps { status: 'complete' | 'active' | 'upcoming'; name: string; sub?: string; pct: number }
const TaskItem = ({ status, name, sub, pct }: TaskItemProps) => {
  const sc = status === 'complete' ? '#7dd3fc' : status === 'active' ? '#38bdf8' : '#94a3b8'
  const bc = status === 'upcoming' ? '#64748b' : '#38bdf8'
  return (
    <div style={{ padding: '9px 0', borderBottom: '1px solid #0e0f1c' }}>
      <div style={{ fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: sc, marginBottom: 3 }}>{status}</div>
      <div style={{ fontSize: 12, color: '#e2e8f0', marginBottom: sub ? 4 : 5, fontWeight: 500 }}>{name}</div>
      {sub && <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 5 }}>{sub}</div>}
      <div style={{ height: 2, background: '#0f172a', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: bc, borderRadius: 2 }} />
      </div>
    </div>
  )
}

const Col = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ borderRight: '1px solid rgba(56,189,248,0.12)', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8, ...style, background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(8px)', overflowY: 'auto' }}>
    {children}
  </div>
)

// ── ImuBox ─────────────────────────────────────────────────────────────
interface ImuBoxProps { labelColor: string; x: number; y: number; heading: number }
const ImuBox = ({ labelColor, x, y, heading }: ImuBoxProps) => {
  const rows = [
    { key: 'x', icon: <IconPosX color={labelColor} />, sub: 'X coord', val: x.toFixed(1) },
    { key: 'y', icon: <IconPosY color={labelColor} />, sub: 'Y coord', val: y.toFixed(1) },
    { key: 'h', icon: <IconCompass color={labelColor} heading={heading} />, sub: 'Heading', val: `${heading.toFixed(1)}°` },
  ]
  return (
    <div style={{ background: 'rgba(15,23,42,0.7)', border: `1px solid ${labelColor}28`, borderRadius: 8, padding: '6px 8px 5px' }}>
      <div style={{ fontSize: 8, letterSpacing: 3, color: labelColor, textTransform: 'uppercase', opacity: 0.7, marginBottom: 5 }}>IMU position</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {rows.map(({ key, icon, val, sub }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 22, height: 22, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5, background: `${labelColor}12`, border: `1px solid ${labelColor}28` }}>{icon}</div>
            <span style={{ fontSize: 10, letterSpacing: 1.5, color: labelColor, opacity: 0.7, textTransform: 'uppercase', width: 58, flexShrink: 0 }}>{sub}</span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: labelColor, marginLeft: 'auto' }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// REUSABLE TELEMETRY COLUMN
// ══════════════════════════════════════════════════════════════════════
interface TelemetryColProps {
  evaLabel: string; tagLabel: string
  accentColor: string; dimColor: string
  glowRgb: string; headingTextColor: string
  astronautAlt: string
  battery1: number; battery1Label: string
  battery2: number; battery2Label: string
  temperature: number
  imuX: number; imuY: number; imuHeading: number
  oxyPriStorage: number; oxySecStorage: number
  oxyPriPressure: number; oxySecPressure: number
  suitPressureOxy: number; suitPressureCo2: number
  coolantStorage: number; coolantLiquidPressure: number; coolantGasPressure: number
  fanPriRpm: number; fanSecRpm: number
  scrubberA: number; scrubberB: number
  heartRate: number; oxyConsumption: number; co2Production: number
}

const TelemetryCol = (p: TelemetryColProps) => (
  <Col>
    {/* Header */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 9, letterSpacing: 3, color: p.accentColor, textTransform: 'uppercase' }}>{p.tagLabel}</span>
      <span style={{ fontSize: 17, fontWeight: 700, color: p.headingTextColor, textShadow: `0 0 14px rgba(${p.glowRgb},0.28)` }}>{p.evaLabel}</span>
    </div>

    {/* Hero */}
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <div style={{ width: 86, flexShrink: 0, borderRadius: 16, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `rgba(${p.glowRgb},0.08)`, border: `1px solid rgba(${p.glowRgb},0.22)`, boxShadow: `0 0 18px rgba(${p.glowRgb},0.14)` }}>
        <img src={astronaut} alt={p.astronautAlt} style={{ width: 68, objectFit: 'contain', filter: `drop-shadow(0 0 12px rgba(${p.glowRgb},0.45))` }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <GaugeRow icon={<IconBattery color={p.accentColor} />} label={p.battery1Label} value={`${p.battery1.toFixed(0)}%`} pct={p.battery1} fillColor={p.accentColor} />
        <GaugeRow icon={<IconBattery color={p.dimColor} />} label={p.battery2Label} value={`${p.battery2.toFixed(0)}%`} pct={p.battery2} fillColor={p.accentColor} />
        <GaugeRow icon={<IconTemp color={p.accentColor} />} label="Suit temp" value={`${p.temperature.toFixed(1)}°F`} pct={(p.temperature / 120) * 100} fillColor={p.accentColor} />
        <ImuBox labelColor={p.accentColor} x={p.imuX} y={p.imuY} heading={p.imuHeading} />
      </div>
    </div>

    <Divider />

    {/* Oxygen */}
    <div>
      <SectionLabel color={p.accentColor}>Oxygen</SectionLabel>
      <MiniBar icon={<IconO2 color={p.accentColor} />} label="Pri storage" value={`${p.oxyPriStorage.toFixed(0)}%`} pct={p.oxyPriStorage} fillColor={p.accentColor} />
      <MiniBar icon={<IconO2 color={p.dimColor} />} label="Sec storage" value={`${p.oxySecStorage.toFixed(0)}%`} pct={p.oxySecStorage} fillColor={p.accentColor} />
      <MiniBar icon={<IconPressure color={p.dimColor} />} label="Pri pressure" value={`${p.oxyPriPressure.toFixed(1)} psi`} pct={(p.oxyPriPressure / 1000) * 100} fillColor={p.accentColor} />
      <MiniBar icon={<IconPressure color={p.dimColor} />} label="Sec pressure" value={`${p.oxySecPressure.toFixed(1)} psi`} pct={(p.oxySecPressure / 1000) * 100} fillColor={p.accentColor} />
      <MiniBar icon={<IconSuitPressure color={p.dimColor} />} label="Suit O₂ press" value={`${p.suitPressureOxy.toFixed(2)} psi`} pct={(p.suitPressureOxy / 5) * 100} fillColor={p.accentColor} />
      <MiniBar icon={<IconCO2Out color={p.dimColor} />} label="Suit CO₂" value={`${p.suitPressureCo2.toFixed(3)}`} pct={(p.suitPressureCo2 / 0.5) * 100} fillColor={p.accentColor} />
    </div>

    <Divider />

    {/* Coolant */}
    <div>
      <SectionLabel color={p.accentColor}>Coolant</SectionLabel>
      <MiniBar icon={<IconDroplet color={p.accentColor} />} label="Storage" value={`${p.coolantStorage.toFixed(0)}%`} pct={p.coolantStorage} fillColor={p.accentColor} />
      <MiniBar icon={<IconWave color={p.accentColor} />} label="Liquid press" value={`${p.coolantLiquidPressure.toFixed(1)}`} pct={(p.coolantLiquidPressure / 700) * 100} fillColor={p.accentColor} />
      <MiniBar icon={<IconDroplet color={p.dimColor} />} label="Gas press" value={`${p.coolantGasPressure.toFixed(1)}`} pct={(p.coolantGasPressure / 100) * 100} fillColor={p.accentColor} />
    </div>

    <Divider />

    {/* Fans & Scrubbers */}
    <div>
      <SectionLabel color={p.accentColor}>Fans &amp; Scrubbers</SectionLabel>
      <MiniBar icon={<IconFan color={p.accentColor} />} label="Fan primary" value={`${(p.fanPriRpm / 1000).toFixed(1)}k rpm`} pct={(p.fanPriRpm / 40000) * 100} fillColor={p.accentColor} />
      <MiniBar icon={<IconFan color={p.dimColor} />} label="Fan secondary" value={`${(p.fanSecRpm / 1000).toFixed(1)}k rpm`} pct={(p.fanSecRpm / 40000) * 100} fillColor={p.accentColor} />
      <MiniBar icon={<IconScrubber color={p.dimColor} />} label="Scrubber A" value={`${p.scrubberA.toFixed(0)}%`} pct={p.scrubberA} fillColor={p.accentColor} />
      <MiniBar icon={<IconScrubber color={p.dimColor} />} label="Scrubber B" value={`${p.scrubberB.toFixed(0)}%`} pct={p.scrubberB} fillColor={p.accentColor} />
    </div>

    <Divider />

    {/* Biometrics */}
    <div>
      <SectionLabel color={p.accentColor}>Biometrics</SectionLabel>
      <MiniBar icon={<IconHeartRate color={p.accentColor} />} label="Heart rate" value={`${p.heartRate.toFixed(0)} bpm`} pct={(p.heartRate / 220) * 100} fillColor={p.accentColor} />
      <MiniBar icon={<IconConsump color={p.accentColor} />} label="O₂ consumed" value={`${p.oxyConsumption.toFixed(3)}`} pct={(p.oxyConsumption / 10) * 100} fillColor={p.accentColor} />
      <MiniBar icon={<IconCO2Out color={p.accentColor} />} label="CO₂ produced" value={`${p.co2Production.toFixed(3)}`} pct={(p.co2Production / 10) * 100} fillColor={p.accentColor} />
    </div>
  </Col>
)

// ══════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════
export default function Eva1Page() {
  const { evaData } = useSocket()

  const defaultEva1 = {
    primary_battery_level: 0, secondary_battery_level: 0,
    oxy_pri_storage: 0, oxy_sec_storage: 0,
    oxy_pri_pressure: 0, oxy_sec_pressure: 0,
    suit_pressure_oxy: 0, suit_pressure_co2: 0,
    suit_pressure_other: 0, suit_pressure_total: 0, helmet_pressure_co2: 0,
    fan_pri_rpm: 0, fan_sec_rpm: 0,
    scrubber_a_co2_storage: 0, scrubber_b_co2_storage: 0,
    temperature: 0, coolant_storage: 0,
    coolant_gas_pressure: 0, coolant_liquid_pressure: 0,
    heart_rate: 0, oxy_consumption: 0, co2_production: 0, eva_elapsed_time: 0,
  }

  const defaultEva2 = {
    battery_level: 0,
    oxy_pri_storage: 0, oxy_sec_storage: 0,
    oxy_pri_pressure: 0, oxy_sec_pressure: 0,
    suit_pressure_oxy: 0, suit_pressure_co2: 0,
    suit_pressure_other: 0, suit_pressure_total: 0, helmet_pressure_co2: 0,
    fan_pri_rpm: 0, fan_sec_rpm: 0,
    scrubber_a_co2_storage: 0, scrubber_b_co2_storage: 0,
    temperature: 0, coolant_storage: 0,
    coolant_gas_pressure: 0, coolant_liquid_pressure: 0,
    heart_rate: 0, oxy_consumption: 0, co2_production: 0, eva_elapsed_time: 0,
  }

  const eva1 = ({ ...defaultEva1, ...(evaData?.telemetry.eva1 ?? {}) }) as typeof defaultEva1
  const eva2 = ({ ...defaultEva2, ...(evaData?.telemetry.eva2 ?? {}) }) as typeof defaultEva2
  const missionElapsed = evaData?.telemetry.eva1?.eva_elapsed_time ?? 0
  const missionRunning = evaData?.status?.started ?? false
  const backendConnected = Boolean(evaData)

  const formatElapsedTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = Math.floor(s % 60)
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  const dcu = {
    eva1: {
      oxy: evaData?.dcu?.eva1?.oxy ?? false,
      fan: evaData?.dcu?.eva1?.fan ?? false,
      pump: evaData?.dcu?.eva1?.pump ?? false,
      co2: evaData?.dcu?.eva1?.co2 ?? false,
      batt: { lu: evaData?.dcu?.eva1?.batt?.lu ?? false, ps: evaData?.dcu?.eva1?.batt?.ps ?? false },
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
    eva1: { posx: evaData?.imu?.eva1?.posx ?? 0, posy: evaData?.imu?.eva1?.posy ?? 0, heading: evaData?.imu?.eva1?.heading ?? 0 },
    eva2: { posx: evaData?.imu?.eva2?.posx ?? 0, posy: evaData?.imu?.eva2?.posy ?? 0, heading: evaData?.imu?.eva2?.heading ?? 0 },
  }

  const error = {
    fan_error: evaData?.error?.fan_error ?? false,
    oxy_error: evaData?.error?.oxy_error ?? false,
    power_error: evaData?.error?.power_error ?? false,
    scrubber_error: evaData?.error?.scrubber_error ?? false,
  }

  const blue = '#38BDF8'
  const blueDim = '#0EA5E9'
  const purple = '#C084FC'
  const purpleDim = '#A855F7'

  const shell: React.CSSProperties = {
    display: 'grid', width: '100vw', height: '100vh',
    gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(240px,280px)',
    gridTemplateRows: 'auto 1fr',
    background: '#07101b', color: '#e2e8f0',
    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
    overflow: 'hidden', boxSizing: 'border-box',
  }

  return (
    <div style={shell}>

      {/* top bar */}
      <div style={{ gridColumn: '1 / -1', background: 'rgba(15,20,28,0.97)', borderBottom: '1px solid rgba(56,189,248,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', backdropFilter: 'blur(8px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(56,189,248,0.22)', borderRadius: 4, padding: '4px 12px', fontSize: 10, letterSpacing: 3, color: '#cbd5e1', textTransform: 'uppercase' }}>ISS-EVA-047</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#8890b8', letterSpacing: 1 }}>Extravehicular Activity</div>
            <div style={{ fontSize: 10, color: backendConnected ? '#c8f9ff' : '#94a3b8', letterSpacing: 1 }}>{backendConnected ? 'Backend connected' : 'Waiting for backend data'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 22, fontWeight: 300, color: '#c8cce0', letterSpacing: 4, textShadow: '0 0 10px rgba(56,189,248,0.5)' }}>{formatElapsedTime(missionElapsed)}</div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: '#8890b8', textTransform: 'uppercase', marginTop: 1 }}>mission elapsed</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #1a2a1a', borderRadius: 20, padding: '4px 14px', fontSize: 10, letterSpacing: 2, color: missionRunning ? '#4a8a5a' : '#4a6a4a' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: missionRunning ? '#4a8a5a' : '#5a5f76' }} />
          {missionRunning ? 'Active — EVA in progress' : 'Standby — Not started'}
        </div>
      </div>

      {/* EVA-1 */}
      <TelemetryCol
        evaLabel="EVA-1" tagLabel="Suit telemetry"
        accentColor={blue} dimColor={blueDim}
        glowRgb="56,189,248" headingTextColor="#c8f9ff"
        astronautAlt="EVA-1 astronaut"
        battery1={eva1.primary_battery_level} battery1Label="Primary batt"
        battery2={eva1.secondary_battery_level} battery2Label="Secondary batt"
        temperature={eva1.temperature}
        imuX={imu.eva1.posx} imuY={imu.eva1.posy} imuHeading={imu.eva1.heading}
        oxyPriStorage={eva1.oxy_pri_storage} oxySecStorage={eva1.oxy_sec_storage}
        oxyPriPressure={eva1.oxy_pri_pressure} oxySecPressure={eva1.oxy_sec_pressure}
        suitPressureOxy={eva1.suit_pressure_oxy} suitPressureCo2={eva1.suit_pressure_co2}
        coolantStorage={eva1.coolant_storage}
        coolantLiquidPressure={eva1.coolant_liquid_pressure}
        coolantGasPressure={eva1.coolant_gas_pressure}
        fanPriRpm={eva1.fan_pri_rpm} fanSecRpm={eva1.fan_sec_rpm}
        scrubberA={eva1.scrubber_a_co2_storage} scrubberB={eva1.scrubber_b_co2_storage}
        heartRate={eva1.heart_rate}
        oxyConsumption={eva1.oxy_consumption} co2Production={eva1.co2_production}
      />

      {/* EVA-2 */}
      <TelemetryCol
        evaLabel="EVA-2" tagLabel="Suit telemetry"
        accentColor={purple} dimColor={purpleDim}
        glowRgb="192,132,252" headingTextColor="#f3e8ff"
        astronautAlt="EVA-2 astronaut"
        battery1={eva2.battery_level} battery1Label="Primary batt"
        battery2={eva2.battery_level} battery2Label="Secondary batt"
        temperature={eva2.temperature}
        imuX={imu.eva2.posx} imuY={imu.eva2.posy} imuHeading={imu.eva2.heading}
        oxyPriStorage={eva2.oxy_pri_storage} oxySecStorage={eva2.oxy_sec_storage}
        oxyPriPressure={eva2.oxy_pri_pressure} oxySecPressure={eva2.oxy_sec_pressure}
        suitPressureOxy={eva2.suit_pressure_oxy} suitPressureCo2={eva2.suit_pressure_co2}
        coolantStorage={eva2.coolant_storage}
        coolantLiquidPressure={eva2.coolant_liquid_pressure}
        coolantGasPressure={eva2.coolant_gas_pressure}
        fanPriRpm={eva2.fan_pri_rpm} fanSecRpm={eva2.fan_sec_rpm}
        scrubberA={eva2.scrubber_a_co2_storage} scrubberB={eva2.scrubber_b_co2_storage}
        heartRate={eva2.heart_rate}
        oxyConsumption={eva2.oxy_consumption} co2Production={eva2.co2_production}
      />

      {/* Systems column */}
      <Col style={{ borderLeft: '1px solid #0e0f1c' }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#8890b8', textTransform: 'uppercase' }}>Systems &amp; Control</div>

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

        {/* Errors: false = no fault (green), true = fault (red) */}
        <div>
          <SectionLabel>System Errors</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
            <ErrorToggle label="Fan error" error={error.fan_error} />
            <ErrorToggle label="Oxy error" error={error.oxy_error} />
            <ErrorToggle label="Power error" error={error.power_error} />
            <ErrorToggle label="Scrubber error" error={error.scrubber_error} />
          </div>
        </div>
      </Col>

      {/* Alerts + Tasks */}
      <Col style={{ borderLeft: '1px solid #0e0f1c' }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#7dd3fc', textTransform: 'uppercase', background: 'rgba(56,189,248,0.07)', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(56,189,248,0.16)' }}>
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
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#e2e8f0' }}>2 / 4</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 3, background: '#0f172a', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: '65%', height: '100%', background: '#38bdf8', borderRadius: 2, boxShadow: '0 0 10px rgba(56,189,248,0.35)' }} />
            </div>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#e2e8f0' }}>65%</span>
          </div>
          <TaskItem status="complete" name="Pre-EVA suit check" pct={100} />
          <TaskItem status="active" name="Travel to Zone B" sub="Lunar surface · 40% complete" pct={40} />
          <TaskItem status="upcoming" name="Sample collection" sub="Zone B — regolith core" pct={0} />
          <TaskItem status="upcoming" name="Return to airlock" sub="Zone B → Airlock Alpha" pct={0} />
          <button style={{ marginTop: 12, width: '100%', background: '#0f172a', border: '1px solid rgba(56,189,248,0.24)', borderRadius: 5, color: '#e2e8f0', padding: 8, fontSize: 10, letterSpacing: 2, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', boxShadow: '0 2px 8px rgba(56,189,248,0.12)' }}>
            + new task
          </button>
        </div>
      </Col>

    </div>
  )
}
