import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useSocket } from '../context/SocketContext'
import astronaut from '../assets/astronaut.png'

// ══════════════════════════════════════════════════════════════════════
// TELEMETRY RANGES (from EVA Telemetry Ranges spec)
// ══════════════════════════════════════════════════════════════════════
const RANGES: Record<string, { min?: number; max?: number; nominal?: number; unit?: string; rateLimit?: number }> = {
  primary_battery_level:    { min: 20,    max: 100  },
  secondary_battery_level:  { min: 20,    max: 100  },
  oxy_pri_storage:          { min: 20,    max: 100  },
  oxy_sec_storage:          { min: 20,    max: 100  },
  oxy_pri_pressure:         { min: 600,   max: 3000 },
  oxy_sec_pressure:         { min: 600,   max: 3000 },
  coolant_storage:          { min: 80,    max: 100,  nominal: 100 },
  heart_rate:               { min: 50,    max: 160  },
  oxy_consumption:          { min: 0.05,  max: 0.15, nominal: 0.1  },
  co2_production:           { min: 0.05,  max: 0.15, nominal: 0.1  },
  suit_pressure_oxy:        { min: 3.5,   max: 4.1,  nominal: 4.0  },
  suit_pressure_co2:        { min: 0,     max: 0.1,  nominal: 0    },
  suit_pressure_other:      { min: 0,     max: 0.5,  nominal: 0    },
  suit_pressure_total:      { min: 3.5,   max: 4.5,  nominal: 4.0  },
  helmet_pressure_co2:      { min: 0,     max: 0.15, nominal: 0    },
  fan_pri_rpm:              { min: 20000, max: 30000, nominal: 30000 },
  fan_sec_rpm:              { min: 20000, max: 30000, nominal: 30000 },
  scrubber_a_co2_storage:   { min: 0,    max: 60   },
  scrubber_b_co2_storage:   { min: 0,    max: 60   },
  temperature:              { min: 10,   max: 32,   nominal: 21   },
  coolant_liquid_pressure:  { min: 100,  max: 700,  nominal: 500  },
  coolant_gas_pressure:     { min: 0,    max: 700,  nominal: 0    },
}

// Rate-of-change limits — max allowed delta per second before triggering alert
const RATE_LIMITS: Record<string, number> = {
  primary_battery_level:   2,
  secondary_battery_level: 2,
  oxy_pri_storage:         3,
  oxy_sec_storage:         3,
  heart_rate:              15,
  temperature:             2,
  suit_pressure_oxy:       0.3,
  suit_pressure_co2:       0.05,
  helmet_pressure_co2:     0.05,
  coolant_storage:         5,
}

interface AlertItem {
  id: string
  title: string
  sub: string
  level: 'danger' | 'warn'
  ts: number
}

function checkRanges(
  evaLabel: string,
  data: Record<string, number>,
  prev: Record<string, number> | null,
  dtSec: number,
): AlertItem[] {
  const alerts: AlertItem[] = []
  const now = Date.now()

  for (const [key, range] of Object.entries(RANGES)) {
    const val = data[key]
    if (val === undefined || val === null) continue

    // Range check
    if (range.min !== undefined && val < range.min) {
      alerts.push({
        id: `${evaLabel}-${key}-low`,
        title: `${evaLabel} ${key.replace(/_/g, ' ')} LOW`,
        sub: `Value ${val.toFixed(2)} below min ${range.min}`,
        level: 'danger', ts: now,
      })
    } else if (range.max !== undefined && val > range.max) {
      alerts.push({
        id: `${evaLabel}-${key}-high`,
        title: `${evaLabel} ${key.replace(/_/g, ' ')} HIGH`,
        sub: `Value ${val.toFixed(2)} exceeds max ${range.max}`,
        level: 'danger', ts: now,
      })
    } else if (range.nominal !== undefined && Math.abs(val - range.nominal) > 0.001) {
      // Only warn if within range but off nominal
      alerts.push({
        id: `${evaLabel}-${key}-nominal`,
        title: `${evaLabel} ${key.replace(/_/g, ' ')} off nominal`,
        sub: `${val.toFixed(2)} (nominal: ${range.nominal})`,
        level: 'warn', ts: now,
      })
    }

    // Rate-of-change check
    if (prev && dtSec > 0) {
      const limit = RATE_LIMITS[key]
      if (limit !== undefined) {
        const prevVal = prev[key]
        if (prevVal !== undefined) {
          const rate = Math.abs(val - prevVal) / dtSec
          if (rate > limit) {
            alerts.push({
              id: `${evaLabel}-${key}-rate`,
              title: `${evaLabel} ${key.replace(/_/g, ' ')} changing fast`,
              sub: `Δ${(val - prevVal).toFixed(2)} in ${dtSec.toFixed(1)}s (limit ${limit}/s)`,
              level: 'warn', ts: now,
            })
          }
        }
      }
    }
  }
  return alerts
}

// ══════════════════════════════════════════════════════════════════════
// ICONS — 18×18
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
    <path d="M1.5 9 L4.5 9 L6 5 L7.5 13.5 L9 5.5 L10.5 12 L12 9 L16.5 9" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const IconConsump = ({ color = '#5a4a7a' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 14 L9 8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M9 8 C6 8 4 6 4 4 C4 3 5 2.5 6 3 C7 3.5 7.5 5 9 5 C10.5 5 11 3.5 12 3 C13 2.5 14 3 14 4 C14 6 12 8 9 8Z" stroke={color} strokeWidth="1" fill={color} fillOpacity="0.15" />
    <polyline points="7,12 9,14 11,12" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
  </svg>
)
const IconCO2Out = ({ color = '#5a4a4a' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 4 L9 10" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M9 10 C6 10 4 12 4 14 C4 15 5 15.5 6 15 C7 14.5 7.5 13 9 13 C10.5 13 11 14.5 12 15 C13 15.5 14 15 14 14 C14 12 12 10 9 10Z" stroke={color} strokeWidth="1" fill={color} fillOpacity="0.15" />
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
  const nx = 9 + 5 * Math.sin(rad), ny = 9 - 5 * Math.cos(rad)
  const sx = 9 - 3 * Math.sin(rad), sy = 9 + 3 * Math.cos(rad)
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
// SHARED UI
// ══════════════════════════════════════════════════════════════════════
const SectionLabel = ({ children, color }: { children: React.ReactNode; color?: string }) => (
  <div style={{ fontSize: 9, letterSpacing: 2.5, color: color ?? '#7dd3fc', textTransform: 'uppercase', marginBottom: 2 }}>{children}</div>
)
const Divider = () => <div style={{ height: 1, background: 'rgba(56,189,248,0.14)', flexShrink: 0 }} />

interface MiniBarProps { icon: React.ReactNode; label: string; value: string; pct: number; fillColor?: string; warn?: boolean }
const MiniBar = ({ icon, label, value, pct, fillColor = '#2a2c48', warn }: MiniBarProps) => {
  const c = warn ? '#f87171' : fillColor
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, padding: '4px 0' }}>
      <div style={{ width: 20, height: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <span style={{ fontSize: 11, color: c, width: 96, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 4, background: '#0f172a', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: '100%', background: c, borderRadius: 2, boxShadow: warn ? `0 0 6px #f8717166` : `0 0 4px ${c}44` }} />
      </div>
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: c, minWidth: 56, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

interface GaugeRowProps { icon: React.ReactNode; label: string; value: string; pct: number; fillColor?: string; warn?: boolean }
const GaugeRow = ({ icon, label, value, pct, fillColor = '#4a7adf', warn }: GaugeRowProps) => {
  const c = warn ? '#f87171' : fillColor
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
      <div style={{ width: 30, height: 30, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 7, background: '#0f172a', border: `1px solid ${warn ? 'rgba(248,113,113,0.4)' : 'rgba(56,189,248,0.2)'}` }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, letterSpacing: 1.2, color: c, textTransform: 'uppercase', marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ alignSelf: 'center' }}>{label}</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}>{value}</span>
        </div>
        <div style={{ height: 4, background: '#0f172a', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: '100%', background: c, borderRadius: 2, boxShadow: warn ? `0 0 8px #f8717166` : `0 0 8px ${c}44` }} />
        </div>
      </div>
    </div>
  )
}

interface ToggleProps { label: string; on: boolean }
const Toggle = ({ label, on }: ToggleProps) => (
  <div style={{ background: on ? 'rgba(34,197,94,0.18)' : 'rgba(248,113,113,0.16)', border: `1px solid ${on ? 'rgba(34,197,94,0.35)' : 'rgba(248,113,113,0.35)'}`, borderRadius: 10, padding: '10px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
  <div style={{ fontSize: 9, letterSpacing: 1, color: '#94a3b8', textTransform: 'uppercase' }}>{label}</div>
  <div style={{ fontSize: 13, fontWeight: 700, color: on ? '#86efac' : '#fca5a5' }}>{on ? 'ON' : 'OFF'}</div>
</div>
)



interface AlertCardProps { title: string; sub: string; level?: 'danger' | 'warn' }
const AlertCard = ({ title, sub, level = 'danger' }: AlertCardProps) => (
  <div style={{ background: level === 'danger' ? 'rgba(248,113,113,0.15)' : 'rgba(250,204,21,0.13)', border: `1px solid ${level === 'danger' ? 'rgba(248,113,113,0.4)' : 'rgba(250,204,21,0.35)'}`, borderLeft: `3px solid ${level === 'danger' ? '#f87171' : '#fde047'}`, borderRadius: 6, padding: '8px 10px', marginBottom: 6 }}>
  <div style={{ fontSize: 11, color: level === 'danger' ? '#fecaca' : '#fef9c3', fontWeight: 600, marginBottom: 2 }}>{title}</div>
  <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.4 }}>{sub}</div>
</div>
)

interface TaskItemProps { status: 'complete' | 'active' | 'upcoming'; name: string; pct?: number }
const TaskItem = ({ status, name, pct = 0 }: TaskItemProps) => {
  const sc = status === 'complete' ? '#38bdf8' : status === 'active' ? '#c084fc' : '#475569'
  const bc = status === 'upcoming' ? '#334155' : status === 'active' ? '#c084fc' : '#38bdf8'
  return (
    <div style={{ padding: '8px 0', borderBottom: '1px solid rgba(56,189,248,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div style={{ fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: sc }}>{status}</div>
        {status === 'active' && <div style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: '#c084fc' }}>{pct}%</div>}
        {status === 'complete' && <div style={{ fontSize: 9, color: '#38bdf8' }}>✓</div>}
      </div>
      <div style={{ fontSize: 11.5, color: status === 'upcoming' ? '#64748b' : '#e2e8f0', fontWeight: 500, marginBottom: 5 }}>{name}</div>
      <div style={{ height: 2, background: '#0f172a', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: bc, borderRadius: 2 }} />
      </div>
    </div>
  )
}

const Col = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6, ...style, background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(8px)', overflowY: 'auto', borderRight: '1px solid rgba(56,189,248,0.1)', minHeight: 0 }}>
    {children}
  </div>
)

interface ImuBoxProps { labelColor: string; x: number; y: number; heading: number }
const ImuBox = ({ labelColor, x, y, heading }: ImuBoxProps) => {
  const rows = [
    { key: 'x', icon: <IconPosX color={labelColor} />, sub: 'X coord', val: x.toFixed(1) },
    { key: 'y', icon: <IconPosY color={labelColor} />, sub: 'Y coord', val: y.toFixed(1) },
    { key: 'h', icon: <IconCompass color={labelColor} heading={heading} />, sub: 'Heading', val: `${heading.toFixed(1)}°` },
  ]
  return (
    <div style={{ background: 'rgba(15,23,42,0.7)', border: `1px solid ${labelColor}28`, borderRadius: 7, padding: '5px 7px' }}>
      <div style={{ fontSize: 7.5, letterSpacing: 3, color: labelColor, textTransform: 'uppercase', opacity: 0.7, marginBottom: 4 }}>IMU position</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {rows.map(({ key, icon, val, sub }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 20, height: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, background: `${labelColor}12`, border: `1px solid ${labelColor}28` }}>{icon}</div>
            <span style={{ fontSize: 9, letterSpacing: 1.5, color: labelColor, opacity: 0.7, textTransform: 'uppercase', width: 52, flexShrink: 0 }}>{sub}</span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10.5, color: labelColor, marginLeft: 'auto' }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// TELEMETRY COLUMN
// ══════════════════════════════════════════════════════════════════════
interface TelemetryColProps {
  evaLabel: string; accentColor: string; dimColor: string
  glowRgb: string; headingTextColor: string; astronautAlt: string
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
  alertKeys: Set<string>
}

const TelemetryCol = (p: TelemetryColProps) => {
  const w = (key: string) => p.alertKeys.has(key)
  const pct = (val: number, max: number) => Math.min(100, Math.max(0, (val / max) * 100))
  const pctRange = (val: number, min: number, max: number) => Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100))

  return (
    <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(8px)', overflowY: 'auto', borderRight: '1px solid rgba(56,189,248,0.1)', justifyContent: 'flex-start', flex: '1 1 0', minHeight: 0 }}>
      {/* Hero */}
      <div style={{ flex: '0 0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 96, minWidth: 72, flexShrink: 0, borderRadius: 12, padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `rgba(${p.glowRgb},0.06)`, border: `1px solid rgba(${p.glowRgb},0.18)`, boxShadow: `0 0 12px rgba(${p.glowRgb},0.12)` }}>
            <img src={astronaut} alt={p.astronautAlt} style={{ width: '88%', height: 'auto', objectFit: 'contain', filter: `drop-shadow(0 0 8px rgba(${p.glowRgb},0.45))` }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 8, letterSpacing: 3, color: p.accentColor, textTransform: 'uppercase', marginBottom: 2 }}>Suit telemetry</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: p.headingTextColor, textShadow: `0 0 14px rgba(${p.glowRgb},0.3)`, marginBottom: 6 }}>{p.evaLabel}</div>
            <GaugeRow icon={<IconBattery color={p.accentColor} />} label={p.battery1Label} value={`${p.battery1.toFixed(0)}%`} pct={p.battery1} fillColor={p.accentColor} warn={w('primary_battery_level')} />
            <GaugeRow icon={<IconBattery color={p.dimColor} />} label={p.battery2Label} value={`${p.battery2.toFixed(0)}%`} pct={p.battery2} fillColor={p.accentColor} warn={w('secondary_battery_level')} />
            <GaugeRow icon={<IconTemp color={p.accentColor} />} label="Suit temp" value={`${p.temperature.toFixed(1)}°C`} pct={pctRange(p.temperature, 10, 32)} fillColor={p.accentColor} warn={w('temperature')} />
            <ImuBox labelColor={p.accentColor} x={p.imuX} y={p.imuY} heading={p.imuHeading} />
          </div>
        </div>
      </div>

      <Divider />

      <div style={{ flex: '0 0 auto' }}>
        <SectionLabel color={p.accentColor}>Oxygen</SectionLabel>
        <MiniBar icon={<IconO2 color={p.accentColor} />} label="Pri storage" value={`${p.oxyPriStorage.toFixed(0)}%`} pct={p.oxyPriStorage} fillColor={p.accentColor} warn={w('oxy_pri_storage')} />
        <MiniBar icon={<IconO2 color={p.dimColor} />} label="Sec storage" value={`${p.oxySecStorage.toFixed(0)}%`} pct={p.oxySecStorage} fillColor={p.accentColor} warn={w('oxy_sec_storage')} />
        <MiniBar icon={<IconPressure color={p.dimColor} />} label="Pri pressure" value={`${p.oxyPriPressure.toFixed(0)} psi`} pct={pctRange(p.oxyPriPressure, 600, 3000)} fillColor={p.accentColor} warn={w('oxy_pri_pressure')} />
        <MiniBar icon={<IconPressure color={p.dimColor} />} label="Sec pressure" value={`${p.oxySecPressure.toFixed(0)} psi`} pct={pctRange(p.oxySecPressure, 600, 3000)} fillColor={p.accentColor} warn={w('oxy_sec_pressure')} />
        <MiniBar icon={<IconSuitPressure color={p.dimColor} />} label="Suit O₂ press" value={`${p.suitPressureOxy.toFixed(2)} psi`} pct={pctRange(p.suitPressureOxy, 3.5, 4.1)} fillColor={p.accentColor} warn={w('suit_pressure_oxy')} />
        <MiniBar icon={<IconCO2Out color={p.dimColor} />} label="Suit CO₂" value={`${p.suitPressureCo2.toFixed(3)}`} pct={pct(p.suitPressureCo2, 0.1)} fillColor={p.accentColor} warn={w('suit_pressure_co2')} />
      </div>

      <Divider />

      <div style={{ flex: '0 0 auto' }}>
        <SectionLabel color={p.accentColor}>Coolant</SectionLabel>
        <MiniBar icon={<IconDroplet color={p.accentColor} />} label="Storage" value={`${p.coolantStorage.toFixed(0)}%`} pct={p.coolantStorage} fillColor={p.accentColor} warn={w('coolant_storage')} />
        <MiniBar icon={<IconWave color={p.accentColor} />} label="Liquid press" value={`${p.coolantLiquidPressure.toFixed(0)} psi`} pct={pctRange(p.coolantLiquidPressure, 100, 700)} fillColor={p.accentColor} warn={w('coolant_liquid_pressure')} />
        <MiniBar icon={<IconDroplet color={p.dimColor} />} label="Gas press" value={`${p.coolantGasPressure.toFixed(0)} psi`} pct={pct(p.coolantGasPressure, 700)} fillColor={p.accentColor} warn={w('coolant_gas_pressure')} />
      </div>

      <Divider />

      <div style={{ flex: '0 0 auto' }}>
        <SectionLabel color={p.accentColor}>Fans &amp; Scrubbers</SectionLabel>
        <MiniBar icon={<IconFan color={p.accentColor} />} label="Fan primary" value={`${(p.fanPriRpm / 1000).toFixed(1)}k rpm`} pct={pct(p.fanPriRpm, 30000)} fillColor={p.accentColor} warn={w('fan_pri_rpm')} />
        <MiniBar icon={<IconFan color={p.dimColor} />} label="Fan secondary" value={`${(p.fanSecRpm / 1000).toFixed(1)}k rpm`} pct={pct(p.fanSecRpm, 30000)} fillColor={p.accentColor} warn={w('fan_sec_rpm')} />
        <MiniBar icon={<IconScrubber color={p.dimColor} />} label="Scrubber A" value={`${p.scrubberA.toFixed(0)}%`} pct={pct(p.scrubberA, 60)} fillColor={p.accentColor} warn={w('scrubber_a_co2_storage')} />
        <MiniBar icon={<IconScrubber color={p.dimColor} />} label="Scrubber B" value={`${p.scrubberB.toFixed(0)}%`} pct={pct(p.scrubberB, 60)} fillColor={p.accentColor} warn={w('scrubber_b_co2_storage')} />
      </div>

      <Divider />

      <div style={{ flex: '0 0 auto' }}>
        <SectionLabel color={p.accentColor}>Biometrics</SectionLabel>
        <MiniBar icon={<IconHeartRate color={p.accentColor} />} label="Heart rate" value={`${p.heartRate.toFixed(0)} bpm`} pct={pctRange(p.heartRate, 50, 160)} fillColor={p.accentColor} warn={w('heart_rate')} />
        <MiniBar icon={<IconConsump color={p.accentColor} />} label="O₂ consumed" value={`${p.oxyConsumption.toFixed(3)}`} pct={pctRange(p.oxyConsumption, 0.05, 0.15)} fillColor={p.accentColor} warn={w('oxy_consumption')} />
        <MiniBar icon={<IconCO2Out color={p.accentColor} />} label="CO₂ produced" value={`${p.co2Production.toFixed(3)}`} pct={pctRange(p.co2Production, 0.05, 0.15)} fillColor={p.accentColor} warn={w('co2_production')} />
      </div>
    </div>
  )
}

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

  const eva1 = ({ ...defaultEva1, ...(evaData?.telemetry?.eva1 ?? {}) }) as typeof defaultEva1
  const eva2 = ({ ...defaultEva2, ...(evaData?.telemetry?.eva2 ?? {}) }) as typeof defaultEva2

  // Map eva2 to same key names as eva1 for range checking
  const eva2Normalized = {
    primary_battery_level: eva2.battery_level,
    secondary_battery_level: eva2.battery_level,
    ...eva2,
  }

  // ── Rate-of-change tracking ──────────────────────────────────────
  const prevEva1Ref = useRef<typeof eva1 | null>(null)
  const prevEva2Ref = useRef<typeof eva2Normalized | null>(null)
  const prevTsRef = useRef<number>(Date.now())
  const [alerts, setAlerts] = useState<AlertItem[]>([])

  useEffect(() => {
    if (!evaData) return
    const now = Date.now()
    const dtSec = (now - prevTsRef.current) / 1000
    const newAlerts: AlertItem[] = [
      ...checkRanges('EVA-1', eva1 as any, prevEva1Ref.current as any, dtSec),
      ...checkRanges('EVA-2', eva2Normalized as any, prevEva2Ref.current as any, dtSec),
    ]
    // Deduplicate by id — keep latest
    const map = new Map<string, AlertItem>()
    newAlerts.forEach(a => map.set(a.id, a))
    setAlerts(Array.from(map.values()).sort((a, b) => {
      if (a.level === 'danger' && b.level !== 'danger') return -1
      if (b.level === 'danger' && a.level !== 'danger') return 1
      return b.ts - a.ts
    }))
    prevEva1Ref.current = { ...eva1 }
    prevEva2Ref.current = { ...eva2Normalized }
    prevTsRef.current = now
  }, [evaData])

  // Build alert key sets for coloring telemetry bars
  const eva1AlertKeys = new Set(alerts.filter(a => a.id.startsWith('EVA-1')).map(a => a.id.replace('EVA-1-', '').replace(/-low$|-high$|-nominal$|-rate$/, '')))
  const eva2AlertKeys = new Set(alerts.filter(a => a.id.startsWith('EVA-2')).map(a => a.id.replace('EVA-2-', '').replace(/-low$|-high$|-nominal$|-rate$/, '')))

  // ── Tasks from backend ───────────────────────────────────────────
  const rawTasks: string[] = (evaData as any)?.tasks ?? []
  const tasks: string[] = Array.from({ length: 5 }, (_, i) => rawTasks[i] ?? '')

  const missionElapsed = eva1.eva_elapsed_time
  const missionRunning = evaData?.status?.started ?? false
  const backendConnected = Boolean(evaData)

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

  const blue = '#38BDF8', blueDim = '#0EA5E9'
  const purple = '#C084FC', purpleDim = '#A855F7'

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60)
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  // Task display: completed = first filled slots, active = next, rest upcoming
  const taskStatuses: Array<'complete' | 'active' | 'upcoming'> = tasks.map((t, i) => {
    if (!t) return 'upcoming'
    // Heuristic: tasks before current active are complete, current is active, rest upcoming
    // In a real app you'd get this from the backend; here we just show all as upcoming if populated
    return 'upcoming'
  })

  return (
    <div style={{ display: 'grid', width: '100vw', height: '100vh', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1.15fr) minmax(0,1fr)', gridTemplateRows: 'auto 1fr', background: '#060e1a', color: '#e2e8f0', fontFamily: "'DM Sans', sans-serif", fontSize: 13, overflow: 'hidden', boxSizing: 'border-box' }}>

      {/* ── TOP BAR ── */}
      <div style={{ gridColumn: '1 / -1', background: 'rgba(10,18,30,0.98)', borderBottom: '1px solid rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 24px', backdropFilter: 'blur(8px)', height: 52 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(56,189,248,0.22)', borderRadius: 4, padding: '3px 10px', fontSize: 9.5, letterSpacing: 3, color: '#94a3b8', textTransform: 'uppercase' }}>ISS-EVA-047</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#8890b8', letterSpacing: 1 }}>Extravehicular Activity</div>
            <div style={{ fontSize: 9, color: backendConnected ? '#6ee7b7' : '#94a3b8', letterSpacing: 1 }}>{backendConnected ? '● Backend connected' : '○ Waiting for data'}</div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 24, fontWeight: 300, color: '#c8cce0', letterSpacing: 5, textShadow: '0 0 12px rgba(56,189,248,0.5)' }}>{formatTime(missionElapsed)}</div>
          <div style={{ fontSize: 8, letterSpacing: 3, color: '#475569', textTransform: 'uppercase' }}>mission elapsed</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {alerts.filter(a => a.level === 'danger').length > 0 && (
            <div style={{ background: 'rgba(248,113,113,0.2)', border: '1px solid rgba(248,113,113,0.4)', borderRadius: 20, padding: '3px 12px', fontSize: 10, color: '#fca5a5', fontWeight: 600 }}>
              ⚠ {alerts.filter(a => a.level === 'danger').length} FAULT{alerts.filter(a => a.level === 'danger').length > 1 ? 'S' : ''}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #1e3a2a', borderRadius: 20, padding: '3px 12px', fontSize: 9.5, color: missionRunning ? '#4ade80' : '#475569' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: missionRunning ? '#4ade80' : '#334155' }} />
            {missionRunning ? 'Active — EVA in progress' : 'Standby'}
          </div>
        </div>
      </div>

      {/* ── EVA-1 TELEMETRY ── */}
      <TelemetryCol
        evaLabel="EVA-1" accentColor={blue} dimColor={blueDim}
        glowRgb="56,189,248" headingTextColor="#c8f9ff" astronautAlt="EVA-1"
        battery1={eva1.primary_battery_level} battery1Label="Primary batt"
        battery2={eva1.secondary_battery_level} battery2Label="Secondary batt"
        temperature={eva1.temperature}
        imuX={imu.eva1.posx} imuY={imu.eva1.posy} imuHeading={imu.eva1.heading}
        oxyPriStorage={eva1.oxy_pri_storage} oxySecStorage={eva1.oxy_sec_storage}
        oxyPriPressure={eva1.oxy_pri_pressure} oxySecPressure={eva1.oxy_sec_pressure}
        suitPressureOxy={eva1.suit_pressure_oxy} suitPressureCo2={eva1.suit_pressure_co2}
        coolantStorage={eva1.coolant_storage} coolantLiquidPressure={eva1.coolant_liquid_pressure} coolantGasPressure={eva1.coolant_gas_pressure}
        fanPriRpm={eva1.fan_pri_rpm} fanSecRpm={eva1.fan_sec_rpm}
        scrubberA={eva1.scrubber_a_co2_storage} scrubberB={eva1.scrubber_b_co2_storage}
        heartRate={eva1.heart_rate} oxyConsumption={eva1.oxy_consumption} co2Production={eva1.co2_production}
        alertKeys={eva1AlertKeys}
      />

      {/* ── EVA-2 TELEMETRY ── */}
      <TelemetryCol
        evaLabel="EVA-2" accentColor={purple} dimColor={purpleDim}
        glowRgb="192,132,252" headingTextColor="#f3e8ff" astronautAlt="EVA-2"
        battery1={eva2.battery_level} battery1Label="Primary batt"
        battery2={eva2.battery_level} battery2Label="Secondary batt"
        temperature={eva2.temperature}
        imuX={imu.eva2.posx} imuY={imu.eva2.posy} imuHeading={imu.eva2.heading}
        oxyPriStorage={eva2.oxy_pri_storage} oxySecStorage={eva2.oxy_sec_storage}
        oxyPriPressure={eva2.oxy_pri_pressure} oxySecPressure={eva2.oxy_sec_pressure}
        suitPressureOxy={eva2.suit_pressure_oxy} suitPressureCo2={eva2.suit_pressure_co2}
        coolantStorage={eva2.coolant_storage} coolantLiquidPressure={eva2.coolant_liquid_pressure} coolantGasPressure={eva2.coolant_gas_pressure}
        fanPriRpm={eva2.fan_pri_rpm} fanSecRpm={eva2.fan_sec_rpm}
        scrubberA={eva2.scrubber_a_co2_storage} scrubberB={eva2.scrubber_b_co2_storage}
        heartRate={eva2.heart_rate} oxyConsumption={eva2.oxy_consumption} co2Production={eva2.co2_production}
        alertKeys={eva2AlertKeys}
      />

      {/* ── SYSTEMS ── */}
      <Col style={{ borderLeft: '1px solid rgba(56,189,248,0.08)' }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#7dd3fc', textTransform: 'uppercase', paddingBottom: 4, borderBottom: '1px solid rgba(56,189,248,0.12)', flexShrink: 0 }}>Systems &amp; Control</div>

        <div style={{ flexShrink: 0 }}>
          <SectionLabel color="#7dd3fc">DCU — EVA-1</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            <Toggle label="OXY" on={dcu.eva1.oxy} />
            <Toggle label="FAN" on={dcu.eva1.fan} />
            <Toggle label="PUMP" on={dcu.eva1.pump} />
            <Toggle label="CO₂" on={dcu.eva1.co2} />
            <Toggle label="BATT LU" on={dcu.eva1.batt.lu} />
            <Toggle label="BATT PS" on={dcu.eva1.batt.ps} />
          </div>
        </div>

        <Divider />

        <div style={{ flexShrink: 0 }}>
          <SectionLabel color="#7dd3fc">DCU — EVA-2</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            <Toggle label="BATT" on={dcu.eva2.batt} />
            <Toggle label="OXY" on={dcu.eva2.oxy} />
            <Toggle label="COMM" on={dcu.eva2.comm} />
            <Toggle label="FAN" on={dcu.eva2.fan} />
            <Toggle label="PUMP" on={dcu.eva2.pump} />
            <Toggle label="CO₂" on={dcu.eva2.co2} />
          </div>
        </div>

        <Divider />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <SectionLabel color="#7dd3fc">UIA Switches</SectionLabel>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(5, 1fr)', gap: 6 }}>
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
      </Col>

      {/* ── ALERTS + TASKS (50/50) ── */}
      <Col style={{ borderLeft: '1px solid rgba(56,189,248,0.08)', display: 'flex', flexDirection: 'column', gap: 0, padding: 0 }}>

        {/* Top half — Alerts */}
        <div style={{ flex: 1, minHeight: 0, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, borderBottom: '1px solid rgba(56,189,248,0.12)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: '#7dd3fc', textTransform: 'uppercase' }}>⚠ Active Alerts</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, background: alerts.length > 0 ? 'rgba(248,113,113,0.2)' : 'rgba(34,197,94,0.15)', color: alerts.length > 0 ? '#fca5a5' : '#86efac', borderRadius: 10, padding: '1px 8px', border: `1px solid ${alerts.length > 0 ? 'rgba(248,113,113,0.35)' : 'rgba(34,197,94,0.3)'}` }}>
              {alerts.length} active
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {alerts.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, opacity: 0.4 }}>
                <div style={{ fontSize: 22 }}>✓</div>
                <div style={{ fontSize: 10, letterSpacing: 2, color: '#4ade80', textTransform: 'uppercase' }}>All nominal</div>
              </div>
            ) : (
              alerts.map(a => <AlertCard key={a.id} title={a.title} sub={a.sub} level={a.level} />)
            )}
          </div>
        </div>

        {/* Bottom half — Tasks */}
        <div style={{ flex: 1, minHeight: 0, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: '#7dd3fc', textTransform: 'uppercase' }}>Mission Tasks</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#7dd3fc' }}>
              {tasks.filter(t => !!t).length} / 5
            </div>
          </div>

          {/* Overall progress bar */}
          <div style={{ flexShrink: 0, height: 3, background: '#0f172a', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${(tasks.filter(t => !!t).length / 5) * 100}%`, height: '100%', background: '#7dd3fc', borderRadius: 2, boxShadow: '0 0 8px rgba(125,211,252,0.4)' }} />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {tasks.map((name, i) => (
              name ? (
                <TaskItem key={i} status="upcoming" name={name} pct={0} />
              ) : (
                <div key={i} style={{ padding: '9px 10px', marginBottom: 5, borderRadius: 6, background: 'rgba(56,189,248,0.06)', border: '1px dashed rgba(56,189,248,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid rgba(56,189,248,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 9, color: '#334d66', fontFamily: 'DM Mono, monospace' }}>{i + 1}</span>
                  </div>
                  <div style={{ fontSize: 10.5, color: '#2d4a6b', fontStyle: 'italic', letterSpacing: 0.5 }}>Task slot {i + 1} — awaiting assignment</div>
                </div>
              )
            ))}
          </div>
        </div>
      </Col>

    </div>
  )
}
