import { FileQuestion } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { MissingProductionItem } from '../../../hooks/useHubData'

interface MissingProductionCardProps {
  data: MissingProductionItem[]
}

export default function MissingProductionCard({ data }: MissingProductionCardProps) {
  const totalHours = data.reduce((s, d) => s + d.hoursLogged, 0)

  const signal = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'var(--figma-info-light)', color: 'var(--figma-info)' }}
        >
          <FileQuestion className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--figma-info)' }}>
            {data.length} Cost Codes
          </p>
          <p className="text-[12px]" style={{ color: 'var(--figma-text-secondary)' }}>
            {totalHours} hours logged with 0 units reported
          </p>
        </div>
      </div>
      <ul className="space-y-2">
        {data.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-lg border px-3 py-2.5"
            style={{
              borderColor: 'var(--figma-bg-outline)',
              backgroundColor: 'var(--figma-bg-depth2)',
            }}
          >
            <span className="text-[13px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
              {item.costCode}
            </span>
            <span className="text-[12px] tabular-nums" style={{ color: 'var(--figma-text-secondary)' }}>
              {item.hoursLogged} hrs / {item.unitsReported} units
            </span>
          </li>
        ))}
      </ul>
    </div>
  )

  const context = (
    <span>Cost codes where hours were logged but no production quantities reported. Prevents accurate Performance Factor calculation.</span>
  )

  return (
    <ActionableInsightCard
      title="Missing Production Quantities"
      signal={signal}
      context={context}
      kickoff={{ label: 'Review Log', onClick: () => {} }}
      kickoffPriority="p2"
    />
  )
}
