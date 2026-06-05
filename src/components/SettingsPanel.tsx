import { useRef, useState } from 'react'
import { hashPin } from '../utils/helpers'

interface SettingsPanelProps {
  onClose: () => void
  onExport: () => void
  onImport: (file: File) => void
  pinHash: string | null
  onSetPin: (hash: string) => void
  onRemovePin: () => void
}

type PinStep = 'idle' | 'enter' | 'confirm'

export default function SettingsPanel({
  onClose,
  onExport,
  onImport,
  pinHash,
  onSetPin,
  onRemovePin,
}: SettingsPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<PinStep>('idle')
  const [pin1, setPin1] = useState('')
  const [pin2, setPin2] = useState('')
  const [pinErr, setPinErr] = useState('')

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { onImport(file); onClose() }
  }

  const handlePinNext = async () => {
    if (step === 'enter') {
      if (pin1.length < 4) { setPinErr('Enter a 4-digit PIN'); return }
      setStep('confirm')
      setPinErr('')
    } else {
      if (pin1 !== pin2) { setPinErr("PINs don't match"); setStep('enter'); setPin2(''); return }
      const hash = await hashPin(pin1)
      onSetPin(hash)
      resetPin()
      onClose()
    }
  }

  const resetPin = () => { setStep('idle'); setPin1(''); setPin2(''); setPinErr('') }

  return (
    <div
      className="theme-picker-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <div
        className="theme-picker-panel settings-panel"
        onClick={e => e.stopPropagation()}
      >
        <div className="settings-header">
          <p className="theme-picker-title">⚙️ Settings</p>
          <button
            className="editor-close-btn"
            onClick={onClose}
            aria-label="Close settings"
            style={{ background: 'transparent', border: '1px solid var(--color-border)' }}
          >
            ✕
          </button>
        </div>

        {/* Backup */}
        <div className="settings-section">
          <p className="settings-section-label">Backup</p>
          <button className="settings-btn" onClick={onExport}>
            📤 Export Grimoire
          </button>
          <button className="settings-btn" onClick={() => fileRef.current?.click()}>
            📥 Import Grimoire
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
          <p className="settings-hint">Import merges new entries without overwriting existing ones.</p>
        </div>

        {/* PIN */}
        <div className="settings-section">
          <p className="settings-section-label">Security</p>
          {pinHash && step === 'idle' ? (
            <button
              className="settings-btn settings-btn-danger"
              onClick={() => { onRemovePin(); onClose() }}
            >
              🔓 Remove PIN Lock
            </button>
          ) : step === 'idle' ? (
            <button className="settings-btn" onClick={() => setStep('enter')}>
              🔒 Set PIN Lock
            </button>
          ) : (
            <div className="pin-setup-form">
              <label className="settings-section-label">
                {step === 'enter' ? 'Choose a 4-digit PIN' : 'Confirm your PIN'}
              </label>
              <input
                className="pin-setup-input"
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="• • • •"
                value={step === 'enter' ? pin1 : pin2}
                onChange={e => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 4)
                  step === 'enter' ? setPin1(v) : setPin2(v)
                }}
                onKeyDown={e => e.key === 'Enter' && handlePinNext()}
                autoFocus
              />
              {pinErr && <p className="pin-setup-error" role="alert">{pinErr}</p>}
              <div className="pin-setup-btns">
                <button className="btn-ghost" onClick={resetPin}>Cancel</button>
                <button className="btn-save" onClick={handlePinNext} style={{ padding: '.4rem 1.1rem', fontSize: '.85rem' }}>
                  {step === 'enter' ? 'Next →' : 'Save PIN'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
