import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import BrandCard from '../components/BrandCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { useBrandData } from '../hooks/useBrandData'

export default function DashboardPage() {
  const [search, setSearch] = useState('')
  const { brands, loading } = useBrandData()

  const filtered = brands.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex min-h-screen" style={{ background: '#F0EDE6' }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="sticky top-0 z-20 flex items-center gap-4 px-6 py-4 md:pl-6 pl-16"
          style={{ background: 'rgba(240,237,230,0.92)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(122,21,21,0.1)' }}
        >
          <div>
            <h1 className="text-xl font-black uppercase tracking-widest leading-none"
              style={{ fontFamily: '"League Spartan", Anton, sans-serif', color: '#7A1515' }}>
              Dashboard
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>{brands.length} brands</p>
          </div>
          <div className="ml-auto">
            <input
              type="text"
              placeholder="Search brands…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 rounded-xl text-sm outline-none"
              style={{ background: '#fff', border: '1.5px solid rgba(122,21,21,0.2)', color: '#1A1A1A', fontFamily: '"League Spartan", sans-serif', width: 200 }}
            />
          </div>
        </header>

        <main className="flex-1 p-6">
          {loading ? (
            <LoadingSkeleton count={brands.length || 23} />
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-20" style={{ color: '#7A1515' }}>
              <p className="font-semibold opacity-50">No brands match "{search}"</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((brand, i) => (
                <BrandCard key={brand.slug} brand={brand} index={i} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
