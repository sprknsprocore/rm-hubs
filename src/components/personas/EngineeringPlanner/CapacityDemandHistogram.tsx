import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { FutureCapacityPoint } from '../../../types/lem'

export interface CapacityDemandBar {
  name: string
  demand: number
}

interface CapacityDemandHistogramProps {
  chartData: CapacityDemandBar[]
  capacityLine: number
  /** Optional benchmark line (e.g. industry or target capacity). */
  capacityBenchmark?: number
  /** When set and "Future Hiring Plan" is on, show stepped capacity line(s). */
  futureCapacityByPeriod?: FutureCapacityPoint[]
}

export default function CapacityDemandHistogram({
  chartData,
  capacityLine,
  capacityBenchmark,
  futureCapacityByPeriod,
}: CapacityDemandHistogramProps) {
  const [showFutureHiring, setShowFutureHiring] = useState(false)
  const futureCapacity = showFutureHiring && futureCapacityByPeriod?.length
    ? futureCapacityByPeriod[futureCapacityByPeriod.length - 1]?.capacity
    : undefined
  const futureLabel = showFutureHiring && futureCapacityByPeriod?.length
    ? `Future (${futureCapacityByPeriod[futureCapacityByPeriod.length - 1]?.period ?? 'plan'})`
    : undefined

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="mb-1 flex items-center justify-between gap-2">
        <label className="flex cursor-pointer items-center gap-2 text-xs" style={{ color: 'var(--figma-text-secondary)' }}>
          <input
            type="checkbox"
            checked={showFutureHiring}
            onChange={(e) => setShowFutureHiring(e.target.checked)}
            className="rounded"
            style={{ accentColor: 'var(--figma-primary-main)' }}
          />
          Future Hiring Plan
        </label>
      </div>
      <div className="min-h-[220px] min-w-0 flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--figma-text-secondary)" />
          <YAxis tick={{ fontSize: 11 }} stroke="var(--figma-text-secondary)" />
          <Bar dataKey="demand" name="Demand" fill="var(--figma-chart-1)" radius={[4, 4, 0, 0]} />
          <ReferenceLine y={capacityLine} stroke="var(--figma-chart-3)" strokeWidth={2} strokeDasharray="4 2" label={{ value: 'Capacity', position: 'right' }} />
          {capacityBenchmark != null && (
            <ReferenceLine y={capacityBenchmark} stroke="var(--figma-text-secondary)" strokeWidth={1} strokeDasharray="2 2" label={{ value: 'Benchmark', position: 'right' }} />
          )}
          {futureCapacity != null && futureLabel && (
            <ReferenceLine y={futureCapacity} stroke="var(--figma-success)" strokeWidth={2} strokeDasharray="3 3" label={{ value: futureLabel, position: 'right' }} />
          )}
        </BarChart>
      </ResponsiveContainer>
      </div>
      <p className="mt-1 shrink-0 text-center text-xs" style={{ color: 'var(--figma-text-secondary)' }}>
        Bars = demand · Line = capacity{futureCapacity != null ? ` · Green dashed = ${futureLabel}` : ''}
      </p>
    </div>
  )
}
