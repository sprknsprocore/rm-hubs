import { useState } from 'react'
import { useHubData, type Persona } from '../../hooks/useHubData'
import SandboxPersonaToggle from './SandboxPersonaToggle'
import EvergreenLayer from './layers/EvergreenLayer'
import LemSpecificLayer from './layers/LemSpecificLayer'
import ActionableLayer from './layers/ActionableLayer'
import VariableLayer from './layers/VariableLayer'
import ExtraLayer from './layers/ExtraLayer'

export default function HubsSandboxLayout() {
  const [persona, setPersona] = useState<Persona>('specialty')
  const data = useHubData()

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--figma-bg-depth1)' }}
    >
      {/* ── Glassmorphism Header ── */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between border-b px-6 py-4 md:px-8"
        style={{
          backgroundColor: 'var(--figma-header-glass-bg)',
          borderColor: 'var(--figma-header-glass-border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div>
          <h1
            className="text-lg font-semibold tracking-tight"
            style={{ color: 'var(--figma-text-primary)' }}
          >
            Hub Sandbox
          </h1>
          <p
            className="mt-0.5 text-[13px]"
            style={{ color: 'var(--figma-text-secondary)' }}
          >
            Experience Layer Prototype — LEM Insight Components
          </p>
        </div>
        <SandboxPersonaToggle value={persona} onChange={setPersona} />
      </header>

      {/* ── Content ── */}
      <main className="mx-auto max-w-[1440px] space-y-10 px-6 py-8 md:px-8">
        <EvergreenLayer data={data} persona={persona} />
        <LemSpecificLayer data={data} persona={persona} />
        <ActionableLayer data={data} persona={persona} />
        <VariableLayer data={data} persona={persona} />
        <ExtraLayer data={data} persona={persona} />
      </main>
    </div>
  )
}
