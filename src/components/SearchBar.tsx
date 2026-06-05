import { MOODS } from '../types'

interface SearchBarProps {
  query: string
  onQueryChange: (q: string) => void
  moodFilter: string
  onMoodFilterChange: (m: string) => void
  resultCount: number
  totalCount: number
}

export default function SearchBar({
  query,
  onQueryChange,
  moodFilter,
  onMoodFilterChange,
  resultCount,
  totalCount,
}: SearchBarProps) {
  const isFiltered = query || moodFilter

  return (
    <div className="search-bar" role="search" aria-label="Search and filter entries">
      <div className="search-input-wrap">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          className="search-input"
          type="search"
          placeholder="Search your grimoire…"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          aria-label="Search entries by title or content"
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <div className="search-filters" role="group" aria-label="Filter by energy">
        <button
          className={`mood-filter-btn${!moodFilter ? ' active' : ''}`}
          onClick={() => onMoodFilterChange('')}
          aria-pressed={!moodFilter}
        >
          All
        </button>
        {MOODS.map(m => (
          <button
            key={m.emoji}
            className={`mood-filter-btn${moodFilter === m.emoji ? ' active' : ''}`}
            onClick={() => onMoodFilterChange(moodFilter === m.emoji ? '' : m.emoji)}
            title={m.label}
            aria-label={`Filter by ${m.label}`}
            aria-pressed={moodFilter === m.emoji}
          >
            {m.emoji}
          </button>
        ))}
      </div>
      {isFiltered && (
        <p className="search-results-hint" role="status" aria-live="polite">
          {resultCount === 0
            ? 'No entries found'
            : `${resultCount} of ${totalCount} ${resultCount === 1 ? 'entry' : 'entries'}`}
        </p>
      )}
    </div>
  )
}
