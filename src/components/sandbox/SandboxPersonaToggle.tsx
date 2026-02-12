import type { Persona } from '../../hooks/useHubData'

interface SandboxPersonaToggleProps {
  value: Persona
  onChange: (p: Persona) => void
}

const OPTIONS: { value: Persona; label: string }[] = [
  { value: 'heavyCivil', label: 'Heavy Civil PM' },
  { value: 'specialty', label: 'Specialty Contractor' },
  { value: 'planner', label: 'Engineering Planner' },
]

export default function SandboxPersonaToggle({ value, onChange }: SandboxPersonaToggleProps) {
  return (
    <div
      className="flex gap-1 rounded-lg border p-1"
      style={{
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderColor: 'var(--figma-header-glass-border)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="rounded-md px-4 py-2 text-sm font-medium transition-all duration-150"
          style={
            value === opt.value
              ? {
                  backgroundColor: 'var(--figma-bg-default)',
                  color: 'var(--figma-primary-main)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
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
