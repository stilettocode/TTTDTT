import { useMemo } from 'react'
import { useSocket } from '../context/SocketContext'

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
  return String(value)
}

function Table({
  obj,
  columns = 2,
}: {
  obj: Record<string, unknown> | undefined
  columns?: 2 | 3 | 4
}) {
  const entries = Object.entries(obj ?? {})
  if (entries.length === 0) return <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>No data</div>

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: 8,
      }}
    >
      {entries.map(([k, v]) => (
        <div
          key={k}
          style={{
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 10,
            padding: '8px 10px',
            minHeight: 44,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 700, lineHeight: 1.1 }}>{toLabel(k)}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.92)', fontWeight: 800, lineHeight: 1.15 }}>{formatScalar(v)}</div>
        </div>
      ))}
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 14,
        background: 'rgba(255,255,255,0.035)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '8px 10px',
          fontWeight: 900,
          fontSize: 13,
          borderBottom: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.03)',
        }}
      >
        {title}
      </div>
      <div style={{ padding: 10 }}>{children}</div>
    </section>
  )
}

export default function EvaTelemetryPage() {
  const { evaData } = useSocket()

  const root = useMemo(() => evaData as unknown as any, [evaData])
  const telemetry = root?.telemetry as any
  const eva1 = telemetry?.eva1 as Record<string, unknown> | undefined
  const eva2 = telemetry?.eva2 as Record<string, unknown> | undefined
  const status = root?.status as Record<string, unknown> | undefined
  const dcu = root?.dcu as any
  const error = root?.error as Record<string, unknown> | undefined
  const imu = root?.imu as any
  const uia = root?.uia as Record<string, unknown> | undefined

  if (!evaData) {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 8 }}>EVA Telemetry</div>
        <div
          style={{
            border: '1px dashed rgba(255,255,255,0.25)',
            borderRadius: 14,
            padding: 16,
            color: 'rgba(255,255,255,0.7)',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          Start the backend (`python backend/app.py`) and wait for the first `eva-telemetry` packet.
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        height: 'calc(100vh - 56px)',
        padding: 12,
        overflow: 'hidden',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 950, letterSpacing: 0.2 }}>EVA Telemetry</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Designed to fit one screen (no scrolling)</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
          Updated: <span style={{ color: 'rgba(255,255,255,0.88)' }}>{formatScalar(root?.local_timestamp)}</span>
        </div>
      </div>

      <div
        style={{
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1.3fr 1.3fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 10,
        }}
      >
        <div style={{ gridColumn: '1 / 2', gridRow: '1 / 3', minHeight: 0, display: 'grid', gap: 10 }}>
          <Panel title="Telemetry: EVA1">
            <Table obj={eva1} columns={2} />
          </Panel>
          <Panel title="DCU: EVA1">
            <Table obj={(dcu?.eva1 ?? {}) as Record<string, unknown>} columns={2} />
          </Panel>
        </div>

        <div style={{ gridColumn: '2 / 3', gridRow: '1 / 3', minHeight: 0, display: 'grid', gap: 10 }}>
          <Panel title="Telemetry: EVA2">
            <Table obj={eva2} columns={2} />
          </Panel>
          <Panel title="DCU: EVA2">
            <Table obj={(dcu?.eva2 ?? {}) as Record<string, unknown>} columns={2} />
          </Panel>
        </div>

        <div style={{ gridColumn: '3 / 4', gridRow: '1 / 3', minHeight: 0, display: 'grid', gap: 10 }}>
          <Panel title="Status / Errors">
            <div style={{ display: 'grid', gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 900, marginBottom: 6, color: 'rgba(255,255,255,0.75)' }}>Status</div>
                <Table obj={status} columns={2} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 900, marginBottom: 6, color: 'rgba(255,255,255,0.75)' }}>Error Flags</div>
                <Table obj={error} columns={2} />
              </div>
            </div>
          </Panel>

          <Panel title="IMU">
            <div style={{ display: 'grid', gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 900, marginBottom: 6, color: 'rgba(255,255,255,0.75)' }}>EVA1</div>
                <Table obj={(imu?.eva1 ?? {}) as Record<string, unknown>} columns={2} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 900, marginBottom: 6, color: 'rgba(255,255,255,0.75)' }}>EVA2</div>
                <Table obj={(imu?.eva2 ?? {}) as Record<string, unknown>} columns={2} />
              </div>
            </div>
          </Panel>

          <Panel title="UIA">
            <Table obj={uia} columns={2} />
          </Panel>
        </div>
      </div>
    </div>
  )
}

