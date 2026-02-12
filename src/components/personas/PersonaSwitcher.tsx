import type { Persona } from '../../types/lem'

interface PersonaSwitcherProps {
  value: Persona
  onChange: (p: Persona) => void
}

const options: { value: Persona; label: string }[] = [
  { value: 'heavyCivil', label: 'Heavy Civil PM' },
  { value: 'specialty', label: 'Specialty Contractor' },
  { value: 'planner', label: 'Engineering Planner' },
]

export default function PersonaSwitcher({ value, onChange }: PersonaSwitcherProps) {
  return (
    <div
      className="flex gap-1 rounded-lg border p-1"
      style={{
        backgroundColor: 'var(--figma-bg-depth2)',
        borderColor: 'var(--figma-bg-outline)',
      }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
          style={
            value === opt.value
              ? {
                  backgroundColor: 'var(--figma-bg-default)',
                  color: 'var(--figma-primary-main)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }
              : { color: 'var(--figma-text-secondary)' }
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
