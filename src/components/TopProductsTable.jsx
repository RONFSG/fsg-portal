export default function TopProductsTable({ products }) {
  if (!products?.length) return (
    <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid #e8e4dd' }}>
      <h3 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: '#1A1A1A', fontFamily: 'League Spartan, sans-serif' }}>Top Products</h3>
      <p className="text-sm" style={{ color: '#999' }}>No product data available</p>
    </div>
  )

  const cols = ['Product', 'ASIN', 'Sales', 'Units', 'Sessions', 'CVR', 'WoW%']

  return (
    <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid #e8e4dd' }}>
      <h3 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: '#1A1A1A', fontFamily: 'League Spartan, sans-serif' }}>
        Top Products
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr style={{ borderBottom: '1.5px solid #e8e4dd' }}>
              {cols.map(c => (
                <th key={c} className="text-left py-2 pr-4 text-xs font-bold uppercase tracking-widest" style={{ color: '#999', fontFamily: 'League Spartan, sans-serif' }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => {
              const wow = p.wow ?? p.wowPercent ?? null
              const wowPos = wow !== null && Number(wow) > 0
              const wowNeg = wow !== null && Number(wow) < 0
              return (
                <tr key={i} style={{ borderBottom: '1px solid #f5f3f0' }}>
                  <td className="py-3 pr-4 font-semibold" style={{ color: '#1A1A1A', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name ?? p.title ?? '—'}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs" style={{ color: '#666' }}>{p.asin ?? '—'}</td>
                  <td className="py-3 pr-4 font-semibold" style={{ color: '#1A1A1A' }}>
                    {p.sales !== undefined ? `$${Number(p.sales).toLocaleString()}` : '—'}
                  </td>
                  <td className="py-3 pr-4" style={{ color: '#444' }}>{p.units ?? '—'}</td>
                  <td className="py-3 pr-4" style={{ color: '#444' }}>{p.sessions ?? '—'}</td>
                  <td className="py-3 pr-4" style={{ color: '#444' }}>{p.cvr !== undefined ? `${Number(p.cvr).toFixed(1)}%` : '—'}</td>
                  <td className="py-3 pr-4 font-semibold" style={{ color: wowPos ? '#16a34a' : wowNeg ? '#dc2626' : '#999' }}>
                    {wow !== null ? `${Number(wow) > 0 ? '+' : ''}${Number(wow).toFixed(1)}%` : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
