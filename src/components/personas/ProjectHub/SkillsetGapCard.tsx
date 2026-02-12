import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { ProjectData } from '../../../types/lem'
import { Users } from 'lucide-react'

interface SkillsetGapCardProps {
  projectData: ProjectData
  onAssignFromSmartBench: () => void
}

export default function SkillsetGapCard({ projectData, onAssignFromSmartBench }: SkillsetGapCardProps) {
  const items = projectData.skillsetGap ?? []
  const signal = (
    <div className="space-y-2">
      {items.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--figma-text-secondary)' }}>No skillset gap for this period.</p>
      ) : (
        items.map((item, i) => {
          const short = item.assigned < item.required
          return (
            <div
              key={i}
              className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
              style={{
                backgroundColor: short ? 'var(--figma-error-light)' : 'var(--figma-bg-depth2)',
                borderColor: short ? 'var(--figma-error)' : 'var(--figma-bg-outline)',
              }}
            >
              <div className="min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: 'var(--figma-text-primary)' }}>{item.role}</div>
                <div className="text-xs" style={{ color: 'var(--figma-text-secondary)' }}>{item.period}</div>
              </div>
              <div className="shrink-0 text-sm tabular-nums" style={{ color: short ? 'var(--figma-error)' : 'var(--figma-text-primary)' }}>
                {item.assigned} / {item.required} assigned
              </div>
              <Users className="h-4 w-4 shrink-0" style={{ color: 'var(--figma-text-muted)' }} aria-hidden />
            </div>
          )
        })
      )}
    </div>
  )

  const context = items.some((i) => i.assigned < i.required)
    ? 'This project requires more of a role in a period than currently assigned.'
    : 'Skillset demand is covered for the current plan.'

  return (
    <ActionableInsightCard
      title="Skillset Gap"
      signal={signal}
      context={context}
      kickoff={{
        label: 'Assign from Smart Bench',
        onClick: onAssignFromSmartBench,
      }}
      kickoffPriority="p2"
    />
  )
}
