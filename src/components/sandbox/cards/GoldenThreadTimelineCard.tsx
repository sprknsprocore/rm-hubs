import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { FieldLogEntry } from '../../../hooks/useHubData'

interface GoldenThreadTimelineCardProps {
  data: FieldLogEntry[]
}

export default function GoldenThreadTimelineCard({ data }: GoldenThreadTimelineCardProps) {
  const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const signal = (
    <div className="flex flex-col gap-0.5">
      {sorted.map((log, idx) => {
        const date = new Date(log.date)
        const dateLabel = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        const timeLabel = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        const hasVariance = !!log.varianceReason
        const isLast = idx === sorted.length - 1

        return (
          <div key={log.id} className="flex gap-3">
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center">
              <div
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: hasVariance ? 'var(--figma-chart-exception)' : 'var(--figma-primary-main)' }}
              />
              {!isLast && (
                <div
                  className="w-0.5 flex-1"
                  style={{ backgroundColor: hasVariance ? 'var(--figma-chart-exception)' : 'var(--figma-bg-outline)' }}
                />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold" style={{ color: 'var(--figma-text-primary)' }}>
                  {dateLabel}
                </span>
                <span className="text-[11px]" style={{ color: 'var(--figma-text-tertiary, var(--figma-text-secondary))' }}>
                  {timeLabel}
                </span>
              </div>
              <div className="mt-0.5 flex flex-wrap gap-2 text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
                {log.quantityClaimed > 0 && <span>Qty {log.quantityClaimed}</span>}
                <span>{log.manHoursLogged}h</span>
              </div>
              {log.varianceReason && (
                <p className="mt-1 text-[11px] font-medium" style={{ color: 'var(--figma-chart-exception)' }}>
                  {log.varianceReason}
                </p>
              )}
              <p className="mt-1 text-[12px] leading-relaxed" style={{ color: 'var(--figma-text-secondary)' }}>
                {log.fieldNoteSnippet}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )

  const context = (
    <span>Chronological field log trail connecting daily quantities, hours, and variance reasons. The "golden thread" from field to finance.</span>
  )

  return (
    <ActionableInsightCard
      title="Golden Thread Timeline"
      signal={signal}
      context={context}
      kickoff={{ label: 'View Full Log', onClick: () => {} }}
      kickoffPriority="p3"
    />
  )
}
