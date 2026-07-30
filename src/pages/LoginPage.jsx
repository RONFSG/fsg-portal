import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signInWithGoogle } from '../firebase/auth'
import { useAuth } from '../hooks/useAuth'

const FLOATING = [
  { cls: 'float-1', style: { top: '8%', left: '5%', width: 80, height: 80, borderRadius: '20%', background: 'rgba(240,237,230,0.08)' } },
  { cls: 'float-2', style: { top: '15%', right: '8%', width: 120, height: 120, borderRadius: '50%', background: 'rgba(240,237,230,0.06)' } },
  { cls: 'float-3', style: { bottom: '20%', left: '10%', width: 60, height: 60, borderRadius: '30%', background: 'rgba(240,237,230,0.07)' } },
  { cls: 'float-4', style: { bottom: '10%', right: '15%', width: 100, height: 100, borderRadius: '40%', background: 'rgba(240,237,230,0.05)' } },
  { cls: 'float-5', style: { top: '40%', left: '3%', width: 70, height: 70, borderRadius: '50%', background: 'rgba(240,237,230,0.06)' } },
  { cls: 'float-6', style: { top: '60%', right: '5%', width: 90, height: 90, borderRadius: '15%', background: 'rgba(240,237,230,0.07)' } },
  { cls: 'float-1', style: { top: '30%', right: '25%', width: 50, height: 50, borderRadius: '50%', background: 'rgba(240,237,230,0.04)' } },
  { cls: 'float-3', style: { bottom: '35%', left: '30%', width: 40, height: 40, borderRadius: '20%', background: 'rgba(240,237,230,0.05)' } },
]

export default function LoginPage() {
  const { authError } = useAuth()
  const [localError, setLocalError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  const error = authError || localError

  async function handleSignIn() {
    setLoading(true)
    setLocalError('')
    try {
      await signInWithGoogle()
    } catch (e) {
      const msg = e.code === 'auth/popup-closed-by-user'
        ? 'Sign-in cancelled.'
        : 'Sign-in failed. Please try again.'
      setLocalError(msg)
      setShakeKey(k => k + 1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#7A1515' }}>
      {FLOATING.map((f, i) => (
        <div key={i} className={`absolute pointer-events-none ${f.cls}`} style={f.style} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div className="rounded-2xl p-8 flex flex-col items-center gap-6 shadow-2xl"
          style={{ background: '#8B1515', border: '1px solid rgba(240,237,230,0.15)' }}>
          <motion.img
            src="https://ronfsg.github.io/flagship-growth-reports/assets/fsg-logo.png"
            alt="FSG Logo"
            className="h-16 w-auto object-contain"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />

          <div className="text-center">
            <h1 className="text-4xl font-black uppercase tracking-widest"
              style={{ fontFamily: '"League Spartan", Anton, sans-serif', color: '#F0EDE6' }}>
              FSG PORTAL
            </h1>
            <p className="mt-1 text-sm tracking-wider" style={{ color: 'rgba(240,237,230,0.65)' }}>
              Internal Reporting Dashboard
            </p>
          </div>

          <div className="w-full h-px" style={{ background: 'rgba(240,237,230,0.2)' }} />

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-xl font-bold text-sm transition-all duration-200 hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: '#F0EDE6', color: '#1A1A1A', fontFamily: '"League Spartan", sans-serif', letterSpacing: '0.05em' }}
          >
            {!loading && (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {loading ? 'Signing in…' : 'Sign in with Google'}
          </button>

          <AnimatePresence>
            {error && (
              <motion.div
                key={shakeKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: [0, -8, 8, -6, 6, -3, 3, 0] }}
                exit={{ opacity: 0 }}
                transition={{ x: { duration: 0.5 }, opacity: { duration: 0.2 } }}
                className="w-full text-center text-sm py-2 px-3 rounded-lg"
                style={{ background: 'rgba(0,0,0,0.25)', color: '#F0EDE6', border: '1px solid rgba(240,237,230,0.3)' }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs text-center" style={{ color: 'rgba(240,237,230,0.4)' }}>
            Restricted to @flagshipgrowth.com accounts
          </p>
        </div>
      </motion.div>
    </div>
  )
}
