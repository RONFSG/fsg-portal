import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

const FSG_LOGO = 'https://ronfsg.github.io/flagship-growth-reports/assets/fsg-logo.png'

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    to: '/brands',
    label: 'Brands',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
        <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
]

function SidebarContent({ onClose }) {
  const { user, logout } = useAuth()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'rgba(240,237,230,0.15)' }}>
        <img src={FSG_LOGO} alt="FSG" className="w-9 h-9 object-contain" />
        <span className="font-black uppercase tracking-widest text-sm" style={{ color: '#F0EDE6', fontFamily: 'League Spartan, sans-serif' }}>
          FSG Portal
        </span>
        {onClose && (
          <button onClick={onClose} className="ml-auto opacity-60 hover:opacity-100" style={{ color: '#F0EDE6' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      <nav className="flex-1 py-5 px-3 flex flex-col gap-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wide transition-all duration-150 ${
                isActive ? '' : 'opacity-60 hover:opacity-90'
              }`
            }
            style={({ isActive }) => ({
              color: '#F0EDE6',
              background: isActive ? 'rgba(240,237,230,0.15)' : 'transparent',
              fontFamily: 'League Spartan, sans-serif',
            })}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-5 border-t" style={{ borderColor: 'rgba(240,237,230,0.15)' }}>
        <div className="flex items-center gap-3 mb-3">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ background: 'rgba(240,237,230,0.2)', color: '#F0EDE6' }}>
              {user?.displayName?.[0] ?? '?'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: '#F0EDE6' }}>{user?.displayName}</p>
            <p className="text-xs truncate" style={{ color: 'rgba(240,237,230,0.5)' }}>{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-xs font-bold uppercase tracking-widest py-2 rounded-lg transition-all duration-150 hover:opacity-80"
          style={{ background: 'rgba(240,237,230,0.12)', color: '#F0EDE6', fontFamily: 'League Spartan, sans-serif' }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <div className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0" style={{ background: '#7A1515' }}>
        <SidebarContent />
      </div>

      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg"
          style={{ background: '#7A1515', color: '#F0EDE6' }}
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M3 6h18M3 12h18M3 18h18"/>
          </svg>
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
              <motion.div
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col"
                style={{ background: '#7A1515' }}
              >
                <SidebarContent onClose={() => setMobileOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
