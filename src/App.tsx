import { useState, useEffect } from 'react'
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
import './App.css'

const SAMPLE_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    title: 'The Veil Feels Thin Tonight',
    content:
      "There is a restlessness in the air that I cannot shake. I lit three candles before midnight and sat with my thoughts until the wax ran low. The flame kept bending west — I take that as a sign to let go of what I have been holding. Writing feels like the only ritual that never fails me.",
    date: new Date(Date.now() - 86400000).toISOString(),
    mood: '🌙',
    stickers: ['🕯️', '🌒', '✨'],
    cardColor: '#1e1530',
  },
  {
    id: '2',
    title: 'Intentions for the New Moon',
    content:
      "Set out my crystals before dawn. This cycle I am focusing on clarity — letting the fog of last season finally lift. Wrote my intentions on a slip of parchment and watched the smoke carry them upward. Something is already shifting beneath the surface.",
    date: new Date(Date.now() - 3600000).toISOString(),
    mood: '🔮',
    stickers: ['🌑', '💎', '🌿'],
    cardColor: '#14182e',
  },
]

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

  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isNewEntry, setIsNewEntry] = useState(false)
  const [showThemePicker, setShowThemePicker] = useState(false)

  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const [draggedSticker, setDraggedSticker] = useState<string | null>(null)

  // Persist entries to localStorage
  useEffect(() => {
    localStorage.setItem('journal-entries', JSON.stringify(entries))
  }, [entries])

  // Apply theme attribute to body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('journal-theme', theme)
  }, [theme])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const openNewEntry = () => {
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      date: new Date().toISOString(),
      mood: '🌙',
      stickers: [],
      cardColor: '#1e1530',
    }
    setEditingEntry(newEntry)
    setIsNewEntry(true)
    setIsEditorOpen(true)
  }

  const openEditEntry = (entry: JournalEntry) => {
    setEditingEntry({ ...entry })
    setIsNewEntry(false)
    setIsEditorOpen(true)
  }

  const handleSave = (entry: JournalEntry) => {
    setEntries((prev) => {
      const exists = prev.some((e) => e.id === entry.id)
      return exists ? prev.map((e) => (e.id === entry.id ? entry : e)) : [entry, ...prev]
    })
    setIsEditorOpen(false)
    setEditingEntry(null)
  }

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    setIsEditorOpen(false)
    setEditingEntry(null)
  }

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

    // Sticker dropped onto editor drop zone
    if (active.data.current?.type === 'sticker') {
      if (over.id === 'editor-drop-zone' && editingEntry) {
        setEditingEntry((prev) =>
          prev
            ? { ...prev, stickers: [...prev.stickers, active.data.current!.emoji as string] }
            : null
        )
      }
      return
    }

    // Reorder journal entries
    if (active.id !== over.id) {
      setEntries((prev) => {
        const oldIndex = prev.findIndex((e) => e.id === active.id)
        const newIndex = prev.findIndex((e) => e.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  const activeDragEntry = activeDragId ? entries.find((e) => e.id === activeDragId) : null

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
            <button
              className="btn-icon"
              onClick={() => setShowThemePicker((v) => !v)}
              title="Change theme"
            >
              🌀
            </button>
            <button className="btn btn-primary" onClick={openNewEntry}>
              + New Chapter
            </button>
          </div>
        </header>

        {/* ── Theme Picker ── */}
        {showThemePicker && (
          <ThemePicker
            currentTheme={theme}
            onSelect={(t) => {
              setTheme(t)
              setShowThemePicker(false)
            }}
            onClose={() => setShowThemePicker(false)}
          />
        )}

        {/* ── Entries ── */}
        <main className="entries-container">
          {entries.length === 0 ? (
            <div className="empty-state">
              <span className="empty-emoji">🔮</span>
              <h2>Your grimoire awaits</h2>
              <p>The pages are blank. The ink is ready. Begin your first chapter.</p>
              <button className="btn-save btn-save-cta" onClick={openNewEntry}>
                Open the Grimoire 🌙
              </button>
            </div>
          ) : (
            <SortableContext
              items={entries.map((e) => e.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="entries-grid">
                {entries.map((entry) => (
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
        <button className="fab" onClick={openNewEntry} title="New chapter">
          🪶
        </button>
      </div>
    </DndContext>
  )
}

export default App

