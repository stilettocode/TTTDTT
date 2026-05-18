// pages/Rover.tsx
import { useEffect, useRef, useState } from 'react'
import { useSocket } from '../context/SocketContext'

// ── mediamtx HLS stream URL ───────────────────────────────────────
// Change this if mediamtx is running on a different port
const STREAM_URL = 'http://localhost:8888/live/dust/index.m3u8'

const TEST_VOICE_STRING = 'Test voice string'

// ── Layout constants ──────────────────────────────────────────────
// Tweak these to shift panels without touching JSX
const LEFT_TOP    = 16   // top of left panels
const RIGHT_TOP   = 16   // top of elapsed-time panel
const CABIN_TOP   = 140  // cabin env starts below elapsed (increased to prevent overlap)
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
  const { roverData, ltvData, sendVoiceString } = useSocket() as {
    roverData: any
    ltvData: any
    sendVoiceString: (voiceString: string) => void
  }
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<any>(null)
  const transcriptRef = useRef('')
  const shouldSendVoiceRef = useRef(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // ── Attach HLS stream ──────────────────────────────────────────
  useEffect(() => {
    let hls: any
    const video = videoRef.current
    if (!video) return

    const attach = async () => {
      const Hls = (await import('hls.js')).default
      if (Hls.isSupported()) {
        hls = new Hls({ lowLatencyMode: true })
        hls.loadSource(STREAM_URL)
        hls.attachMedia(video)
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS fallback
        video.src = STREAM_URL
      }
    }

    attach()
    return () => hls?.destroy()
  }, [])

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
    if (isRecording) {
      shouldSendVoiceRef.current = true
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      sendVoiceString(TEST_VOICE_STRING)
      return
    }

    transcriptRef.current = ''
    shouldSendVoiceRef.current = false

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.onresult = (event: any) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript
      }
      transcriptRef.current = transcript
    }
    recognition.onend = () => {
      if (shouldSendVoiceRef.current) {
        const voiceString = transcriptRef.current.trim() || TEST_VOICE_STRING
        sendVoiceString(voiceString)
      }
      shouldSendVoiceRef.current = false
      recognitionRef.current = null
      setIsRecording(false)
    }
    recognition.onerror = () => {
      transcriptRef.current = TEST_VOICE_STRING
      shouldSendVoiceRef.current = true
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
      setIsRecording(true)
    } catch {
      sendVoiceString(TEST_VOICE_STRING)
    }
  }

  return (
    <div style={styles.root}>

      {/* ── Full-screen video (HLS via mediamtx) ── */}
      <video
        ref={videoRef}
        style={styles.video}
        autoPlay
        muted
        playsInline
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

        {/* ── RIGHT BAR TOP — cabin environment ── */}
        <HudPanel style={{ ...styles.colPanel, top: CABIN_TOP, right: SIDE_X, alignItems: 'flex-end' }}>
          <span style={{ ...styles.sectionTitle, alignSelf: 'flex-end' }}>CABIN ENV</span>

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

        {/* ── RIGHT BAR — fans / CO₂ scrubbers ── */}
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

        {/* ── BOTTOM RIGHT — voice button ── */}
        <div style={styles.bottomRight}>
          <button
            type="button"
            onClick={handleVoiceClick}
            style={{
              ...styles.voiceButton,
              ...(isRecording ? styles.voiceButtonRecording : {}),
              pointerEvents: 'auto',
            }}
          >
            {isRecording ? '● STOP' : '🎙 VOICE'}
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
  video: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    zIndex: 1,
    objectFit: 'cover',
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
    alignItems: 'center',
    justifyContent: 'center',
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
  voiceButtonRecording: {
    background: 'rgba(248,113,113,0.16)',
    borderColor: 'rgba(248,113,113,0.65)',
    color: '#fecaca',
  },
}

/* ─── Panel base ──────────────────────────────────────────────── */
const panel: Record<string, React.CSSProperties> = {
  base: {
    display: 'flex',
    padding: '12px 16px',
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
    fontSize: 10,
    letterSpacing: '0.12em',
    color: 'rgba(0,255,180,0.7)',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  },
  value: {
    fontSize: 18,
    fontWeight: 500,
    letterSpacing: '0.04em',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    color: '#e8fff8',
  },
  unit: {
    fontSize: 10,
    color: 'rgba(232,255,248,0.45)',
    marginLeft: 2,
  },
}