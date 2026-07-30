export default function InventoryHealthBar({ weeksLeft }) {
  const weeks = Number(weeksLeft) || 0
  const color = weeks >= 9 ? '#16a34a' : weeks >= 5 ? '#d97706' : '#dc2626'
  const label = weeks >= 9 ? 'Healthy' : weeks >= 5 ? 'Low' : 'Critical'
  const pct = Math.min(weeks / 12, 1) * 100

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 rounded-full overflow-hidden h-2" style={{ background: '#e8e4dd' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold shrink-0" style={{ color, minWidth: 52 }}>
        {weeks}w · {label}
      </span>
    </div>
  )
}
