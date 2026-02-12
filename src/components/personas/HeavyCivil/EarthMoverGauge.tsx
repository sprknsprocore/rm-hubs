import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  Tooltip,
} from 'recharts'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { EarthMoverMetrics } from '../../../types/lem'

interface EarthMoverGaugeProps {
  data: EarthMoverMetrics
}

function formatYd3(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
  return String(value)
}

export default function EarthMoverGauge({ data }: EarthMoverGaugeProps) {
  const pct = Math.round((data.actualCubicYards / data.budgetedCubicYards) * 100)
  const remaining = data.budgetedCubicYards - data.actualCubicYards
  const chartData = [
    { name: 'Actual', value: data.actualCubicYards, fill: 'var(--figma-chart-1)' },
    { name: 'Remaining to budget', value: remaining, fill: 'var(--figma-chart-muted)' },
  ]

  const signal = (
    <div className="flex min-h-[240px] flex-col">
      <div className="min-h-[200px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
          >
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: 'var(--figma-text-secondary)', fontFamily: 'inherit' }}
              tickFormatter={formatYd3}
              domain={[0, data.budgetedCubicYards * 1.05]}
              axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={108}
              tick={{ fontSize: 11, fill: 'var(--figma-text-secondary)', fontFamily: 'inherit' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              wrapperStyle={{ zIndex: 99999 }}
              formatter={(value: number | undefined) => [value != null ? `${value.toLocaleString()} yd³` : '', '']}
              contentStyle={{
                fontSize: 11,
                padding: '6px 10px',
                backgroundColor: 'var(--figma-bg-default)',
                border: '1px solid var(--figma-bg-outline)',
                borderRadius: 'var(--figma-radius-card)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
              labelStyle={{ fontSize: 10 }}
              itemStyle={{ fontSize: 10 }}
              labelFormatter={(label) => label}
              cursor={{ fill: 'rgba(0,0,0,0.03)' }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} name="" maxBarSize={28}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
            <ReferenceLine
              x={data.budgetedCubicYards}
              stroke="var(--figma-text-secondary)"
              strokeDasharray="4 4"
              strokeOpacity={0.8}
              label={{
                value: 'Budget target',
                position: 'insideTopRight',
                fontSize: 10,
                fill: 'var(--figma-text-secondary)',
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 shrink-0 text-center text-[11px] leading-relaxed" style={{ color: 'var(--figma-text-secondary)', opacity: 0.9 }}>
        yd³ moved · dashed line = budget target
      </p>
    </div>
  )

  const context = (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="tabular-nums text-lg font-semibold tracking-tight" style={{ color: 'var(--figma-text-primary)' }}>
          {data.actualCubicYards.toLocaleString()}
          <span className="ml-1 text-sm font-medium" style={{ color: 'var(--figma-text-secondary)' }}>/ {data.budgetedCubicYards.toLocaleString()} yd³</span>
        </span>
        <span
          className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums"
          style={{ backgroundColor: 'var(--figma-primary-selected)', color: 'var(--figma-primary-dark)' }}
        >
          {pct}%
        </span>
      </div>
      {data.industryAvgUtilizationPct != null && (
        <p className="text-[12px]" style={{ color: 'var(--figma-text-secondary)' }}>
          Industry avg: {data.industryAvgUtilizationPct}% utilization
        </p>
      )}
      {data.weatherRisk && (
        <p className="text-[12px]" style={{ color: 'var(--figma-text-secondary)' }}>{data.weatherRisk}</p>
      )}
    </div>
  )

  return (
    <ActionableInsightCard
      title="Earth Mover Productivity"
      signal={signal}
      context={context}
      kickoff={{ label: 'Adjust crew', onClick: () => window.history.pushState({}, '', '/workflow/adjust-crew') }}
      kickoffPriority="p2"
    />
  )
}
