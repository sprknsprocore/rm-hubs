import { AlertCircle, CheckCircle } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { Milestone } from '../../../types/lem'

interface MilestoneTrackerProps {
  milestones: Milestone[]
}

export default function MilestoneTracker({ milestones }: MilestoneTrackerProps) {
  const atRisk = milestones.filter((m) => m.status === 'at_risk' || m.status === 'delayed')

  const signal = (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold" style={{ color: 'var(--figma-text-primary)' }}>{atRisk.length}</span>
      <span className="text-sm" style={{ color: 'var(--figma-text-secondary)' }}>at risk / delayed</span>
    </div>
  )

  const context = (
    <ul className="space-y-2 text-sm">
      {milestones.map((m) => (
        <li key={m.id} className="flex items-start gap-2">
          {m.status === 'on_track' ? (
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--figma-success)' }} />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--figma-primary-main)' }} />
          )}
          <div>
            <span className="font-medium" style={{ color: 'var(--figma-text-primary)' }}>{m.name}</span>
            {m.predecessorDelay && (
              <span className="ml-1" style={{ color: 'var(--figma-text-secondary)' }}>· {m.predecessorDelay}</span>
            )}
            {m.atRiskReason && (
              <p className="text-xs" style={{ color: 'var(--figma-text-secondary)' }}>{m.atRiskReason}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  )

  return (
    <ActionableInsightCard
      title="Milestone Tracker"
      signal={signal}
      context={context}
      kickoff={{ label: 'View schedule', onClick: () => window.history.pushState({}, '', '/workflow/schedule') }}
      kickoffPriority="p2"
    />
  )
}
