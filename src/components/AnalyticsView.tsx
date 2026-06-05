import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { JournalEntry, MOODS } from '../types'
import { computeStreak, getMoodCounts, getEntriesByMonth } from '../utils/helpers'

interface AnalyticsViewProps {
  entries: JournalEntry[]
}

export default function AnalyticsView({ entries }: AnalyticsViewProps) {
  const streak = useMemo(() => computeStreak(entries), [entries])
  const moodCounts = useMemo(() => getMoodCounts(entries), [entries])
  const monthlyData = useMemo(() => getEntriesByMonth(entries), [entries])

  const moodData = MOODS.map(m => ({
    emoji: m.emoji,
    label: m.label,
    count: moodCounts[m.emoji] || 0,
  }))
    .filter(d => d.count > 0)
    .sort((a, b) => b.count - a.count)

  const activeMonths = monthlyData.filter(m => m.count > 0).length
  const avgPerMonth = entries.length > 0
    ? (entries.length / Math.max(activeMonths, 1)).toFixed(1)
    : '0'

  if (entries.length === 0) {
    return (
      <div className="analytics-empty">
        <span className="empty-emoji">📊</span>
        <h2>No data yet</h2>
        <p>Write your first entry to see your analytics.</p>
      </div>
    )
  }

  return (
    <div className="analytics-view" role="region" aria-label="Analytics dashboard">
      <div className="analytics-stats">
        <div className="stat-card">
          <span className="stat-value">{streak}</span>
          <span className="stat-label">🔥 Day Streak</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{entries.length}</span>
          <span className="stat-label">📜 Entries</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{avgPerMonth}</span>
          <span className="stat-label">📅 / Month</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{ fontSize: '2rem' }}>{moodData[0]?.emoji ?? '—'}</span>
          <span className="stat-label">Top Energy</span>
        </div>
      </div>

      <div className="analytics-chart-section">
        <h3 className="analytics-chart-title">Entries per Month</h3>
        <div className="analytics-chart-wrap">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="month"
                tick={{ fill: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-main)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-main)' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-main)',
                  fontSize: '13px',
                }}
                cursor={{ fill: 'rgba(201,162,39,.08)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {moodData.length > 0 && (
        <div className="analytics-chart-section">
          <h3 className="analytics-chart-title">Energy Breakdown</h3>
          <div className="mood-breakdown" role="list">
            {moodData.map(d => (
              <div key={d.emoji} className="mood-bar-row" role="listitem">
                <span className="mood-bar-label">{d.emoji} {d.label}</span>
                <div className="mood-bar-track" aria-hidden="true">
                  <div
                    className="mood-bar-fill"
                    style={{ width: `${(d.count / entries.length) * 100}%` }}
                  />
                </div>
                <span className="mood-bar-count" aria-label={`${d.count} entries`}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
