import { useState } from 'react'
import { hashPin } from '../utils/helpers'

interface PinLockScreenProps {
  pinHash: string
  onUnlock: () => void
}

const PAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']

export default function PinLockScreen({ pinHash, onUnlock }: PinLockScreenProps) {
  const [digits, setDigits] = useState<string[]>([])
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)

  const addDigit = async (d: string) => {
    if (digits.length >= 4) return
    const next = [...digits, d]
    setDigits(next)
    setError(false)

    if (next.length === 4) {
      const hash = await hashPin(next.join(''))
      if (hash === pinHash) {
        onUnlock()
      } else {
        setShaking(true)
        setError(true)
        setTimeout(() => { setDigits([]); setShaking(false) }, 700)
      }
    }
  }

  const removeDigit = () => {
    setDigits(prev => prev.slice(0, -1))
    setError(false)
  }

  return (
    <div className="pin-screen" role="main">
      <div className="pin-container">
        <div className="pin-header">
          <span className="pin-icon" aria-hidden="true">🔒</span>
          <h1 className="pin-title">The Grimoire</h1>
          <p className="pin-subtitle">Enter your PIN to continue</p>
        </div>

        <div
          className={`pin-dots${shaking ? ' pin-shake' : ''}`}
          aria-label={`${digits.length} of 4 digits entered`}
          aria-live="polite"
        >
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={[
                'pin-dot',
                i < digits.length ? 'filled' : '',
                error ? 'error' : '',
              ].filter(Boolean).join(' ')}
            />
          ))}
        </div>

        <div className="pin-keypad" role="group" aria-label="PIN keypad">
          {PAD.map((key, i) =>
            key === '' ? (
              <div key={i} className="pin-key-empty" />
            ) : key === '⌫' ? (
              <button
                key={i}
                className="pin-key pin-key-back"
                onClick={removeDigit}
                aria-label="Delete last digit"
                disabled={digits.length === 0}
              >
                {key}
              </button>
            ) : (
              <button
                key={i}
                className="pin-key"
                onClick={() => addDigit(key)}
                aria-label={`${key}`}
                disabled={digits.length >= 4}
              >
                {key}
              </button>
            )
          )}
        </div>

        {error && (
          <p className="pin-error" role="alert">Incorrect PIN — try again</p>
        )}
      </div>
    </div>
  )
}
