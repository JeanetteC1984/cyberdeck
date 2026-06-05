import { useState } from 'react'
import { JournalEntry } from '../types'

interface CalendarViewProps {
  entries: JournalEntry[]
  onDayClick: (date: Date, existingEntry?: JournalEntry) => void
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function CalendarView({ entries, onDayClick }: CalendarViewProps) {
  const [current, setCurrent] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  const year = current.getFullYear()
  const month = current.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const entryByDay = new Map<number, JournalEntry>()
  entries.forEach(e => {
    const d = new Date(e.date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!entryByDay.has(day)) entryByDay.set(day, e)
    }
  })

  const today = new Date()
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="calendar-view" role="region" aria-label="Calendar">
      <div className="calendar-header">
        <button
          className="cal-nav-btn"
          onClick={() => setCurrent(new Date(year, month - 1, 1))}
          aria-label="Previous month"
        >
          ‹
        </button>
        <h2 className="cal-month-title">{MONTHS[month]} {year}</h2>
        <button
          className="cal-nav-btn"
          onClick={() => setCurrent(new Date(year, month + 1, 1))}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="calendar-grid" role="grid">
        {DAYS.map(d => (
          <div key={d} className="cal-day-header" role="columnheader" aria-label={d}>{d}</div>
        ))}
        {cells.map((day, i) =>
          day === null ? (
            <div key={`e${i}`} className="cal-cell cal-cell-empty" role="gridcell" />
          ) : (
            <button
              key={day}
              className={[
                'cal-cell',
                entryByDay.has(day) ? 'has-entry' : '',
                isToday(day) ? 'is-today' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onDayClick(new Date(year, month, day), entryByDay.get(day))}
              aria-label={`${MONTHS[month]} ${day}${entryByDay.has(day) ? ' — has entry' : ''}`}
              role="gridcell"
            >
              <span className="cal-day-num">{day}</span>
              {entryByDay.has(day) && (
                <span className="cal-day-mood" aria-hidden="true">
                  {entryByDay.get(day)!.mood}
                </span>
              )}
            </button>
          )
        )}
      </div>
    </div>
  )
}
