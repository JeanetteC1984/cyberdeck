import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { JournalEntry, Theme } from './types'
import JournalCard from './components/JournalCard'
import JournalEditor from './components/JournalEditor'
import ThemePicker from './components/ThemePicker'
import SearchBar from './components/SearchBar'
import CalendarView from './components/CalendarView'
import AnalyticsView from './components/AnalyticsView'
import PinLockScreen from './components/PinLockScreen'
import SettingsPanel from './components/SettingsPanel'
import { computeStreak } from './utils/helpers'
import './App.css'

const SAMPLE_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    title: 'The Veil Feels Thin Tonight',
    content:
      "<p>There is a restlessness in the air that I cannot shake. I lit three candles before midnight and sat with my thoughts until the wax ran low. The flame kept bending west — I take that as a sign to let go of what I have been holding. Writing feels like the only ritual that never fails me.</p>",
    date: new Date(Date.now() - 86400000).toISOString(),
    mood: '🌙',
    stickers: ['🕯️', '🌒', '✨'],
    cardColor: '#1e1530',
  },
  {
    id: '2',
    title: 'Intentions for the New Moon',
    content:
      "<p>Set out my crystals before dawn. This cycle I am focusing on clarity — letting the fog of last season finally lift. Wrote my intentions on a slip of parchment and watched the smoke carry them upward. Something is already shifting beneath the surface.</p>",
    date: new Date(Date.now() - 3600000).toISOString(),
    mood: '🔮',
    stickers: ['🌑', '💎', '🌿'],
    cardColor: '#14182e',
  },
]

type View = 'grid' | 'calendar' | 'analytics'

function App() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      const stored = localStorage.getItem('journal-entries')
      return stored ? (JSON.parse(stored) as JournalEntry[]) : SAMPLE_ENTRIES
    } catch {
      return SAMPLE_ENTRIES
    }
  })

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('journal-theme') as Theme) || 'grimoire'
  })

  const [pinHash, setPinHash] = useState<string | null>(() =>
    localStorage.getItem('journal-pin') || null
  )
  const [isLocked, setIsLocked] = useState(() => !!localStorage.getItem('journal-pin'))

  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isNewEntry, setIsNewEntry] = useState(false)
  const [showThemePicker, setShowThemePicker] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [view, setView] = useState<View>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [moodFilter, setMoodFilter] = useState('')

  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const [draggedSticker, setDraggedSticker] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('journal-entries', JSON.stringify(entries))
  }, [entries])

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('journal-theme', theme)
  }, [theme])

  const streak = useMemo(() => computeStreak(entries), [entries])

  const filteredEntries = useMemo(() => {
    let result = entries
    if (moodFilter) result = result.filter(e => e.mood === moodFilter)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        e =>
          e.title.toLowerCase().includes(q) ||
          e.content.toLowerCase().includes(q)
      )
    }
    return result
  }, [entries, searchQuery, moodFilter])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const openNewEntry = useCallback((date?: string) => {
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      date: date || new Date().toISOString(),
      mood: '🌙',
      stickers: [],
      cardColor: '#1e1530',
    }
    setEditingEntry(newEntry)
    setIsNewEntry(true)
    setIsEditorOpen(true)
  }, [])

  const openEditEntry = useCallback((entry: JournalEntry) => {
    setEditingEntry({ ...entry })
    setIsNewEntry(false)
    setIsEditorOpen(true)
  }, [])

  const handleSave = useCallback((entry: JournalEntry) => {
    setEntries(prev => {
      const exists = prev.some(e => e.id === entry.id)
      return exists ? prev.map(e => (e.id === entry.id ? entry : e)) : [entry, ...prev]
    })
    setIsEditorOpen(false)
    setEditingEntry(null)
  }, [])

  const handleDelete = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
    setIsEditorOpen(false)
    setEditingEntry(null)
  }, [])

  const exportEntries = useCallback(() => {
    const data = JSON.stringify(entries, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `grimoire-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [entries])

  const importEntries = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const imported = JSON.parse(e.target?.result as string) as JournalEntry[]
        setEntries(prev => {
          const existingIds = new Set(prev.map(x => x.id))
          const newOnes = imported.filter(x => !existingIds.has(x.id))
          return [...prev, ...newOnes]
        })
      } catch {
        // silently ignore malformed import
      }
    }
    reader.readAsText(file)
  }, [])

  const setupPin = useCallback((hash: string) => {
    setPinHash(hash)
    localStorage.setItem('journal-pin', hash)
  }, [])

  const removePin = useCallback(() => {
    setPinHash(null)
    localStorage.removeItem('journal-pin')
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (active.data.current?.type === 'sticker') {
      setDraggedSticker(active.data.current.emoji as string)
    } else {
      setActiveDragId(String(active.id))
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveDragId(null)
    setDraggedSticker(null)

    if (!over) return

    if (active.data.current?.type === 'sticker') {
      if (over.id === 'editor-drop-zone' && editingEntry) {
        setEditingEntry(prev =>
          prev
            ? { ...prev, stickers: [...prev.stickers, active.data.current!.emoji as string] }
            : null
        )
      }
      return
    }

    if (active.id !== over.id) {
      setEntries(prev => {
        const oldIndex = prev.findIndex(e => e.id === active.id)
        const newIndex = prev.findIndex(e => e.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  const activeDragEntry = activeDragId ? entries.find(e => e.id === activeDragId) : null

  if (isLocked && pinHash) {
    return <PinLockScreen pinHash={pinHash} onUnlock={() => setIsLocked(false)} />
  }

  const isFiltering = !!(searchQuery || moodFilter)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="journal-app">
        {/* ── Header ── */}
        <header className="app-header">
          <div className="header-left">
            <h1 className="app-title">
              <span className="title-emoji">🌙</span>
              The Grimoire
              <span className="title-emoji">🔮</span>
            </h1>
            <p className="app-subtitle">Where shadows whisper and secrets keep</p>
          </div>
          <div className="header-right">
            {streak > 0 && (
              <span className="streak-badge" title={`${streak}-day writing streak`}>
                🔥 {streak}
              </span>
            )}
            <div className="view-toggle" role="group" aria-label="View mode">
              <button
                className={`view-toggle-btn${view === 'grid' ? ' active' : ''}`}
                onClick={() => setView('grid')}
                aria-pressed={view === 'grid'}
                title="Grid view"
              >
                ▦
              </button>
              <button
                className={`view-toggle-btn${view === 'calendar' ? ' active' : ''}`}
                onClick={() => setView('calendar')}
                aria-pressed={view === 'calendar'}
                title="Calendar view"
              >
                📅
              </button>
              <button
                className={`view-toggle-btn${view === 'analytics' ? ' active' : ''}`}
                onClick={() => setView('analytics')}
                aria-pressed={view === 'analytics'}
                title="Analytics"
              >
                📊
              </button>
            </div>
            <button
              className="btn-icon"
              onClick={() => setShowSettings(true)}
              title="Settings"
              aria-label="Open settings"
            >
              ⚙️
            </button>
            <button
              className="btn-icon"
              onClick={() => setShowThemePicker(v => !v)}
              title="Change theme"
              aria-label="Change theme"
            >
              🌀
            </button>
            <button className="btn btn-primary" onClick={() => openNewEntry()}>
              + New Chapter
            </button>
          </div>
        </header>

        {/* ── Theme Picker ── */}
        {showThemePicker && (
          <ThemePicker
            currentTheme={theme}
            onSelect={t => {
              setTheme(t)
              setShowThemePicker(false)
            }}
            onClose={() => setShowThemePicker(false)}
          />
        )}

        {/* ── Settings Panel ── */}
        {showSettings && (
          <SettingsPanel
            onClose={() => setShowSettings(false)}
            onExport={exportEntries}
            onImport={importEntries}
            pinHash={pinHash}
            onSetPin={setupPin}
            onRemovePin={removePin}
          />
        )}

        {/* ── Search Bar (grid view only) ── */}
        {view === 'grid' && (
          <div className="search-bar-wrapper">
            <SearchBar
              query={searchQuery}
              onQueryChange={setSearchQuery}
              moodFilter={moodFilter}
              onMoodFilterChange={setMoodFilter}
              resultCount={filteredEntries.length}
              totalCount={entries.length}
            />
          </div>
        )}

        {/* ── Main Content ── */}
        <main className="entries-container">
          {view === 'calendar' && (
            <CalendarView
              entries={entries}
              onDayClick={(date, existing) => {
                if (existing) openEditEntry(existing)
                else openNewEntry(date.toISOString())
              }}
            />
          )}

          {view === 'analytics' && <AnalyticsView entries={entries} />}

          {view === 'grid' && (
            <>
              {entries.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-emoji">🔮</span>
                  <h2>Your grimoire awaits</h2>
                  <p>The pages are blank. The ink is ready. Begin your first chapter.</p>
                  <button className="btn-save btn-save-cta" onClick={() => openNewEntry()}>
                    Open the Grimoire 🌙
                  </button>
                </div>
              ) : filteredEntries.length === 0 && isFiltering ? (
                <div className="empty-state">
                  <span className="empty-emoji">🌑</span>
                  <h2>The spirits found nothing</h2>
                  <p>No entries match your search. Try different words or clear the filter.</p>
                </div>
              ) : (
                <SortableContext
                  items={filteredEntries.map(e => e.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="entries-grid">
                    {filteredEntries.map(entry => (
                      <JournalCard
                        key={entry.id}
                        entry={entry}
                        onEdit={() => openEditEntry(entry)}
                        onDelete={() => handleDelete(entry.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              )}
            </>
          )}
        </main>

        {/* ── Editor Modal ── */}
        {isEditorOpen && editingEntry && (
          <JournalEditor
            entry={editingEntry}
            onChange={setEditingEntry}
            onSave={handleSave}
            onDelete={() => handleDelete(editingEntry.id)}
            onClose={() => {
              setIsEditorOpen(false)
              setEditingEntry(null)
            }}
            isNew={isNewEntry}
          />
        )}

        {/* ── DragOverlay ── */}
        <DragOverlay>
          {activeDragEntry ? (
            <div
              className="journal-card drag-overlay"
              style={{ backgroundColor: activeDragEntry.cardColor }}
            >
              <p className="card-mood">{activeDragEntry.mood}</p>
              <h3 className="card-title">{activeDragEntry.title || 'Untitled Entry'}</h3>
            </div>
          ) : null}
          {draggedSticker ? (
            <span className="sticker-drag-overlay">{draggedSticker}</span>
          ) : null}
        </DragOverlay>

        {/* ── FAB ── */}
        <button className="fab" onClick={() => openNewEntry()} title="New chapter" aria-label="New chapter">
          🪶
        </button>
      </div>
    </DndContext>
  )
}

export default App
