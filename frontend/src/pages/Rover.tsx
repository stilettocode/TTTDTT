// pages/Rover.tsx
import { useEffect, useState } from 'react'
import { useSocket } from '../context/SocketContext'

const YOUTUBE_LIVE_ID = 'm3kR2KK8TEs'

// ── Layout constants ──────────────────────────────────────────────
// Tweak these to shift panels without touching JSX
const LEFT_TOP    = 16   // top of left panels
const RIGHT_TOP   = 16   // top of elapsed-time panel
const CABIN_TOP   = 140   // cabin env starts below elapsed (increased to prevent overlap)
const SIDE_X      = 20   // horizontal inset for left/right panels
const BOTTOM_Y    = 45   // bottom inset for bottom panels

// ── Shared HUD primitives ─────────────────────────────────────────

function HudStat({
  label,
  value,
  unit,
  warn,
  align = 'left',
}: {
  label: string
  value: string | number
  unit?: string
  warn?: boolean
  align?: 'left' | 'right' | 'center'
}) {
  const alignItems =
    align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start'
  return (
    <div style={{ ...hs.wrapper, alignItems }}>
      <span style={hs.label}>{label}</span>
      <span style={{ ...hs.value, color: warn ? '#f87171' : '#e8fff8' }}>
        {value}
        {unit && <span style={hs.unit}>{unit}</span>}
      </span>
    </div>
  )
}

function HudPanel({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return <div style={{ ...panel.base, ...style }}>{children}</div>
}

function HDivider() {
  return (
    <div
      style={{
        width: 1,
        height: 32,
        background: 'rgba(0,255,180,0.2)',
        flexShrink: 0,
      }}
    />
  )
}

// ── Heating/Cooling indicator ─────────────────────────────────────

function ThermalIndicator({ temp, target }: { temp: number | undefined; target: number | undefined }) {
  const needsHeating = temp != null && target != null && temp < target
  const needsCooling = temp != null && target != null && temp > target
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        flexShrink: 0,
        paddingTop: 2,
      }}
    >
      {/* Up arrow = heating needed */}
      <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
        <path d="M7 2L12 10H2L7 2Z" fill={needsHeating ? '#f87171' : 'rgba(248,113,113,0.2)'} />
      </svg>
      {/* Down arrow = cooling needed */}
      <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
        <path d="M7 12L2 4H12L7 12Z" fill={needsCooling ? '#38bdf8' : 'rgba(56,189,248,0.2)'} />
      </svg>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────

export default function RoverPage() {
  const { roverData, ltvData, voiceCaption, sendCorvusPtt } = useSocket()
  const [isBusy, setIsBusy] = useState(false)
  const [captionText, setCaptionText] = useState<string>('')

  const pr = roverData?.pr_telemetry
  const ltv = ltvData

  const fmt = (v: number | undefined, dec = 1) =>
    v != null ? v.toFixed(dec) : '—'

  const fmtTime = (seconds: number | undefined) => {
    if (seconds == null) return '—'
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleVoiceClick = () => {
    if (isBusy) return
    sendCorvusPtt()
    setIsBusy(true)
  }

  useEffect(() => {
    if (!voiceCaption) return
    setIsBusy(false)
    setCaptionText(voiceCaption.text)
    const handle = window.setTimeout(() => setCaptionText(''), 6000)
    return () => window.clearTimeout(handle)
  }, [voiceCaption])

  useEffect(() => {
    if (!isBusy) return
    const handle = window.setTimeout(() => setIsBusy(false), 10000)
    return () => window.clearTimeout(handle)
  }, [isBusy])

  return (
    <div style={styles.root}>

      {/* ── Full-screen video ── */}
      <iframe
        style={styles.iframe}
        src={`https://www.youtube.com/embed/${YOUTUBE_LIVE_ID}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      {/* ── HUD overlay ── */}
      <div style={styles.hud}>

        {/* ── SECTION 1 — top center: motion ── */}
        <HudPanel style={styles.topCenter}>
          <HudStat label="SPEED"   value={fmt(pr?.speed)}      unit=" m/s" align="center" />
          <HDivider />
          <HudStat label="HEADING" value={fmt(pr?.heading, 0)} unit="°"    align="center" />
          <HDivider />
          <HudStat label="PITCH"   value={fmt(pr?.pitch, 0)}   unit="°"    align="center" />
          <HDivider />
          <HudStat label="ROLL"    value={fmt(pr?.roll, 0)}    unit="°"    align="center" />
        </HudPanel>

        {/* ── TOP RIGHT — elapsed time ── */}
        <HudPanel style={{ ...styles.colPanel, top: RIGHT_TOP, right: SIDE_X, alignItems: 'flex-end' }}>
          <HudStat label="ELAPSED" value={fmtTime(pr?.rover_elapsed_time)} align="right" />
        </HudPanel>

        {/* ── LEFT BAR TOP — O₂ life support ── */}
        <HudPanel style={{ ...styles.colPanel, top: LEFT_TOP, left: SIDE_X, alignItems: 'flex-start' }}>
          <span style={styles.sectionTitle}>LIFE SUPPORT O₂</span>
          <HudStat label="O₂ TANK" value={fmt(pr?.oxygen_tank, 0)}    unit="%" warn={pr?.oxygen_tank < 20} />
          <HudStat label="O₂ STOR" value={fmt(pr?.oxygen_storage, 0)} unit="%" warn={pr?.oxygen_storage < 20} />
          <HudStat label="O₂ PRES" value={fmt(pr?.oxygen_pressure)}   unit=" kPa" />
        </HudPanel>

        {/* ── LEFT BAR BOTTOM — battery ── */}
        <HudPanel style={{ ...styles.colPanel, bottom: BOTTOM_Y + 56, left: SIDE_X, alignItems: 'flex-start' }}>
          <span style={styles.sectionTitle}>POWER</span>
          <HudStat label="BAT PRI" value={fmt(pr?.primary_battery_level, 0)}   unit="%" warn={pr?.primary_battery_level < 20} />
          <HudStat label="BAT SEC" value={fmt(pr?.secondary_battery_level, 0)} unit="%" warn={pr?.secondary_battery_level < 20} />
        </HudPanel>

        {/* ── RIGHT BAR TOP — cabin environment ──
            Starts at CABIN_TOP (below elapsed time), aligns vertically with left bar top */}
        <HudPanel style={{ ...styles.colPanel, top: CABIN_TOP, right: SIDE_X, alignItems: 'flex-end' }}>
          <span style={{ ...styles.sectionTitle, alignSelf: 'flex-end' }}>CABIN ENV</span>

          {/* Temp row: arrows + temp/target side by side, extra padding so arrows don't clip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
            <ThermalIndicator
              temp={pr?.cabin_temperature}
              target={pr?.cabin_temperature_target}
            />
            <HudStat
              label="CAB TEMP / TGT"
              value={`${fmt(pr?.cabin_temperature, 0)} / ${fmt(pr?.cabin_temperature_target, 0)}`}
              unit="°C"
              align="right"
            />
          </div>

          <HudStat label="EXT TEMP"     value={fmt(pr?.external_temp, 0)}  unit="°C"   align="right" />
          <HudStat label="CAB PRESSURE" value={fmt(pr?.cabin_pressure)}     unit=" kPa" align="right" />
          <HudStat label="COOLANT STOR" value={fmt(pr?.coolant_storage, 0)} unit="%"    align="right" warn={pr?.coolant_storage < 20} />
          <HudStat label="COOLANT PRES" value={fmt(pr?.coolant_pressure)}   unit=" kPa" align="right" />
        </HudPanel>

        {/* ── RIGHT BAR — fans / CO₂ scrubbers (moved up, above bottom panels) ── */}
        <HudPanel style={{ ...styles.colPanel, bottom: BOTTOM_Y + 56, right: SIDE_X, alignItems: 'flex-end' }}>
          <span style={{ ...styles.sectionTitle, alignSelf: 'flex-end' }}>FANS / CO₂</span>
          <HudStat label="FAN PRI RPM" value={fmt(pr?.fan_pri_rpm, 0)}            align="right" />
          <HudStat label="FAN SEC RPM" value={fmt(pr?.fan_sec_rpm, 0)}            align="right" />
          <HudStat label="SCRUB A CO₂" value={fmt(pr?.scrubber_a_co2_storage, 0)} unit="%" align="right" warn={pr?.scrubber_a_co2_storage > 80} />
          <HudStat label="SCRUB B CO₂" value={fmt(pr?.scrubber_b_co2_storage, 0)} unit="%" align="right" warn={pr?.scrubber_b_co2_storage > 80} />
        </HudPanel>

        {/* ── BOTTOM CENTER — LTV + signal ── */}
        <div style={styles.bottomCenter}>
          <HudStat label="LTV X"  value={fmt(ltv?.location?.last_known_x)} unit=" m" align="center" />
          <HDivider />
          <HudStat label="LTV Y"  value={fmt(ltv?.location?.last_known_y)} unit=" m" align="center" />
          <HDivider />
          <HudStat label="SIGNAL" value={fmt(ltv?.signal?.strength, 0)}    unit="%" align="center" warn={ltv?.signal?.strength < 20} />
          <HDivider />
          <HudStat label="PING"   value={ltv?.signal?.ping_requested ?? '—'} align="center" />
        </div>

        {/* ── BOTTOM RIGHT — PTT button + caption ── */}
        <div style={styles.bottomRight}>
          {captionText && (
            <div style={styles.caption}>{captionText}</div>
          )}
          <button
            type="button"
            onClick={handleVoiceClick}
            disabled={isBusy}
            style={{
              ...styles.voiceButton,
              ...(isBusy ? styles.voiceButtonBusy : {}),
              pointerEvents: 'auto',
            }}
          >
            {isBusy ? '● LISTENING' : '🎙 PTT'}
          </button>
        </div>

      </div>
    </div>
  )
}

/* ─── Layout styles ───────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  root: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    background: '#000',
    overflow: 'hidden',
  },
  iframe: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    zIndex: 1,
  },
  hud: {
    position: 'absolute',
    inset: 0,
    zIndex: 2,
    pointerEvents: 'none',
  },

  // Reusable column panel (position applied inline)
  colPanel: {
    position: 'absolute',
    flexDirection: 'column',
    gap: 10,
  },

  // Section 1 — top center
  topCenter: {
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },

  // Bottom center — LTV + signal
  bottomCenter: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    padding: '12px 22px',
    background: 'rgba(0,0,0,0.52)',
    backdropFilter: 'blur(6px)',
    border: '0.5px solid rgba(0,255,180,0.22)',
    borderRadius: 6,
  },

  // Bottom right — voice button standalone
  bottomRight: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: 8,
    maxWidth: 360,
  },
  caption: {
    background: 'rgba(0,0,0,0.62)',
    backdropFilter: 'blur(6px)',
    border: '0.5px solid rgba(0,255,180,0.22)',
    borderRadius: 6,
    color: '#e8fff8',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: 13,
    letterSpacing: '0.04em',
    padding: '8px 12px',
    pointerEvents: 'none',
    textAlign: 'right',
    maxWidth: 360,
  },

  sectionTitle: {
    fontSize: 9,
    letterSpacing: '0.15em',
    color: 'rgba(0,255,180,0.45)',
    textTransform: 'uppercase' as const,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontWeight: 700,
    marginBottom: 2,
  } as React.CSSProperties,

  voiceButton: {
    flexShrink: 0,
    background: 'rgba(0,255,180,0.1)',
    border: '1px solid rgba(0,255,180,0.45)',
    borderRadius: 4,
    color: '#e8fff8',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.1em',
    padding: '10px 16px',
    textTransform: 'uppercase' as const,
    pointerEvents: 'auto',
  },
  voiceButtonBusy: {
    background: 'rgba(248,113,113,0.16)',
    borderColor: 'rgba(248,113,113,0.65)',
    color: '#fecaca',
    cursor: 'not-allowed',
    opacity: 0.85,
  },
}

/* ─── Panel base ──────────────────────────────────────────────── */
const panel: Record<string, React.CSSProperties> = {
  base: {
    display: 'flex',
    padding: '12px 16px',       // slightly more padding = bigger feel
    background: 'rgba(0,0,0,0.52)',
    backdropFilter: 'blur(6px)',
    border: '0.5px solid rgba(0,255,180,0.22)',
    borderRadius: 6,
  },
}

/* ─── HudStat styles ──────────────────────────────────────────── */
const hs: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flexShrink: 0,
  },
  label: {
    fontSize: 10,               // up from 9
    letterSpacing: '0.12em',
    color: 'rgba(0,255,180,0.7)',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  },
  value: {
    fontSize: 18,               // up from 15
    fontWeight: 500,
    letterSpacing: '0.04em',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    color: '#e8fff8',
  },
  unit: {
    fontSize: 10,               // up from 9
    color: 'rgba(232,255,248,0.45)',
    marginLeft: 2,
  },
}