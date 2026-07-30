import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    if (target === null || target === undefined || isNaN(Number(target))) {
      setValue(target)
      return
    }
    const num = Number(target)
    const start = performance.now()
    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(eased * num)
      if (progress < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return value
}

export default function MetricCard({ label, value, format = 'number', prefix = '', suffix = '', wow, color }) {
  const animated = useCountUp(typeof value === 'number' ? value : null)

  function formatValue(v) {
    if (v === null || v === undefined || v === '') return '—'
    const n = typeof v === 'number' ? v : Number(v)
    if (isNaN(n)) return v
    if (format === 'currency') return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    if (format === 'percent') return `${n.toFixed(1)}%`
    if (format === 'decimal') return n.toFixed(2)
    if (format === 'compact') {
      if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
      if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
      return `$${n.toFixed(0)}`
    }
    return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
  }

  const wowNum = wow !== undefined && wow !== null ? Number(wow) : null
  const wowPos = wowNum !== null && wowNum > 0
  const wowNeg = wowNum !== null && wowNum < 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-xl p-4 flex flex-col gap-1"
      style={{ background: '#fff', border: '1px solid #e8e4dd', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
    >
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#999', fontFamily: 'League Spartan, sans-serif' }}>
        {label}
      </span>
      <span className="text-2xl font-black" style={{ color: color || '#1A1A1A', fontFamily: 'League Spartan, sans-serif' }}>
        {prefix}{typeof animated === 'number' ? formatValue(animated) : formatValue(value)}{suffix}
      </span>
      {wowNum !== null && (
        <span className="text-xs font-semibold" style={{ color: wowPos ? '#16a34a' : wowNeg ? '#dc2626' : '#999' }}>
          {wowPos ? '▲' : wowNeg ? '▼' : ''}  {wowNum > 0 ? '+' : ''}{wowNum.toFixed(1)}% WoW
        </span>
      )}
    </motion.div>
  )
}
