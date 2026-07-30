export default function InsightsBox({ insights }) {
  if (!insights) return null

  const lines = typeof insights === 'string'
    ? insights.split('\n').filter(l => l.trim())
    : Array.isArray(insights) ? insights : []

  return (
    <div className="rounded-xl p-6" style={{ background: '#2C0A0A', border: '1px solid rgba(240,237,230,0.1)' }}>
      <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#F0EDE6', fontFamily: 'League Spartan, sans-serif' }}>
        <span style={{ color: '#C4A4A4' }}>◆</span> Claude Insights
      </h3>
      <ul className="flex flex-col gap-3">
        {lines.map((line, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'rgba(240,237,230,0.85)' }}>
            <span className="shrink-0 mt-0.5" style={{ color: '#C4A4A4' }}>►</span>
            <span>{line.replace(/^[►▸•\-\*]\s*/, '')}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
