import { useMemo } from 'react'
import { useSocket } from '../context/SocketContext'

const DEFAULT_YOUTUBE_EMBED_URL = 'https://www.youtube.com/embed/live_stream?channel=CHANNEL_ID'

function toLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

function formatScalar(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') return Number.isFinite(value) ? (value % 1 === 0 ? String(value) : value.toFixed(2)) : String(value)
  if (Array.isArray(value)) {
    const preview = value.slice(0, 18).map((v) => (typeof v === 'number' ? (Number.isFinite(v) ? v.toFixed(0) : String(v)) : String(v))).join(', ')
    return `[${preview}${value.length > 18 ? ` … (+${value.length - 18})` : ''}]`
  }
  return String(value)
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

function CompactGrid({
  obj,
  columns = 3,
}: {
  obj: Record<string, unknown> | null | undefined
  columns?: 2 | 3 | 4
}) {
  const entries = Object.entries(obj ?? {})
  if (entries.length === 0) return <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>No data</div>

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: 8 }}>
      {entries.map(([k, v]) => (
        <div
          key={k}
          style={{
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 10,
            padding: '7px 9px',
            minHeight: 40,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.62)', fontWeight: 800, lineHeight: 1.1 }}>
            {toLabel(k)}
          </div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.92)', fontWeight: 900, lineHeight: 1.15, wordBreak: 'break-word' }}>
            {formatScalar(v)}
          </div>
        </div>
      ))}
    </div>
  )
}

function CompactTelemetry({
  value,
  preferKey,
}: {
  value: Record<string, unknown> | null
  preferKey?: string
}) {
  if (!value) {
    return (
      <div
        style={{
          border: '1px dashed rgba(255,255,255,0.22)',
          borderRadius: 12,
          padding: 12,
          color: 'rgba(255,255,255,0.7)',
          background: 'rgba(255,255,255,0.02)',
          fontSize: 12,
        }}
      >
        Waiting for telemetry…
      </div>
    )
  }

  const picked = preferKey && isPlainObject(value[preferKey]) ? (value[preferKey] as Record<string, unknown>) : null
  const topLevel = picked ?? value

  // If there are nested objects at the top level, render them as sections.
  const nested = Object.entries(topLevel).filter(([, v]) => isPlainObject(v)) as Array<[string, Record<string, unknown>]>
  const scalars = Object.fromEntries(Object.entries(topLevel).filter(([, v]) => !isPlainObject(v))) as Record<string, unknown>

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {Object.keys(scalars).length > 0 ? <CompactGrid obj={scalars} columns={3} /> : null}
      {nested.map(([k, v]) => (
        <div key={k} style={{ display: 'grid', gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 950, color: 'rgba(255,255,255,0.75)' }}>{toLabel(k)}</div>
          <CompactGrid obj={v} columns={3} />
        </div>
      ))}
    </div>
  )
}

function PanelShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 360,
        minWidth: 320,
        maxWidth: 420,
        height: 'calc(100vh - 56px)',
        overflow: 'auto',
        borderRight: '1px solid rgba(255,255,255,0.10)',
        borderLeft: '1px solid rgba(255,255,255,0.10)',
        background: 'rgba(255,255,255,0.03)',
      }}
    >
      <div style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.10)', fontWeight: 900 }}>{title}</div>
      <div style={{ padding: 8 }}>{children}</div>
    </div>
  )
}

export default function RoverLtvVideoPage() {
  const { roverData, ltvData } = useSocket()

  const roverObj = useMemo(() => (roverData as unknown as Record<string, unknown>) ?? null, [roverData])
  const ltvObj = useMemo(() => (ltvData as unknown as Record<string, unknown>) ?? null, [ltvData])

  return (
    <div style={{ display: 'flex', width: '100%', height: 'calc(100vh - 56px)' }}>
      <PanelShell title="Rover Telemetry (rover-telemetry)">
        <CompactTelemetry value={roverObj} preferKey="pr_telemetry" />
      </PanelShell>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'stretch', justifyContent: 'center' }}>
        <div style={{ width: '100%', height: '100%', padding: 14 }}>
          <div
            style={{
              height: '100%',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(0,0,0,0.35)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '10px 12px',
                borderBottom: '1px solid rgba(255,255,255,0.10)',
                display: 'flex',
                gap: 10,
                alignItems: 'baseline',
              }}
            >
              <div style={{ fontWeight: 900 }}>YouTube Stream</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                Hard-coded for now: <span style={{ color: 'rgba(255,255,255,0.85)' }}>{DEFAULT_YOUTUBE_EMBED_URL}</span>
              </div>
            </div>
            <iframe
              title="Live stream"
              src={DEFAULT_YOUTUBE_EMBED_URL}
              style={{ width: '100%', height: 'calc(100% - 44px)', border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <PanelShell title="LTV Telemetry (ltv-telemetry)">
        <CompactTelemetry value={ltvObj} />
      </PanelShell>
    </div>
  )
}

