import React from 'react'

function toLabel(key: string): string {
  const spaced = key
    .replace(/_/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim()
  return spaced.replace(/\b\w/g, (m) => m.toUpperCase())
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function formatScalar(value: unknown): string {
  if (value === null) return 'null'
  if (value === undefined) return '—'
  if (typeof value === 'number') {
    if (Number.isFinite(value)) return value % 1 === 0 ? String(value) : value.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')
    return String(value)
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'string') return value
  return String(value)
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 14,
        background: 'rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '10px 12px',
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 0.25,
          borderBottom: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.03)',
        }}
      >
        {title}
      </div>
      <div style={{ padding: 12 }}>{children}</div>
    </section>
  )
}

function KeyValueGrid({ obj }: { obj: Record<string, unknown> }) {
  const entries = Object.entries(obj)
  if (entries.length === 0) return <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>No fields</div>

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 0.9fr) 1fr', gap: 10, alignItems: 'start' }}>
      {entries.map(([k, v]) => (
        <React.Fragment key={k}>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 700 }}>{toLabel(k)}</div>
          <div style={{ color: 'rgba(255,255,255,0.92)', fontSize: 12 }}>
            {isPlainObject(v) ? <TelemetryObject value={v} depth={1} /> : Array.isArray(v) ? <TelemetryArray value={v} /> : formatScalar(v)}
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

function TelemetryArray({ value }: { value: unknown[] }) {
  if (value.length === 0) return <span style={{ color: 'rgba(255,255,255,0.6)' }}>[]</span>
  if (value.every((v) => typeof v !== 'object' || v === null)) {
    const preview = value.slice(0, 24).map(formatScalar).join(', ')
    const suffix = value.length > 24 ? ` … (+${value.length - 24})` : ''
    return <span style={{ color: 'rgba(255,255,255,0.85)' }}>[{preview}{suffix}]</span>
  }
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {value.map((item, idx) => (
        <Card key={idx} title={`Item ${idx + 1}`}>
          {isPlainObject(item) ? <KeyValueGrid obj={item} /> : formatScalar(item)}
        </Card>
      ))}
    </div>
  )
}

function TelemetryObject({ value, depth }: { value: Record<string, unknown>; depth: number }) {
  const entries = Object.entries(value)
  const shouldCard =
    depth === 0 ||
    entries.some(([, v]) => isPlainObject(v) || (Array.isArray(v) && v.some((x) => isPlainObject(x))))

  if (!shouldCard) return <KeyValueGrid obj={value} />

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {entries.map(([k, v]) => {
        if (isPlainObject(v)) {
          return (
            <Card key={k} title={toLabel(k)}>
              <KeyValueGrid obj={v} />
            </Card>
          )
        }
        if (Array.isArray(v)) {
          return (
            <Card key={k} title={toLabel(k)}>
              <TelemetryArray value={v} />
            </Card>
          )
        }
        return (
          <Card key={k} title={toLabel(k)}>
            <div style={{ fontSize: 13, fontWeight: 800 }}>{formatScalar(v)}</div>
          </Card>
        )
      })}
    </div>
  )
}

export default function TelemetryView({
  title,
  value,
  emptyHint,
}: {
  title: string
  value: Record<string, unknown> | null
  emptyHint?: string
}) {
  return (
    <div style={{ padding: 16, width: '100%' }}>
      {title ? (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 0.2 }}>{title}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Auto-updates while `npm run dev` is running</div>
        </div>
      ) : null}

      {!value ? (
        <div
          style={{
            border: '1px dashed rgba(255,255,255,0.25)',
            borderRadius: 14,
            padding: 16,
            color: 'rgba(255,255,255,0.7)',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          {emptyHint ?? 'Waiting for telemetry…'}
        </div>
      ) : (
        <TelemetryObject value={value} depth={0} />
      )}
    </div>
  )
}

