import { useState, useEffect } from 'react'
import { getInventoryReports, getInventoryReport } from '../firebase/db'

export function useInventoryData(slug) {
  const [snapshots, setSnapshots] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [inventoryData, setInventoryData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getInventoryReports(slug)
      .then(data => {
        setSnapshots(data)
        if (data.length > 0) setSelectedDate(data[0].id)
      })
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!slug || !selectedDate) return
    setInventoryData(null)
    getInventoryReport(slug, selectedDate).then(setInventoryData)
  }, [slug, selectedDate])

  return { snapshots, selectedDate, setSelectedDate, inventoryData, loading }
}
