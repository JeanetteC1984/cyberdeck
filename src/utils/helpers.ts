export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
}

export async function hashPin(pin: string): Promise<string> {
  const data = new TextEncoder().encode(`grimoire:${pin}`)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function computeStreak(entries: { date: string }[]): number {
  if (entries.length === 0) return 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daySet = new Set(
    entries.map(e => {
      const d = new Date(e.date)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })
  )
  let streak = 0
  const check = new Date(today)
  while (daySet.has(check.getTime())) {
    streak++
    check.setDate(check.getDate() - 1)
  }
  return streak
}

export function getMoodCounts(entries: { mood: string }[]): Record<string, number> {
  return entries.reduce((acc, e) => {
    acc[e.mood] = (acc[e.mood] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

export function getEntriesByMonth(entries: { date: string }[]): { month: string; count: number }[] {
  const counts: Record<string, number> = {}
  entries.forEach(e => {
    const d = new Date(e.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    counts[key] = (counts[key] || 0) + 1
  })
  const result = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    result.push({
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      count: counts[key] || 0,
    })
  }
  return result
}
