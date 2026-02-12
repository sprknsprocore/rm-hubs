import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { WbsCodeItem } from '../../../hooks/useHubData'

interface WbsHeatmapCardProps {
  data: WbsCodeItem[]
}

function pfTier(pf: number): { label: string; bg: string; border: string; text: string } {
  if (pf >= 1.0) return { label: 'on_track', bg: 'var(--figma-success-light, rgba(34,197,94,0.12))', border: 'var(--figma-success)', text: 'var(--figma-success)' }
  if (pf >= 0.9) return { label: 'at_risk', bg: 'rgba(234,179,8,0.1)', border: 'var(--figma-chart-2)', text: 'var(--figma-chart-2)' }
  return { label: 'exception', bg: 'var(--figma-error-light)', border: 'var(--figma-chart-exception)', text: 'var(--figma-chart-exception)' }
}

export default function WbsHeatmapCard({ data }: WbsHeatmapCardProps) {
  const exceptionCount = data.filter((c) => c.performanceFactor < 0.9).length

  const signal = (
    <div className="flex flex-col gap-3">
      {exceptionCount > 0 && (
        <div
          className="rounded-lg px-3 py-2 text-[12px] font-medium"
          style={{ backgroundColor: 'var(--figma-error-light)', color: 'var(--figma-error)' }}
        >
          {exceptionCount} cost code(s) below 0.9 PF
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {data.map((code) => {
          const tier = pfTier(code.performanceFactor)
          // Parse display name: "03 30 00 - Concrete" → "Concrete"
          const displayName = code.costCodeOrWBS.includes(' - ')
            ? code.costCodeOrWBS.split(' - ')[1]
            : code.costCodeOrWBS
          const wbsCode = code.costCodeOrWBS.includes(' - ')
            ? code.costCodeOrWBS.split(' - ')[0]
            : ''
          return (
            <div
              key={code.id}
              className="rounded-lg border-l-[3px] px-3 py-2.5"
              style={{
                borderLeftColor: tier.border,
                backgroundColor: 'var(--figma-bg-depth2)',
              }}
            >
              <p className="text-[12px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
                {displayName}
              </p>
              {wbsCode && (
                <p className="text-[10px]" style={{ color: 'var(--figma-text-tertiary, var(--figma-text-secondary))' }}>
                  {wbsCode}
                </p>
              )}
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
                  {code.earnedHours}h / {code.actualHours}h
                </span>
                <span className="text-[12px] font-bold tabular-nums" style={{ color: tier.text }}>
                  {code.performanceFactor.toFixed(2)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const context = (
    <span>Color-coded Performance Factor by cost code. Red tiles need immediate True-Up; green tiles confirm the bid estimate is holding.</span>
  )

  return (
    <ActionableInsightCard
      title="WBS Productivity Heatmap"
      signal={signal}
      context={context}
      kickoff={{ label: 'True-Up', onClick: () => {} }}
      kickoffPriority="p1"
    />
  )
}
