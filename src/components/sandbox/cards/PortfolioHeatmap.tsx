import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { PortfolioProject } from '../../../hooks/useHubData'

interface PortfolioHeatmapProps {
  data: PortfolioProject[]
  onExpand?: (insightId: string) => void
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  green: {
    bg: 'var(--figma-success-light)',
    text: 'var(--figma-success)',
    dot: 'var(--figma-success)',
  },
  yellow: {
    bg: 'var(--figma-chart-exception-light)',
    text: 'var(--figma-chart-exception)',
    dot: 'var(--figma-chart-exception)',
  },
  red: {
    bg: 'var(--figma-error-light)',
    text: 'var(--figma-error)',
    dot: 'var(--figma-error)',
  },
}

export default function PortfolioHeatmap({ data, onExpand }: PortfolioHeatmapProps) {
  const signal = (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {data.map((project) => {
        const style = STATUS_STYLES[project.status] ?? STATUS_STYLES.green
        return (
          <div
            key={project.id}
            className="flex flex-col gap-1.5 rounded-lg border px-3 py-2.5 transition-colors"
            style={{
              backgroundColor: style.bg,
              borderColor: 'transparent',
            }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: style.dot }}
              />
              <span className="truncate text-[12px] font-semibold" style={{ color: style.text }}>
                {project.name}
              </span>
            </div>
            <span className="text-lg font-bold tabular-nums" style={{ color: style.text }}>
              {project.cpi.toFixed(2)}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: style.text }}>
              CPI
            </span>
          </div>
        )
      })}
    </div>
  )

  const redCount = data.filter((p) => p.status === 'red').length
  const context = (
    <span>
      {redCount > 0
        ? `${redCount} project${redCount > 1 ? 's' : ''} below CPI threshold — executive intervention needed.`
        : 'All projects within acceptable CPI range.'}
    </span>
  )

  return (
    <ActionableInsightCard
      title="Portfolio Health Heatmap"
      signal={signal}
      context={context}
      kickoff={{ label: 'Drill into Project', onClick: () => onExpand?.('portfolio-heatmap') }}
      kickoffPriority="p2"
      onInsightExpand={onExpand ? () => onExpand('portfolio-heatmap') : undefined}
    />
  )
}
