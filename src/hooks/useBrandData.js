import { useState, useEffect } from 'react'
import { getBrands } from '../firebase/db'
import { BRANDS } from '../constants/brands'

export function useBrandData() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const firestoreBrands = await getBrands()
        const merged = BRANDS.map(b => {
          const fb = firestoreBrands.find(f => f.slug === b.slug || f.id === b.slug)
          return { ...b, ...fb }
        })
        setBrands(merged)
      } catch (e) {
        // Fallback to static brand list if Firestore fails
        setBrands(BRANDS)
        setError(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { brands, loading, error }
}
