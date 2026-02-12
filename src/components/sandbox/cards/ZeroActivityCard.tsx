import { AlertTriangle, Truck } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { ZeroActivityAlert } from '../../../hooks/useHubData'

interface ZeroActivityCardProps {
  data: ZeroActivityAlert[]
  onExpand?: (insightId: string) => void
}

export default function ZeroActivityCard({ data, onExpand }: ZeroActivityCardProps) {
  const totalDailyCost = data.reduce((sum, a) => sum + a.dailyCost, 0)

  const signal = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'var(--figma-error-light)', color: 'var(--figma-error)' }}
        >
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--figma-error)' }}>
            {data.length} Assets Idle
          </p>
          <p className="text-[12px]" style={{ color: 'var(--figma-text-secondary)' }}>
            Rental leakage: ${totalDailyCost.toLocaleString()}/day
          </p>
        </div>
      </div>
      <ul className="space-y-2">
        {data.map((alert) => (
          <li
            key={alert.id}
            className="flex items-center justify-between rounded-lg border px-3 py-2.5"
            style={{
              borderColor: 'var(--figma-bg-outline)',
              backgroundColor: 'var(--figma-bg-depth2)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <Truck className="h-4 w-4 shrink-0" style={{ color: 'var(--figma-text-secondary)' }} />
              <div>
                <span className="text-[13px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
                  {alert.assetId} — {alert.assetType}
                </span>
                <p className="text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
                  {alert.site} · {alert.daysIdle} days idle
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold tabular-nums" style={{ color: 'var(--figma-error)' }}>
              ${alert.dailyCost}/day
            </span>
          </li>
        ))}
      </ul>
    </div>
  )

  const context = (
    <span>Assets idle &gt;72 hours with active rental. Immediate demobilization recommended to stop cost leakage.</span>
  )

  return (
    <ActionableInsightCard
      title="Zero Activity Alert"
      signal={signal}
      context={context}
      kickoff={{ label: 'Off-Rent', onClick: () => onExpand?.('zero-activity') }}
      kickoffPriority="p1"
      onInsightExpand={onExpand ? () => onExpand('zero-activity') : undefined}
    />
  )
}
