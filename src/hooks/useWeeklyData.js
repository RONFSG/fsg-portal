import { useState, useEffect } from 'react'
import { getWeeklyReports, getWeeklyReport, getDailyReport } from '../firebase/db'

export function useWeeklyData(slug) {
  const [weeks, setWeeks] = useState([])
  const [selectedWeek, setSelectedWeek] = useState(null)
  const [weekData, setWeekData] = useState(null)
  const [dailyData, setDailyData] = useState(null)
  const [selectedDate, setSelectedDate] = useState('full')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getWeeklyReports(slug)
      .then(data => {
        setWeeks(data)
        if (data.length > 0) setSelectedWeek(data[0].id)
      })
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!slug || !selectedWeek) return
    setWeekData(null)
    getWeeklyReport(slug, selectedWeek).then(setWeekData)
    setSelectedDate('full')
    setDailyData(null)
  }, [slug, selectedWeek])

  useEffect(() => {
    if (!slug || !selectedDate || selectedDate === 'full') {
      setDailyData(null)
      return
    }
    getDailyReport(slug, selectedDate).then(setDailyData)
  }, [slug, selectedDate])

  return {
    weeks,
    selectedWeek,
    setSelectedWeek,
    weekData,
    dailyData,
    selectedDate,
    setSelectedDate,
    loading,
  }
}
