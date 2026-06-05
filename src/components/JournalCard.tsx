import { memo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { JournalEntry } from '../types'
import { stripHtml } from '../utils/helpers'

interface JournalCardProps {
  entry: JournalEntry
  onEdit: () => void
  onDelete: () => void
}

function JournalCard({ entry, onEdit, onDelete }: JournalCardProps) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: entry.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: entry.cardColor,
  }

  const dateStr = new Date(entry.date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })

  const plain = stripHtml(entry.content)
  const preview = plain ? plain.slice(0, 130) + (plain.length > 130 ? '…' : '') : 'No words yet…'

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`journal-card${isDragging ? ' is-dragging' : ''}`}
      {...attributes}
      aria-label={`Journal entry: ${entry.title || 'Untitled Chapter'}`}
    >
      <div className="card-top-row">
        <div className="card-left-meta">
          <span
            className="card-drag-handle"
            {...listeners}
            title="Drag to reorder"
            aria-label="Drag to reorder"
            role="button"
            tabIndex={0}
          >
            ⠿
          </span>
          <span className="card-mood" aria-label={`Mood: ${entry.mood}`}>{entry.mood}</span>
          <time className="card-date" dateTime={entry.date}>{dateStr}</time>
        </div>
        <div className="card-actions">
          <button
            className="card-action-btn"
            onClick={onEdit}
            title="Edit chapter"
            aria-label="Edit this entry"
          >
            🪶
          </button>
          <button
            className="card-action-btn"
            onClick={e => { e.stopPropagation(); onDelete() }}
            title="Delete chapter"
            aria-label="Delete this entry"
          >
            🗑️
          </button>
        </div>
      </div>

      <h3 className="card-title" onClick={onEdit}>
        {entry.title || 'Untitled Chapter'}
      </h3>

      <p className="card-preview" onClick={onEdit}>
        {preview}
      </p>

      {entry.stickers.length > 0 && (
        <div className="card-stickers" aria-label="Stickers">
          {entry.stickers.map((s, i) => (
            <span key={i} className="card-sticker" aria-hidden="true">{s}</span>
          ))}
        </div>
      )}
    </article>
  )
}

export default memo(JournalCard)
