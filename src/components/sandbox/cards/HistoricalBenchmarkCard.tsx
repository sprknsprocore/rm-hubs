import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { HistoricalBenchmarkData } from '../../../hooks/useHubData'

interface HistoricalBenchmarkCardProps {
  data: HistoricalBenchmarkData[]
}

export default function HistoricalBenchmarkCard({ data }: HistoricalBenchmarkCardProps) {
  const signal = (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>
        Current crew production vs. company historical best
      </p>
      <div className="space-y-3">
        {data.map((item) => {
          const pct = Math.round((item.currentRate / item.companyBest) * 100)
          const isBelow = item.currentRate < item.companyBest
          return (
            <div key={item.costCode} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
                  {item.costCode}
                </span>
                <span className="text-[11px] tabular-nums" style={{ color: 'var(--figma-text-secondary)' }}>
                  {item.currentRate} / {item.companyBest} {item.unit}
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--figma-bg-depth2)' }}>
                <div
                  className="h-full rounded-full transition-[width] duration-300"
                  style={{
                    width: `${Math.min(pct, 100)}%`,
                    backgroundColor: isBelow ? 'var(--figma-chart-exception)' : 'var(--figma-success)',
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: 'var(--figma-text-tertiary)' }}>
                  {pct}% of company best
                </span>
                {/* Company best marker */}
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isBelow ? 'var(--figma-chart-exception)' : 'var(--figma-success)' }}
                >
                  {isBelow ? 'Below' : 'At/Above'} benchmark
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const context = (
    <span>
      Compares current crew production rates against the company's historical best for each cost code.
    </span>
  )

  return (
    <ActionableInsightCard
      title="Historical Production Benchmark"
      signal={signal}
      context={context}
      kickoff={{ label: 'View History', onClick: () => {} }}
      kickoffPriority="p3"
    />
  )
}
