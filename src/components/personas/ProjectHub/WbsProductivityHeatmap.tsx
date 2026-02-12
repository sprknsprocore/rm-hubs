import type { WbsCode } from '../../../types/lem'

interface WbsProductivityHeatmapProps {
  wbsCodes: WbsCode[]
  onSelectCode: (rowId: string) => void
}

function getPfTier(pf: number): 'on_track' | 'at_risk' | 'exception' {
  if (pf >= 1) return 'on_track'
  if (pf >= 0.9) return 'at_risk'
  return 'exception'
}

function parseCostCodeLabel(full: string): { code: string; name: string } {
  const i = full.indexOf(' - ')
  if (i === -1) return { code: full, name: '' }
  return { code: full.slice(0, i).trim(), name: full.slice(i + 3).trim() }
}

/* Same palette as charts: slate for on-track/at-risk, one warm accent for exception */
const tierStyles = {
  on_track: {
    dot: 'var(--figma-success)',
    pfColor: 'var(--figma-success)',
    borderLeft: 'rgba(21, 128, 61, 0.35)',
  },
  at_risk: {
    dot: 'var(--figma-chart-2)',
    pfColor: 'var(--figma-chart-2)',
    borderLeft: 'rgba(71, 85, 105, 0.35)',
  },
  exception: {
    dot: 'var(--figma-chart-exception)',
    pfColor: 'var(--figma-chart-exception)',
    borderLeft: 'rgba(180, 83, 9, 0.35)',
  },
} as const

export default function WbsProductivityHeatmap({ wbsCodes, onSelectCode }: WbsProductivityHeatmapProps) {
  return (
    <article className="figma-card-base flex min-h-0 flex-col overflow-hidden rounded-xl">
      <div
        className="figma-card-border flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-4 py-3 md:px-5 md:py-3.5"
      >
        <div>
          <h2 className="text-[13px] font-semibold tracking-[-0.02em]" style={{ color: 'var(--figma-text-primary)' }}>
            WBS Productivity Heatmap
          </h2>
          <p className="mt-0.5 text-[11px]" style={{ color: 'var(--figma-text-tertiary)' }} title="Performance Factor">
            PF = (Budgeted × % Complete) ÷ Actual
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tierStyles.exception.dot }} />
            &lt; 0.9
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tierStyles.at_risk.dot }} />
            0.9–1
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tierStyles.on_track.dot }} />
            ≥ 1
          </span>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4">
        <div
          className="grid gap-2.5"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          }}
        >
          {wbsCodes.map((code) => {
            const tier = getPfTier(code.performanceFactor)
            const styles = tierStyles[tier]
            const { code: codePart, name } = parseCostCodeLabel(code.costCodeOrWBS)
            return (
              <button
                key={code.id}
                type="button"
                onClick={() => onSelectCode(code.id)}
                className="group relative flex flex-col rounded-lg border text-left transition-[box-shadow,border-color,background-color] duration-150 focus:outline-none focus:ring-2 focus:ring-black/8 focus:ring-offset-2 focus:ring-offset-[var(--figma-bg-default)]"
                style={{
                  backgroundColor: 'var(--figma-bg-default)',
                  borderColor: 'var(--figma-card-stroke)',
                  borderLeftWidth: 2,
                  borderLeftColor: styles.borderLeft,
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
                <div className="flex min-h-0 flex-1 flex-col p-2.5 pl-3">
                  {name ? (
                    <>
                      <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--figma-text-tertiary)' }}>
                        {codePart}
                      </div>
                      <div className="mt-0.5 line-clamp-2 text-[12px] font-medium leading-snug" style={{ color: 'var(--figma-text-primary)' }}>
                        {name}
                      </div>
                    </>
                  ) : (
                    <div className="truncate text-[12px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
                      {code.costCodeOrWBS}
                    </div>
                  )}
                  <div className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full self-center" style={{ backgroundColor: styles.dot }} aria-hidden />
                    <span
                      className="tabular-nums text-[13px] font-semibold tracking-tight"
                      style={{ color: styles.pfColor }}
                    >
                      {code.performanceFactor.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-medium" style={{ color: 'var(--figma-text-tertiary)' }}>
                      PF
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] tabular-nums" style={{ color: 'var(--figma-text-secondary)' }}>
                    {code.earnedHours.toLocaleString()} earned / {code.actualHours.toLocaleString()} actual
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </article>
  )
}
