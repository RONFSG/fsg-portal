export default function WeekSelector({ weeks, selected, onChange }) {
  if (!weeks?.length) return null

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold uppercase tracking-widest" style={{ color: '#999', fontFamily: 'League Spartan, sans-serif' }}>
        Week
      </label>
      <select
        value={selected ?? ''}
        onChange={e => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg text-sm font-semibold appearance-none cursor-pointer"
        style={{
          background: '#fff',
          color: '#1A1A1A',
          border: '1.5px solid #e8e4dd',
          fontFamily: 'League Spartan, sans-serif',
          minWidth: 240,
        }}
      >
        {weeks.map(w => (
          <option key={w.id} value={w.id}>
            {w.weekLabel ? `${w.weekLabel} · ${w.dateRange ?? ''}` : w.id}
          </option>
        ))}
      </select>
    </div>
  )
}
