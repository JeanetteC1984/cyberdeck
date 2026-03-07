import { useState } from 'react'
import { STICKER_CATEGORIES } from '../types'
import { useDraggable } from '@dnd-kit/core'

interface DraggableStickerProps {
  emoji: string
  categoryKey: string
  onAdd: (emoji: string) => void
}

function DraggableSticker({ emoji, categoryKey, onAdd }: DraggableStickerProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sticker-${categoryKey}-${emoji}`,
    data: { type: 'sticker', emoji },
  })

  return (
    <span
      ref={setNodeRef}
      className="sticker-item"
      style={{ opacity: isDragging ? 0.4 : 1 }}
      onClick={() => onAdd(emoji)}
      title={`Drag or click to add ${emoji}`}
      {...listeners}
      {...attributes}
    >
      {emoji}
    </span>
  )
}

interface StickerPickerProps {
  onAdd: (emoji: string) => void
}

export default function StickerPicker({ onAdd }: StickerPickerProps) {
  const categories = Object.keys(STICKER_CATEGORIES)
  const [activeTab, setActiveTab] = useState(categories[0])

  return (
    <div className="sticker-picker">
      <div className="sticker-picker-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`sticker-tab${activeTab === cat ? ' active' : ''}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="sticker-grid">
        {(STICKER_CATEGORIES[activeTab] ?? []).map((emoji) => (
          <DraggableSticker
            key={emoji}
            emoji={emoji}
            categoryKey={activeTab}
            onAdd={onAdd}
          />
        ))}
      </div>
    </div>
  )
}
