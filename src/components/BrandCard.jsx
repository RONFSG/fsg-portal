import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function BrandCard({ brand, index }) {
  const navigate = useNavigate()

  const lastUpdated = brand.lastUpdated?.toDate
    ? brand.lastUpdated.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : brand.lastUpdated ?? null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: 'easeOut' }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(122,21,21,0.18)' }}
      className="rounded-2xl p-5 flex flex-col gap-4 cursor-default"
      style={{ background: '#fff', border: '1px solid rgba(122,21,21,0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
    >
      <div>
        <h3 className="text-base font-black uppercase tracking-wider truncate"
          style={{ fontFamily: '"League Spartan", Anton, sans-serif', color: '#1A1A1A' }}>
          {brand.name}
        </h3>
        {lastUpdated && (
          <p className="text-xs mt-0.5" style={{ color: '#999' }}>Updated {lastUpdated}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/report/${brand.slug}/weekly`)}
          className="flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 hover:opacity-90 active:scale-95"
          style={{ background: '#7A1515', color: '#F0EDE6', fontFamily: '"League Spartan", sans-serif' }}
        >
          Weekly Report
        </button>
        <button
          onClick={() => navigate(`/report/${brand.slug}/inventory`)}
          className="flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-95"
          style={{ background: 'transparent', color: '#7A1515', border: '1.5px solid #7A1515', fontFamily: '"League Spartan", sans-serif' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#7A1515'; e.currentTarget.style.color = '#F0EDE6' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7A1515' }}
        >
          Inventory
        </button>
      </div>
    </motion.div>
  )
}
