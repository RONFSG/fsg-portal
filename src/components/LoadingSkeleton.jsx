export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl p-5 animate-pulse" style={{ background: '#e8e4dd', height: 160 }}>
          <div className="h-5 rounded mb-3" style={{ background: '#d5d0c9', width: '60%' }} />
          <div className="h-3 rounded mb-6" style={{ background: '#d5d0c9', width: '40%' }} />
          <div className="flex gap-2 mt-auto">
            <div className="h-9 rounded-lg flex-1" style={{ background: '#d5d0c9' }} />
            <div className="h-9 rounded-lg flex-1" style={{ background: '#d5d0c9' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
