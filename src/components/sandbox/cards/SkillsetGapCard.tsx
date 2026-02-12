import { Users } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { SkillsetGapItem } from '../../../hooks/useHubData'

interface SkillsetGapCardProps {
  data: SkillsetGapItem[]
}

export default function SkillsetGapCard({ data }: SkillsetGapCardProps) {
  const gapCount = data.filter((g) => g.assigned < g.required).length

  const signal = (
    <div className="flex flex-col gap-3">
      {gapCount > 0 && (
        <div
          className="rounded-lg px-3 py-2 text-[12px] font-medium"
          style={{ backgroundColor: 'var(--figma-error-light)', color: 'var(--figma-error)' }}
        >
          {gapCount} role(s) understaffed
        </div>
      )}
      <ul className="space-y-2">
        {data.map((gap) => {
          const hasGap = gap.assigned < gap.required
          return (
            <li
              key={gap.role}
              className="flex items-center justify-between rounded-lg border px-3 py-2.5"
              style={{
                borderColor: hasGap ? 'var(--figma-error)' : 'var(--figma-bg-outline)',
                backgroundColor: hasGap ? 'var(--figma-error-light)' : 'var(--figma-bg-depth2)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <Users className="h-4 w-4 shrink-0" style={{ color: hasGap ? 'var(--figma-error)' : 'var(--figma-text-secondary)' }} />
                <div>
                  <p className="text-[13px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
                    {gap.role}
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
                    Needed by {gap.period}
                  </p>
                </div>
              </div>
              <span
                className="text-[12px] font-bold tabular-nums"
                style={{ color: hasGap ? 'var(--figma-error)' : 'var(--figma-success)' }}
              >
                {gap.assigned} / {gap.required}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )

  const context = (
    <span>Highlights roles where assigned headcount falls short of project requirements. Gaps need immediate Smart Bench or external sourcing action.</span>
  )

  return (
    <ActionableInsightCard
      title="Skillset Gap"
      signal={signal}
      context={context}
      kickoff={{ label: 'Assign from Smart Bench', onClick: () => {} }}
      kickoffPriority="p2"
    />
  )
}
