import { NavLink, Outlet } from 'react-router-dom'

const linkBase: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 10,
  textDecoration: 'none',
  color: 'rgba(255,255,255,0.85)',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)',
  fontSize: 13,
  fontWeight: 600,
}

function TopNav() {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        gap: 10,
        height: 56,
        padding: '0 12px',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, rgba(11,13,18,0.92), rgba(11,13,18,0.65))',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.10)',
      }}
    >
      <div style={{ fontWeight: 800, letterSpacing: 0.4, marginRight: 6 }}>TTTDTT</div>
      <NavLink
        to="/eva"
        style={({ isActive }) => ({
          ...linkBase,
          borderColor: isActive ? 'rgba(102,140,255,0.9)' : linkBase.border as string,
          background: isActive ? 'rgba(102,140,255,0.18)' : linkBase.background as string,
        })}
      >
        EVA Telemetry
      </NavLink>
      <NavLink
        to="/rover-ltv"
        style={({ isActive }) => ({
          ...linkBase,
          borderColor: isActive ? 'rgba(102,140,255,0.9)' : linkBase.border as string,
          background: isActive ? 'rgba(102,140,255,0.18)' : linkBase.background as string,
        })}
      >
        Rover / LTV + Stream
      </NavLink>
      <NavLink
        to="/map"
        style={({ isActive }) => ({
          ...linkBase,
          borderColor: isActive ? 'rgba(102,140,255,0.9)' : linkBase.border as string,
          background: isActive ? 'rgba(102,140,255,0.18)' : linkBase.background as string,
        })}
      >
        PR Map + Waypoints
      </NavLink>
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
        Live via Socket.IO @ <span style={{ color: 'rgba(255,255,255,0.85)' }}>localhost:5001</span>
      </div>
    </div>
  )
}

export default function Layout() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '100vh' }}>
      <TopNav />
      <Outlet />
    </div>
  )
}

