import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart,
} from 'recharts'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { UtilizationTrendPoint } from '../../../hooks/useHubData'

interface UtilizationTrendCardProps {
  data: UtilizationTrendPoint[]
}

export default function UtilizationTrendCard({ data }: UtilizationTrendCardProps) {
  const latest = data[data.length - 1]
  const avgActual = Math.round(data.reduce((s, d) => s + d.actual, 0) / data.length)
  const underperforming = latest ? latest.actual < latest.scheduled : false

  const signal = (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-4">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[11px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>
            Avg Utilization:
          </span>
          <span
            className="text-lg font-bold tabular-nums"
            style={{ color: avgActual < 60 ? 'var(--figma-chart-exception)' : 'var(--figma-text-primary)' }}
          >
            {avgActual}%
          </span>
        </div>
        {latest && (
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>
              Current:
            </span>
            <span
              className="text-lg font-bold tabular-nums"
              style={{ color: underperforming ? 'var(--figma-chart-exception)' : 'var(--figma-success)' }}
            >
              {latest.actual}%
            </span>
          </div>
        )}
      </div>
      <div className="h-[200px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--figma-bg-outline)" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="var(--figma-text-secondary)" />
            <YAxis
              tick={{ fontSize: 10 }}
              stroke="var(--figma-text-secondary)"
              domain={[0, 100]}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              wrapperStyle={{ zIndex: 99999 }}
              contentStyle={{
                fontSize: 11,
                backgroundColor: 'var(--figma-bg-default)',
                border: '1px solid var(--figma-bg-outline)',
                borderRadius: 'var(--figma-radius-card)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
              formatter={(value: number | undefined) => [`${value ?? 0}%`, '']}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} iconSize={8} iconType="line" />
            <Area
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="#16a34a"
              fill="#16a34a"
              fillOpacity={0.08}
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#16a34a' }}
            />
            <Line
              type="monotone"
              dataKey="scheduled"
              name="Scheduled"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3, fill: '#2563eb' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  const context = (
    <span>
      Equipment utilization rate: Actual vs. Scheduled over time.{' '}
      {underperforming
        ? 'Current utilization trailing scheduled — review fleet deployment.'
        : 'Utilization tracking at or above schedule.'}
    </span>
  )

  return (
    <ActionableInsightCard
      title="Equipment Utilization Rate"
      signal={signal}
      context={context}
      kickoff={{ label: 'Optimize Fleet', onClick: () => {} }}
      kickoffPriority="p2"
    />
  )
}
