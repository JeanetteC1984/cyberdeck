import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { JournalEntry } from '../types'

interface JournalCardProps {
  entry: JournalEntry
  onEdit: () => void
  onDelete: () => void
}

export default function JournalCard({ entry, onEdit, onDelete }: JournalCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: entry.cardColor,
  }

  const dateStr = new Date(entry.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const preview = entry.content
    ? entry.content.slice(0, 130) + (entry.content.length > 130 ? '…' : '')
    : 'No content yet…'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`journal-card${isDragging ? ' is-dragging' : ''}`}
      {...attributes}
    >
      <div className="card-top-row">
        <div className="card-left-meta">
          <span
            className="card-drag-handle"
            {...listeners}
            title="Drag to reorder"
          >
            ⠿
          </span>
          <span className="card-mood">{entry.mood}</span>
          <span className="card-date">{dateStr}</span>
        </div>
        <div className="card-actions">
          <button
            className="card-action-btn"
            onClick={onEdit}
            title="Edit entry"
          >
            ✏️
          </button>
          <button
            className="card-action-btn"
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            title="Delete entry"
          >
            🗑️
          </button>
        </div>
      </div>

      <h3 className="card-title" onClick={onEdit}>
        {entry.title || 'Untitled Entry'}
      </h3>

      <p className="card-preview" onClick={onEdit}>
        {preview}
      </p>

      {entry.stickers.length > 0 && (
        <div className="card-stickers">
          {entry.stickers.map((s, i) => (
            <span key={i} className="card-sticker">{s}</span>
          ))}
        </div>
      )}
    </div>
  )
}
