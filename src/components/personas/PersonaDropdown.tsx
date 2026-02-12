import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Persona } from '../../types/lem'

interface PersonaDropdownProps {
  value: Persona
  onChange: (p: Persona) => void
  /** Use dark theme for top bar */
  variant?: 'default' | 'dark'
}

const OPTIONS: { value: Persona; label: string }[] = [
  { value: 'heavyCivil', label: 'Heavy Civil PM' },
  { value: 'specialty', label: 'Specialty Contractor' },
  { value: 'planner', label: 'Engineering Planner' },
]

export default function PersonaDropdown({ value, onChange, variant = 'default' }: PersonaDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isDark = variant === 'dark'

  const currentLabel = OPTIONS.find((o) => o.value === value)?.label ?? value

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 items-center gap-1 rounded border px-2.5 py-0 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 md:h-auto md:px-3 md:py-2"
        style={isDark
          ? {
              backgroundColor: 'var(--figma-topbar-select-bg)',
              borderColor: 'var(--figma-topbar-border)',
              color: 'var(--figma-topbar-text)',
            }
          : {
              backgroundColor: 'var(--figma-bg-default)',
              borderColor: 'var(--figma-bg-outline)',
              color: 'var(--figma-text-primary)',
            }
        }
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Persona"
      >
        {currentLabel}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          style={{ color: isDark ? 'var(--figma-topbar-text-muted)' : 'var(--figma-text-secondary)' }}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded-lg border py-1 shadow-lg"
          style={{
            backgroundColor: 'var(--figma-bg-default)',
            borderColor: 'var(--figma-bg-outline)',
          }}
        >
          {OPTIONS.map((opt) => (
            <li key={opt.value} role="option" aria-selected={value === opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className="w-full px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-inset"
                style={{
                  color: value === opt.value ? 'var(--figma-primary-main)' : 'var(--figma-text-primary)',
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
