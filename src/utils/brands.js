export const BRANDS = [
  { name: 'Dormeo', slug: 'dormeo' },
  { name: 'Dormeo Canada', slug: 'dormeo-canada' },
  { name: 'Opopop', slug: 'opopop' },
  { name: 'Opopop Walmart', slug: 'opopop-walmart' },
  { name: 'Hapad', slug: 'hapad' },
  { name: 'Hapad Canada', slug: 'hapad-canada' },
  { name: 'SuperMush', slug: 'supermush' },
  { name: 'Reshoevn8r', slug: 'reshoevn8r' },
  { name: 'Reshoevn8r Canada', slug: 'reshoevn8r-canada' },
  { name: 'Reshoevn8r UK', slug: 'reshoevn8r-uk' },
  { name: 'RationAle Brewing', slug: 'rationale-brewing' },
  { name: 'RationAle Walmart', slug: 'rationale-walmart' },
  { name: 'Good Bacteria', slug: 'good-bacteria' },
  { name: 'Tubr Storage', slug: 'tubr-storage' },
  { name: 'Wink', slug: 'wink' },
  { name: 'Smood Sweets', slug: 'smood-sweets' },
  { name: 'MAC Energy', slug: 'mac-energy' },
  { name: 'Lewie', slug: 'lewie' },
  { name: 'Aura House', slug: 'aura-house' },
  { name: 'Heavenly Bodies', slug: 'heavenly-bodies' },
  { name: 'Addasound', slug: 'addasound' },
  { name: 'Natures Answer', slug: 'natures-answer' },
  { name: 'Stogie Golf', slug: 'stogie-golf' },
]

export const getReportUrl = (slug, type) => {
  if (type === 'weekly') return `https://reports.flagshipgrowth.com/${slug}-weekly`
  if (type === 'inventory') return `https://reports.flagshipgrowth.com/${slug}-inventory`
  return '#'
}
