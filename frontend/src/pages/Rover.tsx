// pages/Rover.tsx
import { useSocket } from '../context/SocketContext'

const YOUTUBE_LIVE_ID = 'm3kR2KK8TEs'

const BAR_H = 200
const OVERLAP = 40

// ── Telemetry display helpers ────────────────────────────────────
function TelemetryItem({ label, value, unit, warn }: {
  label: string
  value: string | number
  unit?: string
  warn?: boolean
}) {
  return (
    <div style={itemStyles.wrapper}>
      <span style={itemStyles.label}>{label}</span>
      <span style={{ ...itemStyles.value, color: warn ? '#f87171' : '#e2e8f0' }}>
        {value}
        {unit && <span style={itemStyles.unit}>{unit}</span>}
      </span>
    </div>
  )
}

function Divider() {
  return <div style={{ width: 1, height: 32, background: 'rgba(56,189,248,0.15)', flexShrink: 0 }} />
}

function TelemetryRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      width: '100%',
    }}>
      {children}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────
export default function RoverPage() {
  const { roverData, ltvData } = useSocket() as { roverData: any; ltvData: any }

  const pr = roverData?.pr_telemetry
  const ltv = ltvData

  const fmt = (v: number | undefined, dec = 1) =>
    v != null ? v.toFixed(dec) : '—'

  return (
    <div style={styles.root}>

      {/* ── TOP BAR — Rover telemetry ── */}
      <header style={styles.topBar}>

        {/* Row 1 — Speed / heading / position */}
        <TelemetryRow>
          <TelemetryItem label="SPEED"     value={fmt(pr?.speed)}                unit=" m/s" />
          <TelemetryItem label="HEADING"   value={fmt(pr?.heading, 0)}           unit="°"    />
          <TelemetryItem label="PITCH"     value={fmt(pr?.pitch, 0)}             unit="°"    />
          <TelemetryItem label="ROLL"      value={fmt(pr?.roll, 0)}              unit="°"    />
          <TelemetryItem label="TRAVELLED"      value={fmt(pr?.distance_traveled, 0)} unit=" m"   />
        </TelemetryRow>

        {/* Row 2 — Battery */}
        <TelemetryRow>
          <TelemetryItem label="BAT PRI" value={fmt(pr?.primary_battery_level, 0)}   unit="%" warn={pr?.primary_battery_level < 20}   />
          <TelemetryItem label="BAT SEC" value={fmt(pr?.secondary_battery_level, 0)} unit="%" warn={pr?.secondary_battery_level < 20} />
        </TelemetryRow>

        {/* Row 3 — Cabin vitals */}
        <TelemetryRow>
          <TelemetryItem label="CAB TEMP" value={fmt(pr?.cabin_temperature, 0)} unit="°C"   />
          <TelemetryItem label="CAB PRES" value={fmt(pr?.cabin_pressure)}       unit=" kPa" />
          <TelemetryItem label="O₂ STOR"  value={fmt(pr?.oxygen_storage, 0)}   unit="%" warn={pr?.oxygen_storage < 20} />
          <TelemetryItem label="O₂ PRES"  value={fmt(pr?.oxygen_pressure)}     unit=" kPa" />
          <TelemetryItem label="EXT TEMP" value={fmt(pr?.external_temp, 0)}    unit="°C"   />
        </TelemetryRow>

      </header>

      {/* ── VIDEO ── */}
      <main style={styles.videoWrapper}>
        <div style={styles.videoContainer}>
          <iframe
            style={styles.iframe}
            src={`https://www.youtube.com/embed/${YOUTUBE_LIVE_ID}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </main>

      {/* ── BOTTOM BAR — LTV telemetry ── */}
      <footer style={styles.bottomBar}>

        <TelemetryItem label="LTV X" value={fmt(ltv?.location?.last_known_x)} unit=" m" />
        <TelemetryItem label="LTV Y" value={fmt(ltv?.location?.last_known_y)} unit=" m" />

        <Divider />

        <TelemetryItem
          label="SIGNAL"
          value={fmt(ltv?.signal?.strength, 0)}
          unit="%"
          warn={ltv?.signal?.strength < 20}
        />
        <TelemetryItem label="PING"   value={ltv?.signal?.ping_requested ?? '—'} />
        <TelemetryItem label="PING ∞" value={ltv?.signal?.ping_unlimited_requested ?? '—'} />

      </footer>

    </div>
  )
}

/* ─── Styles ──────────────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100vh',
    background: '#0a0c0f',
    color: '#e2e8f0',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    overflow: 'hidden',
  },

  topBar: {
    flexShrink: 0,
    height: BAR_H,
    marginBottom: -OVERLAP,
    zIndex: 2,
    background: 'rgba(15, 20, 28, 0.97)',
    borderBottom: '1px solid rgba(56, 189, 248, 0.18)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 20px',
    gap: 8,
    boxShadow: '0 1px 0 rgba(56,189,248,0.08)',
  },

  videoWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 0,
    zIndex: 1,
  },

  videoContainer: {
    width: `calc((100vh - ${BAR_H * 2}px) * 16 / 9)`,
    maxWidth: '100%',
    height: `calc(100vh - ${BAR_H * 2}px)`,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 4,
    boxShadow: '0 0 0 1px rgba(56,189,248,0.15), 0 8px 40px rgba(0,0,0,0.7)',
  },

  iframe: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },

  bottomBar: {
    flexShrink: 0,
    height: BAR_H,
    marginTop: -OVERLAP,
    zIndex: 2,
    background: 'rgba(15, 20, 28, 0.97)',
    borderTop: '1px solid rgba(56, 189, 248, 0.18)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 20px',
    gap: 16,
    boxShadow: '0 -1px 0 rgba(56,189,248,0.08)',
    overflowX: 'auto',
  },
}

const itemStyles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2,
    flexShrink: 0,
  },
  label: {
    fontSize: 12,
    letterSpacing: '0.12em',
    color: 'rgba(56, 189, 248, 0.7)',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
  },
  value: {
    fontSize: 15,
    fontWeight: 500,
    letterSpacing: '0.04em',
    color: '#e2e8f0',
  },
  unit: {
    fontSize: 10,
    color: 'rgba(226,232,240,0.45)',
    marginLeft: 1,
  },
}