import { THEMES, ThemeOption, Theme } from '../types'

interface ThemePickerProps {
  currentTheme: Theme
  onSelect: (theme: Theme) => void
  onClose: () => void
}

export default function ThemePicker({ currentTheme, onSelect, onClose }: ThemePickerProps) {
  return (
    <div className="theme-picker-overlay" onClick={onClose}>
      <div className="theme-picker-panel" onClick={(e) => e.stopPropagation()}>
        <p className="theme-picker-title">✨ Choose Your Vibe</p>
        <div className="theme-options">
          {THEMES.map((t: ThemeOption) => (
            <button
              key={t.id}
              className={`theme-option${currentTheme === t.id ? ' active' : ''}`}
              onClick={() => onSelect(t.id)}
            >
              <span
                className="theme-swatch"
                style={{ background: `linear-gradient(135deg, ${t.primaryColor}, ${t.bgColor})` }}
              />
              <span className="theme-name">{t.name}</span>
              <span className="theme-emoji">{t.emoji}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
