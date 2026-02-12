import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { ProjectData } from '../../../types/lem'
import { Calendar } from 'lucide-react'

interface MilestoneBufferCardProps {
  projectData: ProjectData
}

export default function MilestoneBufferCard({ projectData }: MilestoneBufferCardProps) {
  const items = projectData.milestoneBuffer ?? []
  const signal = (
    <div className="space-y-2">
      {items.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--figma-text-secondary)' }}>No milestone buffer data.</p>
      ) : (
        items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
            style={{
              backgroundColor: 'var(--figma-bg-depth2)',
              borderColor: 'var(--figma-bg-outline)',
            }}
          >
            <div className="min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: 'var(--figma-text-primary)' }}>{item.milestoneName}</div>
              <div className="text-xs" style={{ color: 'var(--figma-text-secondary)' }}>After {item.predecessorName}</div>
            </div>
            <div className="flex shrink-0 items-center gap-1 tabular-nums text-sm font-semibold" style={{ color: 'var(--figma-text-primary)' }}>
              <Calendar className="h-4 w-4" style={{ color: 'var(--figma-text-muted)' }} aria-hidden />
              {item.daysUntil} days
            </div>
          </div>
        ))
      )}
    </div>
  )

  const context = 'Days until the next predecessor (e.g. days until Electrical can start after Slab Pour).'

  return (
    <ActionableInsightCard
      title="Milestone Buffer"
      signal={signal}
      context={context}
      kickoff={{ label: 'View schedule', onClick: () => {} }}
      kickoffPriority="p2"
    />
  )
}
