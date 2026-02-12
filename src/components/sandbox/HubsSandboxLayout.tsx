import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useHubData, type Persona } from '../../hooks/useHubData'
import SandboxPersonaToggle from './SandboxPersonaToggle'
import EvergreenLayer from './layers/EvergreenLayer'
import LemSpecificLayer from './layers/LemSpecificLayer'
import ActionableLayer from './layers/ActionableLayer'
import VariableLayer from './layers/VariableLayer'
import ExtraLayer from './layers/ExtraLayer'

export default function HubsSandboxLayout() {
  const navigate = useNavigate()
  const [persona, setPersona] = useState<Persona>('specialty')
  const data = useHubData()

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--figma-bg-depth1)' }}
    >
      {/* ── Glassmorphism Header ── */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b px-6 py-4 md:px-8"
        style={{
          backgroundColor: 'var(--figma-header-glass-bg)',
          borderColor: 'var(--figma-header-glass-border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-black/[0.06] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black/10"
            style={{ color: 'var(--figma-text-secondary)' }}
            aria-label="Back to Resource Management"
            title="Back to Resource Management"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1
              className="text-lg font-semibold tracking-tight"
              style={{ color: 'var(--figma-text-primary)' }}
            >
              Dashboard Configuration
            </h1>
            <p
              className="mt-0.5 text-[13px]"
              style={{ color: 'var(--figma-text-secondary)' }}
            >
              Experience Layer Prototype — LEM Insight Components
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--figma-text-secondary)' }}
          >
            Insights by Persona
          </span>
          <SandboxPersonaToggle value={persona} onChange={setPersona} />
        </div>
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
