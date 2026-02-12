import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Truck } from 'lucide-react'
import LeftNav from './LeftNav'
import TopRail from './TopRail'
import { getUnifiedLemPayload } from '../../api/mockLemApi'

export default function EquipmentLogLayout() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const source = searchParams.get('source')
  const unified = getUnifiedLemPayload()
  const telematics = unified.equipmentData.telematics
  const idleUnits = telematics.filter((t) => t.daysInactive >= 3)

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--figma-bg-depth1)' }}>
      <LeftNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopRail
          nlQuery=""
          onNlQueryChange={() => {}}
          persona="heavyCivil"
          onPersonaChange={() => {}}
        />
        <main className="p-4 md:p-6" style={{ minHeight: 'calc(100vh - var(--figma-header-height))' }}>
          <header className="mb-4 flex flex-wrap items-center gap-3 border-b pb-3" style={{ borderColor: 'var(--figma-bg-outline)' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-black/[0.06]"
              style={{ color: 'var(--figma-text-secondary)' }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Hub
            </button>
            <span className="text-sm" style={{ color: 'var(--figma-text-disabled)' }}>|</span>
            <h1 className="text-lg font-semibold" style={{ color: 'var(--figma-text-primary)' }}>
              Equipment log
            </h1>
            {source === 'command-center' && (
              <span className="rounded-full px-2.5 py-0.5 text-xs" style={{ backgroundColor: 'var(--figma-bg-depth2)', color: 'var(--figma-text-secondary)' }}>
                Idle units (deep link)
              </span>
            )}
          </header>
          <div className="rounded-lg border p-4" style={{ borderColor: 'var(--figma-bg-outline)', backgroundColor: 'var(--figma-bg-default)' }}>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--figma-text-primary)' }}>
              <Truck className="h-4 w-4" />
              Idle units (&gt;72 hrs)
            </h2>
            {idleUnits.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--figma-text-secondary)' }}>No idle units.</p>
            ) : (
              <ul className="space-y-2">
                {idleUnits.map((u) => (
                  <li
                    key={u.id}
                    className="flex items-center justify-between rounded-lg border px-3 py-2"
                    style={{ borderColor: 'var(--figma-bg-outline)', backgroundColor: 'var(--figma-bg-depth2)' }}
                  >
                    <span className="font-medium" style={{ color: 'var(--figma-text-primary)' }}>{u.id}</span>
                    <span className="text-sm" style={{ color: 'var(--figma-text-secondary)' }}>{u.type}</span>
                    <span className="text-xs" style={{ color: 'var(--figma-error)' }}>{u.daysInactive} days inactive</span>
                    {u.site && <span className="text-xs" style={{ color: 'var(--figma-text-secondary)' }}>{u.site}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
