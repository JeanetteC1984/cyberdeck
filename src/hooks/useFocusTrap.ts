import { useEffect, useRef } from 'react'

const FOCUSABLE = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',')

export function useFocusTrap(isActive: boolean, onEscape?: () => void) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !ref.current) return
    const el = ref.current

    const getFocusable = () => Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE))

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onEscape?.(); return }
      if (e.key !== 'Tab') return
      const items = getFocusable()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { last.focus(); e.preventDefault() }
      } else {
        if (document.activeElement === last) { first.focus(); e.preventDefault() }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    getFocusable()[0]?.focus()
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isActive, onEscape])

  return ref
}
