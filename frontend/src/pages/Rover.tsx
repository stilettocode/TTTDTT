// pages/Rover.tsx
import { useSocket } from '../context/SocketContext'

const YOUTUBE_LIVE_ID = 'eH-Uxu3m7_g'
const BAR_W = 220

// ── Color palette ─────────────────────────────────────────────────
const C = {
  bg:           '#0d1b2a',
  bgRow:        'rgba(255,255,255,0.03)',
  bgBanner:     '#0b1520',
  border:       'rgba(56,189,248,0.12)',
  borderBright: 'rgba(56,189,248,0.22)',
  sectionHead:  'rgba(56,189,248,0.55)',
  label:        'rgba(180,210,230,0.65)',
  value:        '#d4eaf7',
  unit:         'rgba(148,190,218,0.5)',
  warn:         '#f87171',
  ok:           '#4ade80',
  icon:         'rgba(56,189,248,0.5)',
  divider:      'rgba(56,189,248,0.10)',
  accent:       'rgba(56,189,248,0.8)',
}

// ── Shared primitives ─────────────────────────────────────────────
function TelRow({ icon, label, value, unit, warn }: {
  icon: React.ReactNode; label: string; value: string | number; unit?: string; warn?: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', borderRadius: 4, background: C.bgRow }}>
      <span style={{ fontSize: 13, color: C.icon, width: 16, textAlign: 'center' as const, flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 11, letterSpacing: '0.05em', color: C.label }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 500, color: warn ? C.warn : C.value, letterSpacing: '0.04em' }}>
        {value}{unit && <span style={{ fontSize: 10, color: C.unit, marginLeft: 2 }}>{unit}</span>}
      </span>
    </div>
  )
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, letterSpacing: '0.18em', color: C.sectionHead, textTransform: 'uppercase' as const, fontWeight: 700, padding: '2px 10px 4px', marginTop: 4 }}>
      {children}
    </div>
  )
}

function SectionDivider() {
  return <div style={{ height: 1, background: C.divider, margin: '6px 0' }} />
}

// ── Banner primitives ─────────────────────────────────────────────
function Stat({ label, value, unit, warn }: {
  label: string; value: string | number; unit?: string; warn?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, padding: '0 16px', borderRight: `1px solid ${C.border}`, height: '100%' }}>
      <span style={{ fontSize: 9, letterSpacing: '0.16em', color: C.sectionHead, textTransform: 'uppercase' as const, fontWeight: 700, whiteSpace: 'nowrap' as const }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: warn ? C.warn : C.value, letterSpacing: '0.06em', fontFamily: "'JetBrains Mono','Fira Code',monospace", lineHeight: 1 }}>
        {value}{unit && <span style={{ fontSize: 10, color: C.unit, marginLeft: 2, fontWeight: 400 }}>{unit}</span>}
      </span>
    </div>
  )
}

function StatusPill({ label, active, color }: { label: string; active: boolean; color?: string }) {
  const col = active ? (color ?? C.ok) : 'rgba(255,255,255,0.15)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, border: `1px solid ${col}`, background: active ? `${col}18` : 'transparent' }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: col, flexShrink: 0 }} />
      <span style={{ fontSize: 10, letterSpacing: '0.12em', color: active ? col : 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase' as const }}>{label}</span>
    </div>
  )
}

function CoordBlock({ axis, value }: { axis: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, padding: '0 12px', borderRight: `1px solid ${C.border}`, height: '100%', alignSelf: 'center' as const }}>
      <span style={{ fontSize: 10, color: C.sectionHead, fontWeight: 700, letterSpacing: '0.1em' }}>{axis}</span>
      <span style={{ fontSize: 13, color: C.value, fontWeight: 500, letterSpacing: '0.06em', fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>{value}</span>
      <span style={{ fontSize: 9, color: C.unit }}>m</span>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────
export default function RoverPage() {
  const { roverData, ltvData } = useSocket() as { roverData: any; ltvData: any }
  const pr  = roverData?.pr_telemetry
  const ltv = ltvData

  const fmt    = (v: number | undefined, dec = 1) => v != null ? v.toFixed(dec) : '—'
  const fmtInt = (v: number | undefined) => fmt(v, 0)

  const fmtElapsed = (s: number | undefined) => {
    if (s == null) return '——:——:——'
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = Math.floor(s % 60)
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  return (
    <div style={styles.root}>

      {/* ══ LEFT BAR — spans full height ══ */}
      <aside style={styles.leftBar}>
        <SectionHead>Motion</SectionHead>
        <TelRow icon="▷" label="Speed"     value={fmt(pr?.speed)}                unit=" m/s" />
        <TelRow icon="⌖" label="Heading"   value={fmtInt(pr?.heading)}           unit="°"    />
        <TelRow icon="⌃" label="Pitch"     value={fmtInt(pr?.pitch)}             unit="°"    />
        <TelRow icon="↺" label="Roll"      value={fmtInt(pr?.roll)}              unit="°"    />
        <TelRow icon="⇢" label="Travelled" value={fmtInt(pr?.distance_traveled)} unit=" m"   />
        <SectionDivider />
        <SectionHead>Oxygen</SectionHead>
        <TelRow icon="⬡" label="Tank"     value={fmtInt(pr?.oxygen_tank)}    unit="%" warn={pr?.oxygen_tank < 20}    />
        <TelRow icon="⬡" label="Storage"  value={fmtInt(pr?.oxygen_storage)} unit="%" warn={pr?.oxygen_storage < 20} />
        <TelRow icon="△" label="Pressure" value={fmt(pr?.oxygen_pressure)}   unit=" PSI" />
        <SectionDivider />
        <SectionHead>Cabin</SectionHead>
        <TelRow icon="⊙" label="Pressure"    value={fmt(pr?.cabin_pressure)}              unit=" kPa" />
        <TelRow icon="◈" label="Temperature" value={fmtInt(pr?.cabin_temperature)}        unit="°C"   />
        <TelRow icon="◈" label="Target"      value={fmtInt(pr?.cabin_temperature_target)} unit="°C"   />
        <TelRow icon="◈" label="Ext Temp"    value={fmtInt(pr?.external_temp)}            unit="°C"   />
        <SectionDivider />
        <SectionHead>Coolant</SectionHead>
        <TelRow icon="◎" label="Storage"  value={fmt(pr?.coolant_storage)}  unit="%" warn={pr?.coolant_storage < 20} />
        <TelRow icon="〜" label="Pressure" value={fmt(pr?.coolant_pressure)} unit=" kPa" />
        <SectionDivider />
        <SectionHead>Fans &amp; Scrubbers</SectionHead>
        <TelRow icon="✦" label="Fan primary"    value={fmtInt(pr?.fan_pri_rpm)}         unit=" rpm" />
        <TelRow icon="✦" label="Fan secondary"  value={fmtInt(pr?.fan_sec_rpm)}         unit=" rpm" />
        <TelRow icon="▭" label="Scrubber A CO₂" value={fmt(pr?.scrubber_a_co2_storage)} unit="%" warn={pr?.scrubber_a_co2_storage > 80} />
        <TelRow icon="▭" label="Scrubber B CO₂" value={fmt(pr?.scrubber_b_co2_storage)} unit="%" warn={pr?.scrubber_b_co2_storage > 80} />
        <SectionDivider />
        <SectionHead>Power</SectionHead>
        <TelRow icon="▮" label="Primary battery"   value={fmtInt(pr?.primary_battery_level)}   unit="%" warn={pr?.primary_battery_level < 20}   />
        <TelRow icon="▮" label="Secondary battery" value={fmtInt(pr?.secondary_battery_level)} unit="%" warn={pr?.secondary_battery_level < 20} />
        <TelRow icon="▮" label="Battery level"     value={fmtInt(pr?.battery_level)}           unit="%" warn={pr?.battery_level < 20}           />
        <TelRow icon="◷" label="Elapsed"           value={fmtInt(pr?.rover_elapsed_time)}      unit=" s" />
      </aside>

      {/* ══ TOP BANNER ══ */}
      <div style={{ ...styles.banner, gridColumn: '2 / 3', gridRow: '1 / 2', borderBottom: `1px solid ${C.borderBright}` }}>
        {/* Mission identity */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 16px', borderRight: `1px solid ${C.border}`, height: '100%' }}>
          <span style={{ fontSize: 9, letterSpacing: '0.2em', color: C.sectionHead, textTransform: 'uppercase' as const, fontWeight: 700 }}>Rover Feed</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.value, letterSpacing: '0.1em' }}>PRIDE-1</span>
        </div>

        {/* Status pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderRight: `1px solid ${C.border}`, height: '100%' }}>
          <StatusPill label="Sim"    active={!!pr?.sim_running}    color={C.ok}      />
          <StatusPill label="Dust"   active={!!pr?.dust_connected} color={C.accent}  />
          <StatusPill label="Lights" active={!!pr?.lights_on}      color="#fbbf24"   />
          <StatusPill label="Brakes" active={!!pr?.brakes}         color={C.warn}    />
        </div>

        <Stat label="From Base"   value={fmt(pr?.distance_from_base, 0)} unit=" m"  />
        <Stat label="Sunlight"    value={fmtInt(pr?.sunlight)}           unit="%"   />
        <Stat label="Incline"     value={fmt(pr?.surface_incline, 1)}    unit="°"   warn={pr?.surface_incline != null && Math.abs(pr.surface_incline) > 20} />
        <Stat label="Throttle"    value={fmtInt(pr?.throttle)}           unit="%"   />
        <Stat label="Steering"    value={fmt(pr?.steering, 1)}           unit="°"   />

        <div style={{ flex: 1 }} />

        {/* Elapsed clock */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', padding: '0 16px', borderLeft: `1px solid ${C.border}`, height: '100%' }}>
          <span style={{ fontSize: 9, letterSpacing: '0.16em', color: C.sectionHead, textTransform: 'uppercase' as const, fontWeight: 700 }}>Elapsed</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: C.value, letterSpacing: '0.12em', fontFamily: "'JetBrains Mono','Fira Code',monospace", lineHeight: 1 }}>
            {fmtElapsed(pr?.rover_elapsed_time)}
          </span>
        </div>
      </div>

      {/* ══ VIDEO ══ */}
      <main style={{ gridColumn: '2 / 3', gridRow: '2 / 3', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, minHeight: 0 }}>
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
          <iframe
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            src={`https://www.youtube.com/embed/${YOUTUBE_LIVE_ID}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </main>

      {/* ══ BOTTOM BANNER ══ */}
      <div style={{ ...styles.banner, gridColumn: '2 / 3', gridRow: '3 / 4', borderTop: `1px solid ${C.borderBright}` }}>
        {/* Position label */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 14px', borderRight: `1px solid ${C.border}`, height: '100%' }}>
          <span style={{ fontSize: 9, letterSpacing: '0.16em', color: C.sectionHead, textTransform: 'uppercase' as const, fontWeight: 700 }}>Position</span>
        </div>
        <CoordBlock axis="X" value={fmt(pr?.rover_pos_x, 2)} />
        <CoordBlock axis="Y" value={fmt(pr?.rover_pos_y, 2)} />
        <CoordBlock axis="Z" value={fmt(pr?.rover_pos_z, 2)} />

        <Stat label="Heading" value={fmtInt(pr?.heading)} unit="°"    />
        <Stat label="Speed"   value={fmt(pr?.speed, 2)}   unit=" m/s" />

        {/* LIDAR mini-bars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, height: '100%' }}>
          <span style={{ fontSize: 9, letterSpacing: '0.16em', color: C.sectionHead, textTransform: 'uppercase' as const, fontWeight: 700, marginRight: 4 }}>Lidar</span>
          {(pr?.lidar?.slice(0, 10) ?? Array(10).fill(null)).map((v: number | null, i: number) => {
            const norm = v != null ? Math.min(1, v / 20) : 0
            const danger = v != null && v < 3
            return (
              <div key={i} style={{ width: 5, height: 28, background: 'rgba(56,189,248,0.08)', borderRadius: 2, overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ width: '100%', height: `${norm * 100}%`, background: danger ? C.warn : `rgba(56,189,248,${0.35 + norm * 0.55})`, borderRadius: 2 }} />
              </div>
            )
          })}
        </div>

        {/* Cabin state pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderRight: `1px solid ${C.border}`, height: '100%' }}>
          <StatusPill label="Heating" active={!!pr?.cabin_heating} color="#fb923c" />
          <StatusPill label="Cooling" active={!!pr?.cabin_cooling} color="#38bdf8" />
        </div>

        <div style={{ flex: 1 }} />

        {/* LTV signal */}
        <Stat label="LTV Signal" value={fmtInt(ltv?.signal?.strength)} unit="%" warn={ltv?.signal?.strength < 20} />
      </div>

      {/* ══ RIGHT BAR — spans full height ══ */}
      <aside style={styles.rightBar}>
        <SectionHead>Position</SectionHead>
        <TelRow icon="⌖" label="LTV X" value={fmt(ltv?.location?.last_known_x)} unit=" m" />
        <TelRow icon="⌖" label="LTV Y" value={fmt(ltv?.location?.last_known_y)} unit=" m" />
        <SectionDivider />
        <SectionHead>Signal</SectionHead>
        <TelRow icon="◉" label="Strength" value={fmtInt(ltv?.signal?.strength)}                unit="%" warn={ltv?.signal?.strength < 20} />
        <TelRow icon="◎" label="Ping"     value={ltv?.signal?.ping_requested ?? '—'}           />
        <TelRow icon="∞" label="Ping ∞"   value={ltv?.signal?.ping_unlimited_requested ?? '—'} />
      </aside>

    </div>
  )
}

/* ─── Styles ──────────────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'grid',
    gridTemplateColumns: `${BAR_W}px 1fr ${BAR_W}px`,
    gridTemplateRows: 'auto 1fr auto',
    width: '100%',
    height: '100vh',
    background: '#0a0c0f',
    color: '#d4eaf7',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    overflow: 'hidden',
  },

  banner: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: C.bgBanner,
    overflow: 'hidden',
  },

  leftBar: {
    gridColumn: '1 / 2',
    gridRow: '1 / 4',
    zIndex: 2,
    background: C.bg,
    borderRight: `1px solid ${C.border}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '16px 6px',
    gap: 2,
    overflowY: 'auto',
  },

  rightBar: {
    gridColumn: '3 / 4',
    gridRow: '1 / 4',
    zIndex: 2,
    background: C.bg,
    borderLeft: `1px solid ${C.border}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '16px 6px',
    gap: 2,
    overflowY: 'auto',
  },
}