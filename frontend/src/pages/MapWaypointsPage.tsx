import { useEffect, useMemo, useRef, useState } from 'react'

import prMapPng from '../../better.png'
import waypointPng from '../../7987463.png'

type Waypoint = {
  id: string
  // stored in the *displayed* (rotated view-space) normalized coords
  u: number // 0..1 (x across rotated bounding box)
  v: number // 0..1 (y down rotated bounding box)
}

const STORAGE_KEY = 'tttdtt:pr-map:waypoints:v1'

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16)
}

export default function MapWaypointsPage() {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const groupRef = useRef<HTMLDivElement | null>(null)

  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null)
  const [scale, setScale] = useState(1)
  const [waypoints, setWaypoints] = useState<Waypoint[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw) as Waypoint[]
      if (!Array.isArray(parsed)) return []
      return parsed.filter((w) => typeof w?.id === 'string' && typeof w?.u === 'number' && typeof w?.v === 'number')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(waypoints))
  }, [waypoints])

  useEffect(() => {
    function recomputeScale() {
      if (!natural) return
      const vw = window.innerWidth
      const vh = window.innerHeight - 56 // account for top nav

      // we rotate 90deg, so displayed bounding box is (h * scale) x (w * scale)
      const s = Math.min(vw / natural.h, vh / natural.w)
      setScale(Number.isFinite(s) && s > 0 ? s : 1)
    }

    recomputeScale()
    window.addEventListener('resize', recomputeScale)
    return () => window.removeEventListener('resize', recomputeScale)
  }, [natural])

  // Display is rotated 90deg, so the stage bbox is swapped (h x w).
  const stageSize = useMemo(() => {
    if (!natural) return null
    return { w: natural.h * scale, h: natural.w * scale }
  }, [natural, scale])

  const imageSize = useMemo(() => {
    if (!natural) return null
    return { w: natural.w * scale, h: natural.h * scale }
  }, [natural, scale])

  function onImageLoad() {
    const img = imgRef.current
    if (!img) return
    const w = img.naturalWidth
    const h = img.naturalHeight
    if (w && h) setNatural({ w, h })
  }

  function addWaypointFromClick(e: React.MouseEvent) {
    if (!natural || !stageSize || !groupRef.current) return

    // Click is measured in the stage's (unrotated) bounding rect.
    // Waypoints are stored in this same normalized stage space.
    const rect = groupRef.current.getBoundingClientRect()
    const u = clamp01((e.clientX - rect.left) / rect.width)
    const v = clamp01((e.clientY - rect.top) / rect.height)

    setWaypoints((prev) => [...prev, { id: uid(), u, v }])
  }

  function deleteWaypoint(id: string) {
    setWaypoints((prev) => prev.filter((w) => w.id !== id))
  }

  return (
    <div
      style={{
        width: '100%',
        height: 'calc(100vh - 56px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 10,
      }}
    >
      <div style={{ position: 'absolute', left: 16, bottom: 16, zIndex: 5, display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>
          Click to add waypoint. Click waypoint to delete. Stored in localStorage.
        </div>
        <button
          onClick={() => setWaypoints([])}
          style={{
            padding: '8px 10px',
            fontSize: 12,
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.14)',
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          Clear
        </button>
      </div>

      {/* Rotated group: image and waypoints rotate together */}
      <div
        ref={groupRef}
        onClick={addWaypointFromClick}
        style={{
          position: 'relative',
          width: stageSize ? stageSize.w : 'min(80vw, 900px)',
          height: stageSize ? stageSize.h : 'min(60vh, 600px)',
          cursor: 'crosshair',
          userSelect: 'none',
          touchAction: 'none',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.03)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.55)',
        }}
      >
        <img
          ref={imgRef}
          src={prMapPng}
          onLoad={onImageLoad}
          alt="PR Map"
          draggable={false}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: imageSize ? imageSize.w : '100%',
            height: imageSize ? imageSize.h : '100%',
            transform: 'translate(-50%, -50%) rotate(90deg)',
            transformOrigin: 'center center',
            display: 'block',
            pointerEvents: 'none',
          }}
        />

        {stageSize &&
          waypoints.map((w) => (
            <button
              key={w.id}
              onClick={(ev) => {
                ev.stopPropagation()
                deleteWaypoint(w.id)
              }}
              title="Delete waypoint"
              style={{
                position: 'absolute',
                left: `${w.u * 100}%`,
                top: `${w.v * 100}%`,
                transform: 'translate(-50%, -50%)',
                width: 28,
                height: 28,
                padding: 0,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              <img src={waypointPng} alt="" draggable={false} style={{ width: 28, height: 28, display: 'block' }} />
            </button>
          ))}
      </div>
    </div>
  )
}

