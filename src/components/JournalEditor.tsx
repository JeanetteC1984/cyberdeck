import { useDroppable } from '@dnd-kit/core'
import { JournalEntry, MOODS, CARD_COLORS } from '../types'
import StickerPicker from './StickerPicker'
import RichEditor from './RichEditor'
import { useFocusTrap } from '../hooks/useFocusTrap'

interface JournalEditorProps {
  entry: JournalEntry
  onChange: (entry: JournalEntry) => void
  onSave: (entry: JournalEntry) => void
  onDelete: () => void
  onClose: () => void
  isNew: boolean
}

export default function JournalEditor({
  entry, onChange, onSave, onDelete, onClose, isNew,
}: JournalEditorProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'editor-drop-zone' })
  const trapRef = useFocusTrap(true, onClose)

  const update = (fields: Partial<JournalEntry>) => onChange({ ...entry, ...fields })

  const removeSticker = (index: number) =>
    update({ stickers: entry.stickers.filter((_, i) => i !== index) })

  const addSticker = (emoji: string) =>
    update({ stickers: [...entry.stickers, emoji] })

  const isEmpty = !entry.title.trim() && !entry.content.trim() && entry.stickers.length === 0

  return (
    <div
      className="editor-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="editor-modal"
        onClick={e => e.stopPropagation()}
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={isNew ? 'New chapter' : 'Edit chapter'}
      >
        {/* Header */}
        <div className="editor-header">
          <span className="editor-header-title" id="editor-title">
            {isNew ? '🌙 New Chapter' : '🪶 Edit Chapter'}
          </span>
          <button
            className="editor-close-btn"
            onClick={onClose}
            aria-label="Close editor"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="editor-body">
          <input
            className="editor-title-input"
            placeholder="Name this chapter…"
            value={entry.title}
            onChange={e => update({ title: e.target.value })}
            aria-label="Entry title"
            autoFocus
          />

          <RichEditor
            content={entry.content}
            onChange={html => update({ content: html })}
            placeholder="Let the words flow… tell the spirits what weighs upon your heart."
          />

          {/* Mood */}
          <div>
            <p className="section-label" id="mood-label">Current energy</p>
            <div className="mood-grid" role="group" aria-labelledby="mood-label">
              {MOODS.map(m => (
                <button
                  key={m.emoji}
                  className={`mood-btn${entry.mood === m.emoji ? ' active' : ''}`}
                  onClick={() => update({ mood: m.emoji })}
                  aria-label={m.label}
                  aria-pressed={entry.mood === m.emoji}
                >
                  {m.emoji}<span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card color */}
          <div>
            <p className="section-label" id="color-label">Bind color</p>
            <div className="color-swatches" role="group" aria-labelledby="color-label">
              {CARD_COLORS.map(color => (
                <button
                  key={color}
                  className={`color-swatch-btn${entry.cardColor === color ? ' active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => update({ cardColor: color })}
                  aria-label={`Card color ${color}`}
                  aria-pressed={entry.cardColor === color}
                />
              ))}
            </div>
          </div>

          {/* Sticker drop zone */}
          <div>
            <p className="section-label" id="sticker-label">Sigils & symbols — drag or click to add 🔮</p>
            <div
              ref={setNodeRef}
              className={`sticker-drop-zone${isOver ? ' is-over' : ''}`}
              role="region"
              aria-labelledby="sticker-label"
              aria-live="polite"
            >
              {entry.stickers.length === 0 && (
                <span className="sticker-drop-zone-hint">
                  Drop your sigils here or choose from below…
                </span>
              )}
              {entry.stickers.map((s, i) => (
                <span key={i} style={{ position: 'relative', display: 'inline-flex' }}>
                  <span className="entry-sticker" aria-hidden="true">{s}</span>
                  <button
                    className="sticker-remove-btn"
                    onClick={() => removeSticker(i)}
                    aria-label={`Remove ${s}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <StickerPicker onAdd={addSticker} />
        </div>

        {/* Footer */}
        <div className="editor-footer">
          <div className="editor-footer-left">
            {!isNew && (
              <button className="btn-danger" onClick={onDelete} aria-label="Delete entry">
                🗑️ Destroy
              </button>
            )}
          </div>
          <div className="editor-footer-right">
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button
              className="btn-save"
              onClick={() => onSave(entry)}
              disabled={isEmpty}
              aria-disabled={isEmpty}
            >
              🪄 Seal Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
