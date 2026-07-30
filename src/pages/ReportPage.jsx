import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BRANDS, getReportUrl } from '../utils/brands'

export default function ReportPage() {
  const { slug, type } = useParams()
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)

  const brand = BRANDS.find((b) => b.slug === slug)
  const reportUrl = getReportUrl(slug, type)
  const typeLabel = type === 'weekly' ? 'Weekly Report' : 'Inventory Update'

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="flex flex-col min-h-screen"
      style={{ background: '#F0EDE6' }}
    >
      {/* Top bar */}
      <header
        className="flex items-center gap-4 px-5 py-4 flex-shrink-0"
        style={{
          background: '#7A1515',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
          style={{ color: '#F0EDE6', fontFamily: '"League Spartan", sans-serif' }}
        >
          <span className="text-lg">←</span>
          Back
        </button>

        <div className="h-5 w-px" style={{ background: 'rgba(240,237,230,0.3)' }} />

        <div className="flex-1 min-w-0">
          <h1
            className="text-lg font-black uppercase tracking-widest truncate leading-none"
            style={{ fontFamily: '"League Spartan", Anton, sans-serif', color: '#F0EDE6' }}
          >
            {brand?.name || slug}
          </h1>
          <p className="text-xs mt-0.5 tracking-wide" style={{ color: 'rgba(240,237,230,0.65)' }}>
            {typeLabel}
          </p>
        </div>

        <span
          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex-shrink-0"
          style={{
            background: type === 'weekly' ? '#F0EDE6' : 'transparent',
            color: type === 'weekly' ? '#7A1515' : '#F0EDE6',
            border: type === 'inventory' ? '1px solid rgba(240,237,230,0.5)' : 'none',
          }}
        >
          {typeLabel}
        </span>
      </header>

      {/* iframe */}
      <div className="flex-1 relative">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#F0EDE6' }}>
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin h-10 w-10" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#7A1515" strokeWidth="3" />
                <path className="opacity-80" fill="#7A1515" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <p
                className="text-sm font-semibold"
                style={{ color: '#7A1515', fontFamily: '"League Spartan", sans-serif' }}
              >
                Loading report…
              </p>
            </div>
          </div>
        )}
        <iframe
          src={reportUrl}
          title={`${brand?.name} ${typeLabel}`}
          className="w-full h-full border-0"
          style={{ minHeight: 'calc(100vh - 73px)' }}
          onLoad={() => setLoaded(true)}
        />
      </div>
    </motion.div>
  )
}
