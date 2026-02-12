import type { FieldLog } from '../../../types/lem'
import { Image } from 'lucide-react'

interface GoldenThreadTimelineProps {
  fieldLogs: FieldLog[]
}

const VARIANCE_ACCENT = 'var(--figma-chart-exception)' // left border for variance

export default function GoldenThreadTimeline({ fieldLogs }: GoldenThreadTimelineProps) {
  const sorted = [...fieldLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <article className="figma-card-base flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl">
      <div
        className="figma-card-border flex shrink-0 flex-col gap-0.5 border-b px-4 py-3 md:px-5 md:py-3.5"
      >
        <h2 className="m-0 text-[13px] font-semibold tracking-[-0.02em]" style={{ color: 'var(--figma-text-primary)' }}>
          Field log
        </h2>
        <p className="m-0 text-[11px]" style={{ color: 'var(--figma-text-tertiary)' }}>
          Quantity claimed, man-hours, notes
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2.5">
        <ul className="space-y-1">
          {sorted.map((log) => {
            const hasVariance = Boolean(log.varianceReason)
            const dateStr = new Date(log.date).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
            const meta = [
              log.quantityClaimed != null && `Qty ${log.quantityClaimed}`,
              log.manHoursLogged != null && `${log.manHoursLogged}h`,
            ].filter(Boolean).join(' · ')
            return (
              <li
                key={log.id}
                className="rounded-lg border transition-[background-color,box-shadow,border-color] duration-150"
                style={{
                  backgroundColor: 'var(--figma-bg-default)',
                  borderColor: 'var(--figma-card-stroke)',
                  borderLeftWidth: hasVariance ? 2 : 1,
                  borderLeftColor: hasVariance ? VARIANCE_ACCENT : 'var(--figma-card-stroke)',
                  boxShadow: 'var(--figma-card-shadow)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--figma-bg-depth1)'
                  e.currentTarget.style.boxShadow = 'var(--figma-card-shadow-hover)'
                  e.currentTarget.style.borderTopColor = 'var(--figma-card-stroke-hover)'
                  e.currentTarget.style.borderRightColor = 'var(--figma-card-stroke-hover)'
                  e.currentTarget.style.borderBottomColor = 'var(--figma-card-stroke-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--figma-bg-default)'
                  e.currentTarget.style.boxShadow = 'var(--figma-card-shadow)'
                  e.currentTarget.style.borderTopColor = 'var(--figma-card-stroke)'
                  e.currentTarget.style.borderRightColor = 'var(--figma-card-stroke)'
                  e.currentTarget.style.borderBottomColor = 'var(--figma-card-stroke)'
                }}
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 px-2.5 py-2">
                  <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
                    <time
                      dateTime={log.date}
                      className="text-[10px] tabular-nums"
                      style={{ color: 'var(--figma-text-tertiary)' }}
                    >
                      {dateStr}
                    </time>
                    {meta && (
                      <>
                        <span className="text-[10px]" style={{ color: 'var(--figma-text-tertiary)' }} aria-hidden>·</span>
                        <span className="text-[10px] tabular-nums" style={{ color: 'var(--figma-text-tertiary)' }}>
                          {meta}
                        </span>
                      </>
                    )}
                    {log.varianceReason && (
                      <>
                        <span className="text-[10px]" style={{ color: 'var(--figma-text-tertiary)' }} aria-hidden>·</span>
                        <span
                          className="text-[10px] font-medium"
                          style={{ color: 'var(--figma-chart-exception)' }}
                        >
                          {log.varianceReason}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="line-clamp-2 text-[11px] leading-snug" style={{ color: 'var(--figma-text-primary)' }}>
                    {log.fieldNoteSnippet}
                  </p>
                  {log.photoUrls?.length ? (
                    <span
                      className="inline-flex w-fit items-center gap-1 text-[10px]"
                      style={{ color: 'var(--figma-text-secondary)' }}
                    >
                      <Image className="h-3 w-3 opacity-70" />
                      {log.photoUrls.length}
                    </span>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </article>
  )
}
