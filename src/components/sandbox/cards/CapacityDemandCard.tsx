import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { CapacityDemandData } from '../../../hooks/useHubData'

interface CapacityDemandCardProps {
  data: CapacityDemandData
  onExpand?: (insightId: string) => void
}

export default function CapacityDemandCard({ data, onExpand }: CapacityDemandCardProps) {
  const overCapacity = data.bars.some((b) => b.demand > data.capacityLine)

  const signal = (
    <div className="flex flex-1 flex-col gap-3">
      {overCapacity && (
        <div
          className="rounded-lg px-3 py-2 text-[12px] font-medium"
          style={{ backgroundColor: 'var(--figma-error-light)', color: 'var(--figma-error)' }}
        >
          Demand exceeds capacity in one or more periods
        </div>
      )}
      <div className="min-h-[180px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.bars} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--figma-bg-outline)" />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: 'var(--figma-text-secondary)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--figma-text-secondary)' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--figma-bg-default)',
                border: '1px solid var(--figma-bg-outline)',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value: number | undefined) => [`${value ?? 0} FTE`, '']}
            />
            <ReferenceLine
              y={data.capacityLine}
              stroke="var(--figma-chart-3)"
              strokeWidth={2}
              label={{ value: `Capacity (${data.capacityLine})`, fontSize: 10, fill: 'var(--figma-chart-3)', position: 'right' }}
            />
            <ReferenceLine
              y={data.capacityBenchmark}
              stroke="var(--figma-text-secondary)"
              strokeDasharray="4 4"
              label={{ value: `Benchmark (${data.capacityBenchmark})`, fontSize: 10, fill: 'var(--figma-text-secondary)', position: 'right' }}
            />
            <Bar dataKey="demand" name="Demand (FTE)" fill="var(--figma-chart-1)" radius={[4, 4, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--figma-chart-3)' }} />
          Current Capacity
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--figma-text-secondary)' }} />
          Benchmark
        </span>
      </div>
    </div>
  )

  const context = (
    <span>Forecasted FTE demand by period vs. current capacity. Bars above the capacity line signal the need to hire or reallocate before the gap becomes a bottleneck.</span>
  )

  return (
    <ActionableInsightCard
      title="Capacity vs. Demand"
      signal={signal}
      context={context}
      kickoff={{ label: 'View Hiring Plan', onClick: () => onExpand?.('capacity-demand') }}
      kickoffPriority="p2"
      expandSignal
      onInsightExpand={onExpand ? () => onExpand('capacity-demand') : undefined}
    />
  )
}
