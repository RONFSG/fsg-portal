import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import MetricCard from '../components/MetricCard'
import DailySalesChart from '../components/DailySalesChart'
import TopProductsTable from '../components/TopProductsTable'
import InsightsBox from '../components/InsightsBox'
import WeekSelector from '../components/WeekSelector'
import DateRangeSelector from '../components/DateRangeSelector'
import LoadingSpinner from '../components/LoadingSpinner'
import { useWeeklyData } from '../hooks/useWeeklyData'
import { BRANDS } from '../constants/brands'

function pct(a, b) {
  if (!b || !a) return null
  return ((a - b) / b) * 100
}

export default function WeeklyReport() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const brand = BRANDS.find(b => b.slug === slug)

  const {
    weeks, selectedWeek, setSelectedWeek,
    weekData, dailyData, selectedDate, setSelectedDate,
    loading,
  } = useWeeklyData(slug)

  const data = selectedDate !== 'full' && dailyData ? dailyData : weekData

  const metrics = data ? [
    {
      label: 'Total Sales',
      value: data.sales,
      format: 'compact',
      wow: weekData && weekData.prevSales ? pct(weekData.sales, weekData.prevSales) : null,
    },
    { label: 'Ad Spend', value: data.spend, format: 'compact' },
    {
      label: 'ROAS',
      value: data.roas,
      format: 'decimal',
      wow: weekData && weekData.prevRoas ? pct(weekData.roas, weekData.prevRoas) : null,
    },
    { label: 'TACoS', value: data.tacos, format: 'percent' },
    { label: 'ACoS', value: data.acos, format: 'percent' },
    { label: 'Units', value: data.units, format: 'number' },
    { label: 'CVR', value: data.cvr, format: 'percent' },
    { label: 'CTR', value: data.ctr, format: 'percent' },
  ] : []

  const selectedWeekObj = weeks.find(w => w.id === selectedWeek)

  return (
    <div className="flex min-h-screen" style={{ background: '#F0EDE6' }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
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
            <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>
              Weekly Report {selectedWeekObj ? `· ${selectedWeekObj.weekLabel} · ${selectedWeekObj.dateRange ?? ''}` : ''}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3 flex-wrap">
            <WeekSelector weeks={weeks} selected={selectedWeek} onChange={setSelectedWeek} />
            <DateRangeSelector weekData={weekData} selected={selectedDate} onChange={setSelectedDate} />
          </div>
        </header>

        <motion.main
          key={`${selectedWeek}-${selectedDate}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex-1 p-6 flex flex-col gap-6"
        >
          {loading ? (
            <div className="flex items-center justify-center flex-1">
              <LoadingSpinner size={40} />
            </div>
          ) : !weekData && !loading ? (
            <div className="text-center mt-20" style={{ color: '#999' }}>
              <p className="font-semibold">No weekly data found for {brand?.name ?? slug}.</p>
              <p className="text-sm mt-1">Upload data via the Apps Script push functions.</p>
            </div>
          ) : (
            <>
              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
              </div>

              {/* Daily chart */}
              {weekData?.dailyTotals && (
                <DailySalesChart
                  dailyTotals={weekData.dailyTotals}
                  selectedDate={selectedDate !== 'full' ? selectedDate : null}
                />
              )}

              {/* Organic vs Paid */}
              {weekData && (weekData.organicSales !== undefined || weekData.adSales !== undefined) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid #e8e4dd' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#999', fontFamily: 'League Spartan, sans-serif' }}>Organic Sales</p>
                    <p className="text-3xl font-black" style={{ color: '#1A1A1A', fontFamily: 'League Spartan, sans-serif' }}>
                      ${Number(weekData.organicSales ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid #e8e4dd' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#999', fontFamily: 'League Spartan, sans-serif' }}>Ad Sales</p>
                    <p className="text-3xl font-black" style={{ color: '#7A1515', fontFamily: 'League Spartan, sans-serif' }}>
                      ${Number(weekData.adSales ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Top products */}
              {weekData?.topProducts && <TopProductsTable products={weekData.topProducts} />}

              {/* Insights */}
              {weekData?.insights && <InsightsBox insights={weekData.insights} />}
            </>
          )}
        </motion.main>
      </div>
    </div>
  )
}
