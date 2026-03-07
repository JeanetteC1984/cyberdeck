import { useDroppable } from '@dnd-kit/core'
import { JournalEntry, MOODS, CARD_COLORS } from '../types'
import StickerPicker from './StickerPicker'

interface JournalEditorProps {
  entry: JournalEntry
  onChange: (entry: JournalEntry) => void
  onSave: (entry: JournalEntry) => void
  onDelete: () => void
  onClose: () => void
  isNew: boolean
}

export default function JournalEditor({
  entry,
  onChange,
  onSave,
  onDelete,
  onClose,
  isNew,
}: JournalEditorProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'editor-drop-zone' })

  const update = (fields: Partial<JournalEntry>) => onChange({ ...entry, ...fields })

  const removeSticker = (index: number) => {
    const next = entry.stickers.filter((_, i) => i !== index)
    update({ stickers: next })
  }

  const addSticker = (emoji: string) => {
    update({ stickers: [...entry.stickers, emoji] })
  }

  return (
    <div className="editor-overlay" onClick={onClose}>
      <div className="editor-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="editor-header">
          <span className="editor-header-title">
            {isNew ? '✨ New Entry' : '✏️ Edit Entry'}
          </span>
          <button className="editor-close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="editor-body">
          {/* Title */}
          <input
            className="editor-title-input"
            placeholder="Give this entry a title…"
            value={entry.title}
            onChange={(e) => update({ title: e.target.value })}
            autoFocus
          />

          {/* Content */}
          <textarea
            className="editor-content-area"
            placeholder="Write your heart out… 💕"
            value={entry.content}
            onChange={(e) => update({ content: e.target.value })}
            rows={6}
          />

          {/* Mood */}
          <div>
            <p className="section-label">How are you feeling?</p>
            <div className="mood-grid">
              {MOODS.map((m) => (
                <button
                  key={m.emoji}
                  className={`mood-btn${entry.mood === m.emoji ? ' active' : ''}`}
                  onClick={() => update({ mood: m.emoji })}
                  title={m.label}
                >
                  {m.emoji}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card color */}
          <div>
            <p className="section-label">Card color</p>
            <div className="color-swatches">
              {CARD_COLORS.map((color) => (
                <button
                  key={color}
                  className={`color-swatch-btn${entry.cardColor === color ? ' active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => update({ cardColor: color })}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Sticker Drop Zone */}
          <div>
            <p className="section-label">Stickers — drag or click to add 🎀</p>
            <div
              ref={setNodeRef}
              className={`sticker-drop-zone${isOver ? ' is-over' : ''}`}
            >
              {entry.stickers.length === 0 && (
                <span className="sticker-drop-zone-hint">
                  Drop stickers here or pick from below ✨
                </span>
              )}
              {entry.stickers.map((s, i) => (
                <span key={i} style={{ position: 'relative', display: 'inline-flex' }}>
                  <span className="entry-sticker">{s}</span>
                  <button
                    className="sticker-remove-btn"
                    onClick={() => removeSticker(i)}
                    title="Remove"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Sticker Picker */}
          <StickerPicker onAdd={addSticker} />
        </div>

        {/* Footer */}
        <div className="editor-footer">
          <div className="editor-footer-left">
            {!isNew && (
              <button className="btn-danger" onClick={onDelete}>
                🗑️ Delete
              </button>
            )}
          </div>
          <div className="editor-footer-right">
            <button className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-save"
              onClick={() => onSave(entry)}
              disabled={!entry.title.trim() && !entry.content.trim() && entry.stickers.length === 0}
            >
              💾 Save Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
