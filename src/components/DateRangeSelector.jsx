import { parseISO, addDays, format } from 'date-fns'

function getDaysInWeek(weekStart, weekEnd) {
  if (!weekStart) return []
  try {
    const start = parseISO(weekStart)
    const end = weekEnd ? parseISO(weekEnd) : addDays(start, 6)
    const days = []
    let cur = start
    while (cur <= end) {
      days.push({
        date: format(cur, 'yyyy-MM-dd'),
        label: format(cur, 'EEE MMM d'),
      })
      cur = addDays(cur, 1)
    }
    return days
  } catch {
    return []
  }
}

export default function DateRangeSelector({ weekData, selected, onChange }) {
  if (!weekData) return null
  const days = getDaysInWeek(weekData.weekStart, weekData.weekEnd)

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold uppercase tracking-widest" style={{ color: '#999', fontFamily: 'League Spartan, sans-serif' }}>
        Date Range
      </label>
      <select
        value={selected ?? 'full'}
        onChange={e => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg text-sm font-semibold appearance-none cursor-pointer"
        style={{ background: '#fff', color: '#1A1A1A', border: '1.5px solid #e8e4dd', fontFamily: 'League Spartan, sans-serif', minWidth: 180 }}
      >
        <option value="full">Full Week</option>
        {days.map(d => (
          <option key={d.date} value={d.date}>{d.label}</option>
        ))}
      </select>
    </div>
  )
}
