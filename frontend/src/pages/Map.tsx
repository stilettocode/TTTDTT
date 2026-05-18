// pages/Map.tsx
import { useEffect, useRef, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import mapImage from '../assets/dust-map.png'
import LeftPanel from '../components/LeftPanel'
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

type MatrixCells = Map<string, number>

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

export default function MapPage() {
  const { matrixUpdate } = useSocket() as { matrixUpdate: MatrixUpdate | null }
  const [matrixCells, setMatrixCells] = useState<MatrixCells>(() => new Map())
  const scaleX = window.innerWidth / PORTRAIT_WIDTH
  const scaleY = window.innerHeight / PORTRAIT_HEIGHT
  const fitScale = Math.min(scaleX, scaleY)

  useEffect(() => {
    if (!matrixUpdate) return
    setMatrixCells((current) => applyMatrixUpdate(current, matrixUpdate))
  }, [matrixUpdate])

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>

      {/* Left Panel */}
      <LeftPanel />

      {/* Map - takes up remaining space */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <TransformWrapper
          initialScale={fitScale}
          minScale={fitScale}
          maxScale={10}
          wheel={{ step: 0.1 }}
        >
          <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
            <div style={{ position: 'relative', width: PORTRAIT_WIDTH, height: PORTRAIT_HEIGHT }}>
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
              </div>
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>


    </div>
  )
}