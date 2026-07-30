import InventoryHealthBar from './InventoryHealthBar'

const COLS = [
  { key: 'sku', label: 'SKU' },
  { key: 'atFba', label: 'AT FBA' },
  { key: 'available', label: 'Available' },
  { key: 'inbound', label: 'Inbound' },
  { key: 'fcTransfer', label: 'FC Transfer' },
  { key: 'reserve', label: 'Reserve' },
  { key: 'weeklyAvg', label: 'Weekly Avg' },
  { key: 'l30Sold', label: 'L30 Sold' },
  { key: 'weeksLeft', label: 'Weeks Left' },
  { key: 'recToShip', label: 'Rec To Ship' },
]

export default function InventoryTable({ products }) {
  if (!products?.length) return (
    <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid #e8e4dd' }}>
      <p className="text-sm" style={{ color: '#999' }}>No inventory data available</p>
    </div>
  )

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e8e4dd' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: 900 }}>
          <thead style={{ background: '#f8f6f2' }}>
            <tr>
              {COLS.map(c => (
                <th key={c.key} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest" style={{ color: '#999', fontFamily: 'League Spartan, sans-serif', whiteSpace: 'nowrap' }}>
                  {c.label}
                </th>
              ))}
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest" style={{ color: '#999', fontFamily: 'League Spartan, sans-serif' }}>
                Health
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => {
              const weeks = Number(p.weeksLeft) || 0
              const rowBg = weeks <= 4 ? 'rgba(220,38,38,0.04)' : weeks <= 8 ? 'rgba(217,119,6,0.04)' : 'transparent'
              return (
                <tr key={i} style={{ borderTop: '1px solid #f0ede6', background: rowBg }}>
                  {COLS.map(c => (
                    <td key={c.key} className="px-4 py-3 font-medium" style={{ color: '#1A1A1A', whiteSpace: 'nowrap' }}>
                      {p[c.key] !== undefined && p[c.key] !== null ? p[c.key] : '—'}
                    </td>
                  ))}
                  <td className="px-4 py-3" style={{ minWidth: 160 }}>
                    <InventoryHealthBar weeksLeft={p.weeksLeft} />
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
