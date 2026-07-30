import { getFirestore, collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { app } from './config'

export const db = getFirestore(app)

export async function getBrands() {
  const snap = await getDocs(collection(db, 'brands'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getWeeklyReports(slug) {
  const ref = collection(db, 'brands', slug, 'weekly')
  const q = query(ref, orderBy('weekStart', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getWeeklyReport(slug, weekLabel) {
  const ref = doc(db, 'brands', slug, 'weekly', weekLabel)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function getDailyReport(slug, date) {
  const ref = doc(db, 'brands', slug, 'daily', date)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function getInventoryReports(slug) {
  const ref = collection(db, 'brands', slug, 'inventory')
  const q = query(ref, orderBy('dateLabel', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getInventoryReport(slug, dateLabel) {
  const ref = doc(db, 'brands', slug, 'inventory', dateLabel)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}
