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
        backgroundColor: 'var(--figma-bg-depth2)',
        borderColor: 'var(--figma-bg-outline)',
      }}
      role="tablist"
      aria-label="Select persona"
    >
      {OPTIONS.map((opt) => {
        const isActive = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.value)}
            className="rounded-md px-4 py-2 text-[13px] font-semibold transition-all duration-150"
            style={
              isActive
                ? {
                    backgroundColor: 'var(--figma-primary-main)',
                    color: '#fff',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                  }
                : {
                    color: 'var(--figma-text-secondary)',
                    backgroundColor: 'transparent',
                  }
            }
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
