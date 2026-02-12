import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts'
import type { MaterialUsageItem } from '../../../types/lem'

const OVERAGE_THRESHOLD_PCT = 5

interface MaterialYieldWatchProps {
  materialUsage: MaterialUsageItem[]
  /** When user wants to act on overages or view details (e.g. open report or drill into cost codes). */
  onReview?: () => void
}

interface ChartDatum {
  key: string
  name: string
  planned: number
  actual: number
  variancePct: number
  isOver: boolean
}

export default function MaterialYieldWatch({ materialUsage, onReview }: MaterialYieldWatchProps) {
  const data = useMemo((): ChartDatum[] => {
    return materialUsage.map((m) => {
      const variancePct = m.plannedQuantity > 0
        ? ((m.actualQuantity - m.plannedQuantity) / m.plannedQuantity) * 100
        : 0
      return {
        key: m.id,
        name: m.costCodeOrWBS.length > 28 ? m.costCodeOrWBS.slice(0, 25) + '…' : m.costCodeOrWBS,
        planned: m.plannedQuantity,
        actual: m.actualQuantity,
        variancePct,
        isOver: variancePct > OVERAGE_THRESHOLD_PCT,
      }
    })
  }, [materialUsage])

  const overItems = data.filter((d) => d.isOver)

  return (
    <article className="figma-card-base flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl">
      <div
        className="figma-card-border flex shrink-0 items-center justify-between border-b px-4 py-3 md:px-5 md:py-3.5"
      >
        <h2 className="text-[13px] font-semibold tracking-[-0.02em]" style={{ color: 'var(--figma-text-primary)' }}>
          Material Yield Watch
        </h2>
        {overItems.length > 0 && (
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: 'var(--figma-chart-exception-light)',
              color: 'var(--figma-chart-exception)',
            }}
          >
            {overItems.length} code{overItems.length !== 1 ? 's' : ''} &gt;{OVERAGE_THRESHOLD_PCT}% over
          </span>
        )}
      </div>
      <div className="min-h-0 flex-1 p-4" style={{ minHeight: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--figma-bg-outline)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: 'var(--figma-text-secondary)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--figma-text-secondary)' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                padding: '6px 10px',
                backgroundColor: 'var(--figma-bg-default)',
                border: '1px solid var(--figma-bg-outline)',
                borderRadius: 'var(--figma-radius-card)',
              }}
              labelStyle={{ fontSize: 10, color: 'var(--figma-text-primary)' }}
              itemStyle={{ fontSize: 10 }}
              formatter={(value: number | undefined) => [value != null ? value.toLocaleString() : '—', '']}
              labelFormatter={(label) => label}
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={() => ['Planned vs Actual', '']}
            />
            <Bar dataKey="planned" name="Planned" fill="var(--figma-chart-3)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="actual" name="Actual" radius={[2, 2, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={entry.isOver ? 'var(--figma-chart-exception)' : 'var(--figma-chart-2)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {onReview && (
        <div
          className="shrink-0 border-t px-4 py-3 md:px-5 md:py-3"
          style={{ borderColor: 'var(--figma-card-stroke)' }}
        >
          <button
            type="button"
            onClick={onReview}
            className="rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-all duration-150 active:scale-[0.98] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black/10 focus:ring-offset-2"
            style={{
              backgroundColor: overItems.length > 0 ? 'var(--figma-cta-p1-bg)' : 'var(--figma-cta-p2-bg)',
              color: overItems.length > 0 ? 'var(--figma-cta-p1-text)' : 'var(--figma-cta-p2-text)',
              border: overItems.length > 0 ? 'none' : '1px solid var(--figma-cta-p2-border)',
            }}
          >
            {overItems.length > 0 ? 'Review overages' : 'View material report'}
          </button>
        </div>
      )}
    </article>
  )
}
