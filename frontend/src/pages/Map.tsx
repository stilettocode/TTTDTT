// pages/Map.tsx
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent, PointerEvent } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import mapImage from '../assets/dust-map.png'
import { useSocket } from '../context/SocketContext'
import type { MatrixUpdate } from '../types'

const IMAGE_WIDTH = 2452
const IMAGE_HEIGHT = 1551
const PORTRAIT_WIDTH = IMAGE_HEIGHT
const PORTRAIT_HEIGHT = IMAGE_WIDTH
const WORLD_MIN_X = -6600
const WORLD_MAX_X = -5100
const WORLD_MIN_Y = -11100
const WORLD_MAX_Y = -10200
const WORLD_WIDTH = WORLD_MAX_X - WORLD_MIN_X
const WORLD_HEIGHT = WORLD_MAX_Y - WORLD_MIN_Y
const CELL_WIDTH = IMAGE_WIDTH / WORLD_WIDTH
const CELL_HEIGHT = IMAGE_HEIGHT / WORLD_HEIGHT

const MATRIX_COLORS: Record<number, string> = {
  1: 'rgba(59, 130, 246, 0.82)',
  2: 'rgba(34, 197, 94, 0.82)',
  3: 'rgba(250, 204, 21, 0.86)',
  4: 'rgba(168, 85, 247, 0.82)',
  5: 'rgba(255, 255, 255, 0.9)',
}

const WAYPOINT_COLORS = {
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#eab308',
  green: '#22c55e',
  blue: '#3b82f6',
  purple: '#a855f7',
}

type MatrixCells = Map<string, number>
type WaypointColor = keyof typeof WAYPOINT_COLORS

interface Waypoint {
  id: string
  name: string
  color: WaypointColor
  x: number
  y: number
}

function cellKey(x: number, y: number) {
  return `${x},${y}`
}

function applyMatrixUpdate(current: MatrixCells, update: MatrixUpdate) {
  const next = new Map(current)

  update.data.forEach((row, rowIndex) => {
    row.forEach((rawValue, colIndex) => {
      const x = update.topleft.x + colIndex
      const y = update.topleft.y + rowIndex
      if (x < WORLD_MIN_X || x >= WORLD_MAX_X || y < WORLD_MIN_Y || y >= WORLD_MAX_Y) return

      const key = cellKey(x, y)
      const value = Number(rawValue)
      if (value === 0) {
        next.delete(key)
        return
      }

      if (MATRIX_COLORS[value]) next.set(key, value)
    })
  })

  return next
}

function MatrixOverlay({ cells }: { cells: MatrixCells }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `700 ${Math.max(1, Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.72)}px monospace`

    cells.forEach((value, key) => {
      const [x, y] = key.split(',').map(Number)
      const color = MATRIX_COLORS[value]
      if (!color) return

      const left = (x - WORLD_MIN_X) * CELL_WIDTH
      const top = (y - WORLD_MIN_Y) * CELL_HEIGHT
      ctx.fillStyle = color
      ctx.fillRect(left, top, CELL_WIDTH, CELL_HEIGHT)

      ctx.fillStyle = value === 3 || value === 5 ? '#111827' : '#f8fafc'
      ctx.fillText(String(value), left + CELL_WIDTH / 2, top + CELL_HEIGHT / 2)
    })
  }, [cells])

  return (
    <canvas
      ref={canvasRef}
      width={IMAGE_WIDTH}
      height={IMAGE_HEIGHT}
      style={{
        position: 'absolute',
        inset: 0,
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        pointerEvents: 'none',
      }}
    />
  )
}

function WaypointMarkers({
  activeWaypointId,
  onSelect,
  waypoints,
}: {
  activeWaypointId: string | null
  onSelect: (id: string) => void
  waypoints: Waypoint[]
}) {
  return (
    <>
      {waypoints.map((waypoint) => (
        <button
          key={waypoint.id}
          type="button"
          aria-label={`Select ${waypoint.name}`}
          onClick={(event) => {
            event.stopPropagation()
            onSelect(waypoint.id)
          }}
          style={{
            position: 'absolute',
            left: waypoint.x,
            top: waypoint.y,
            width: activeWaypointId === waypoint.id ? 28 : 22,
            height: activeWaypointId === waypoint.id ? 28 : 22,
            borderRadius: '50%',
            background: WAYPOINT_COLORS[waypoint.color],
            border: activeWaypointId === waypoint.id ? '3px solid white' : '2px solid rgba(255,255,255,0.85)',
            boxShadow: '0 0 0 2px rgba(0,0,0,0.55), 0 0 12px rgba(0,0,0,0.45)',
            cursor: 'pointer',
            padding: 0,
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
          }}
        />
      ))}
    </>
  )
}

function WaypointPanel({
  activeWaypointId,
  onCollapse,
  onDelete,
  onSelect,
  onUpdate,
  waypoints,
}: {
  activeWaypointId: string | null
  onCollapse: () => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
  onUpdate: (id: string, patch: Partial<Pick<Waypoint, 'color' | 'name'>>) => void
  waypoints: Waypoint[]
}) {
  return (
    <aside
      onClick={onCollapse}
      style={{
        width: 400,
        height: '100%',
        background: '#0a0a0a',
        color: 'white',
        padding: 16,
        flexShrink: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        fontFamily: 'sans-serif',
      }}
    >
      <div>
        <h2 style={{ margin: '0 0 6px 0', fontSize: 16, fontWeight: 700 }}>Waypoints</h2>
        <p style={{ margin: 0, color: '#aaa', fontSize: 13 }}>
          Left-click the map to add a waypoint. Select a marker or card to edit it.
        </p>
      </div>

      {waypoints.length === 0 ? (
        <div style={{ border: '1px dashed #333', borderRadius: 10, color: '#777', padding: 16, fontSize: 13 }}>
          No waypoints yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {waypoints.map((waypoint, index) => {
            const isActive = waypoint.id === activeWaypointId

            return (
              <section
                key={waypoint.id}
                onClick={(event) => {
                  event.stopPropagation()
                  onSelect(waypoint.id)
                }}
                style={{
                  background: '#1e1e1e',
                  border: isActive ? '1px solid rgba(255,255,255,0.45)' : '1px solid transparent',
                  borderRadius: 10,
                  cursor: 'pointer',
                  padding: 12,
                  position: 'relative',
                }}
              >
                <button
                  type="button"
                  aria-label={`Delete ${waypoint.name}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    onDelete(waypoint.id)
                  }}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    width: 22,
                    height: 22,
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: 6,
                    background: 'rgba(0,0,0,0.35)',
                    color: '#ddd',
                    cursor: 'pointer',
                    fontSize: 14,
                    lineHeight: '18px',
                    padding: 0,
                  }}
                >
                  ×
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: WAYPOINT_COLORS[waypoint.color],
                      border: '2px solid rgba(255,255,255,0.75)',
                      flexShrink: 0,
                    }}
                  />
                  <strong style={{ flex: 1, fontSize: 14 }}>{waypoint.name}</strong>
                  <span style={{ color: '#888', fontSize: 12 }}>{isActive ? '∧' : '∨'}</span>
                </div>

                {isActive && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, color: '#bbb', fontSize: 12 }}>
                      Name
                      <input
                        value={waypoint.name}
                        onChange={(event) => onUpdate(waypoint.id, { name: event.target.value })}
                        onClick={(event) => event.stopPropagation()}
                        style={{
                          background: '#111',
                          border: '1px solid #333',
                          borderRadius: 6,
                          color: 'white',
                          fontSize: 14,
                          padding: '8px 10px',
                        }}
                      />
                    </label>

                    <div>
                      <div style={{ color: '#bbb', fontSize: 12, marginBottom: 6 }}>Color</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {(Object.keys(WAYPOINT_COLORS) as WaypointColor[]).map((color) => (
                          <button
                            key={color}
                            type="button"
                            aria-label={`Set waypoint color to ${color}`}
                            onClick={(event) => {
                              event.stopPropagation()
                              onUpdate(waypoint.id, { color })
                            }}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              background: WAYPOINT_COLORS[color],
                              border: color === waypoint.color ? '3px solid white' : '2px solid #444',
                              cursor: 'pointer',
                              padding: 0,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div style={{ color: '#888', fontSize: 12 }}>
                      #{index + 1} · Image position {Math.round(waypoint.x)}, {Math.round(waypoint.y)}
                    </div>
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}
    </aside>
  )
}

export default function MapPage() {
  const { matrixUpdate } = useSocket() as { matrixUpdate: MatrixUpdate | null }
  const [matrixCells, setMatrixCells] = useState<MatrixCells>(() => new Map())
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const [activeWaypointId, setActiveWaypointId] = useState<string | null>(null)
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null)
  const scaleX = window.innerWidth / PORTRAIT_WIDTH
  const scaleY = window.innerHeight / PORTRAIT_HEIGHT
  const fitScale = Math.min(scaleX, scaleY)

  useEffect(() => {
    if (!matrixUpdate) return
    setMatrixCells((current) => applyMatrixUpdate(current, matrixUpdate))
  }, [matrixUpdate])

  const updateWaypoint = (id: string, patch: Partial<Pick<Waypoint, 'color' | 'name'>>) => {
    setWaypoints((current) =>
      current.map((waypoint) => (waypoint.id === id ? { ...waypoint, ...patch } : waypoint)),
    )
  }

  const deleteWaypoint = (id: string) => {
    setWaypoints((current) => current.filter((waypoint) => waypoint.id !== id))
    setActiveWaypointId((current) => (current === id ? null : current))
  }

  const handleMapPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    pointerDownRef.current = { x: event.clientX, y: event.clientY }
  }

  const handleMapClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return

    const pointerDown = pointerDownRef.current
    pointerDownRef.current = null
    if (pointerDown) {
      const distance = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y)
      if (distance > 5) return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const portraitX = ((event.clientX - rect.left) / rect.width) * PORTRAIT_WIDTH
    const portraitY = ((event.clientY - rect.top) / rect.height) * PORTRAIT_HEIGHT
    const x = Math.max(0, Math.min(IMAGE_WIDTH, portraitY))
    const y = Math.max(0, Math.min(IMAGE_HEIGHT, IMAGE_HEIGHT - portraitX))
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const waypoint: Waypoint = {
      id,
      name: `Waypoint ${waypoints.length + 1}`,
      color: 'red',
      x,
      y,
    }

    setWaypoints((current) => [...current, waypoint])
    setActiveWaypointId(id)
  }

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>

      <WaypointPanel
        activeWaypointId={activeWaypointId}
        onCollapse={() => setActiveWaypointId(null)}
        onDelete={deleteWaypoint}
        onSelect={setActiveWaypointId}
        onUpdate={updateWaypoint}
        waypoints={waypoints}
      />

      {/* Map - takes up remaining space */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <TransformWrapper
          initialScale={fitScale}
          minScale={fitScale}
          maxScale={10}
          wheel={{ step: 0.1 }}
        >
          <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
            <div
              onClick={handleMapClick}
              onPointerDown={handleMapPointerDown}
              style={{ position: 'relative', width: PORTRAIT_WIDTH, height: PORTRAIT_HEIGHT, cursor: 'crosshair' }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: IMAGE_WIDTH,
                  height: IMAGE_HEIGHT,
                  transform: 'translate(-50%, -50%) rotate(90deg)',
                  transformOrigin: 'center',
                }}
              >
                <img
                  src={mapImage}
                  alt="Lunar Map"
                  draggable={false}
                  style={{ display: 'block', width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
                />
                <MatrixOverlay cells={matrixCells} />
                <WaypointMarkers
                  activeWaypointId={activeWaypointId}
                  onSelect={setActiveWaypointId}
                  waypoints={waypoints}
                />
              </div>
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>


    </div>
  )
}