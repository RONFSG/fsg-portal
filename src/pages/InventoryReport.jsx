import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import InventoryTable from '../components/InventoryTable'
import InsightsBox from '../components/InsightsBox'
import LoadingSpinner from '../components/LoadingSpinner'
import { useInventoryData } from '../hooks/useInventoryData'
import { BRANDS } from '../constants/brands'

function KpiCard({ label, value, color }) {
  return (
    <div className="rounded-xl p-4 flex flex-col gap-1" style={{ background: '#fff', border: '1px solid #e8e4dd' }}>
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#999', fontFamily: 'League Spartan, sans-serif' }}>{label}</span>
      <span className="text-2xl font-black" style={{ color: color || '#1A1A1A', fontFamily: 'League Spartan, sans-serif' }}>{value ?? '—'}</span>
    </div>
  )
}

export default function InventoryReport() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const brand = BRANDS.find(b => b.slug === slug)
  const { snapshots, selectedDate, setSelectedDate, inventoryData, loading } = useInventoryData(slug)

  const products = inventoryData?.products ?? []
  const oos = products.filter(p => Number(p.available ?? 0) === 0).length
  const critical = products.filter(p => Number(p.weeksLeft ?? 99) <= 4).length

  return (
    <div className="flex min-h-screen" style={{ background: '#F0EDE6' }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 flex items-center gap-4 px-6 py-4 md:pl-6 pl-16"
          style={{ background: 'rgba(240,237,230,0.92)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(122,21,21,0.1)' }}>
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg transition-all hover:opacity-70" style={{ color: '#7A1515' }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-black uppercase tracking-widest leading-none"
              style={{ fontFamily: '"League Spartan", Anton, sans-serif', color: '#7A1515' }}>
              {brand?.name ?? slug}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>Inventory Report</p>
          </div>

          {snapshots.length > 0 && (
            <div className="ml-auto flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: '#999', fontFamily: 'League Spartan, sans-serif' }}>Date</label>
              <select
                value={selectedDate ?? ''}
                onChange={e => setSelectedDate(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm font-semibold appearance-none"
                style={{ background: '#fff', color: '#1A1A1A', border: '1.5px solid #e8e4dd', fontFamily: 'League Spartan, sans-serif', minWidth: 180 }}
              >
                {snapshots.map(s => (
                  <option key={s.id} value={s.id}>{s.dateLabel ?? s.id} {s.weekLabel ? `(${s.weekLabel})` : ''}</option>
                ))}
              </select>
            </div>
          )}
        </header>

        <motion.main
          key={selectedDate}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex-1 p-6 flex flex-col gap-6"
        >
          {loading ? (
            <div className="flex items-center justify-center flex-1">
              <LoadingSpinner size={40} />
            </div>
          ) : !inventoryData && !loading ? (
            <div className="text-center mt-20" style={{ color: '#999' }}>
              <p className="font-semibold">No inventory data found for {brand?.name ?? slug}.</p>
            </div>
          ) : (
            <>
              {/* KPI cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <KpiCard label="Total SKUs" value={products.length} />
                <KpiCard label="Available" value={products.filter(p => Number(p.available ?? 0) > 0).length} color="#16a34a" />
                <KpiCard label="Inbound" value={products.filter(p => Number(p.inbound ?? 0) > 0).length} color="#2563eb" />
                <KpiCard label="Out of Stock" value={oos} color={oos > 0 ? '#dc2626' : '#16a34a'} />
                <KpiCard label="Critical" value={critical} color={critical > 0 ? '#dc2626' : '#16a34a'} />
              </div>

              {/* Table */}
              <InventoryTable products={products} />

              {/* PO Recommendations */}
              {inventoryData?.insights && (
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: '#1A1A1A', fontFamily: 'League Spartan, sans-serif' }}>
                    PO Replenishment
                  </h2>
                  <InsightsBox insights={inventoryData.insights} />
                </div>
              )}
            </>
          )}
        </motion.main>
      </div>
    </div>
  )
}
