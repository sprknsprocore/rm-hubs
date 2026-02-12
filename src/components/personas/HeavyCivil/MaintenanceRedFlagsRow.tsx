import { Wrench, Award } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { MaintenanceRedFlag } from '../../../types/lem'

interface MaintenanceRedFlagsRowProps {
  items: MaintenanceRedFlag[]
}

function SeverityBadge({ severity }: { severity?: 'high' | 'medium' }) {
  if (!severity) return null
  const isHigh = severity === 'high'
  return (
    <span
      className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{
        backgroundColor: isHigh ? 'var(--figma-error-light)' : 'var(--figma-info-light)',
        color: isHigh ? 'var(--figma-error)' : 'var(--figma-info)',
      }}
    >
      {severity}
    </span>
  )
}

export default function MaintenanceRedFlagsRow({ items }: MaintenanceRedFlagsRowProps) {
  const singleItem = items.length === 1 ? items[0] : null

  const signal = (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {singleItem ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {singleItem.type === 'maintenance' ? (
              <Wrench className="h-6 w-6 shrink-0" style={{ color: 'var(--figma-primary-main)' }} />
            ) : (
              <Award className="h-6 w-6 shrink-0" style={{ color: 'var(--figma-info)' }} />
            )}
            <SeverityBadge severity={singleItem.severity} />
          </div>
          <p
            className="text-[15px] font-medium leading-snug"
            style={{ color: 'var(--figma-text-primary)' }}
          >
            {singleItem.title}
          </p>
          <p className="text-sm" style={{ color: 'var(--figma-text-secondary)' }}>
            Due {new Date(singleItem.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </>
      ) : (
        <>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold" style={{ color: 'var(--figma-text-primary)' }}>
              {items.length}
            </span>
            <span className="text-sm" style={{ color: 'var(--figma-text-secondary)' }}>
              red flag{items.length !== 1 ? 's' : ''} need attention
            </span>
          </div>
          <ul className="min-h-0 flex-1 space-y-2 overflow-auto text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex items-start gap-2">
                {item.type === 'maintenance' ? (
                  <Wrench className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--figma-primary-main)' }} />
                ) : (
                  <Award className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--figma-info)' }} />
                )}
                <span className="flex-1" style={{ color: 'var(--figma-text-primary)' }}>
                  {item.title}
                </span>
                <SeverityBadge severity={item.severity} />
                <span className="shrink-0 text-xs" style={{ color: 'var(--figma-text-disabled)' }}>
                  Due {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )

  const context =
    items.length === 0 ? (
      <span style={{ color: 'var(--figma-text-secondary)' }}>No open maintenance or cert alerts.</span>
    ) : singleItem ? (
      <span style={{ color: 'var(--figma-text-secondary)' }}>
        {singleItem.type === 'expiring_cert' ? 'Expiring certification' : 'Scheduled maintenance'} — resolve before due date to avoid compliance risk.
      </span>
    ) : (
      <span style={{ color: 'var(--figma-text-secondary)' }}>
        Review and assign training or schedule maintenance before due dates.
      </span>
    )

  return (
    <ActionableInsightCard
      title="Maintenance & expiring certs"
      signal={signal}
      context={context}
      kickoff={{ label: 'View all', onClick: () => window.history.pushState({}, '', '/workflow/red-flags') }}
      kickoffPriority="p3"
    />
  )
}
