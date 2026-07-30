import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function DailySalesChart({ dailyTotals, selectedDate }) {
  if (!dailyTotals || Object.keys(dailyTotals).length === 0) {
    return (
      <div className="flex items-center justify-center h-40 rounded-xl" style={{ background: '#fff', border: '1px solid #e8e4dd' }}>
        <p className="text-sm" style={{ color: '#999' }}>No daily data available</p>
      </div>
    )
  }

  const data = Object.entries(dailyTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, sales]) => ({
      date,
      label: new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
      sales: Number(sales) || 0,
      isSelected: date === selectedDate,
    }))

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-lg px-3 py-2 shadow-lg text-sm" style={{ background: '#1A1A1A', color: '#F0EDE6' }}>
        <p className="font-bold">{payload[0].payload.label}</p>
        <p>${payload[0].value.toLocaleString()}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid #e8e4dd' }}>
      <h3 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: '#1A1A1A', fontFamily: 'League Spartan, sans-serif' }}>
        Daily Sales
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ede6" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false}
            tickFormatter={v => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(122,21,21,0.06)' }} />
          <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.isSelected ? '#7A1515' : '#C4A4A4'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
