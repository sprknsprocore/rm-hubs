import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { LaborBurnCurvePayload } from '../../../types/lem'

interface ThreeLineBurnCurveProps {
  data: LaborBurnCurvePayload
}

export default function ThreeLineBurnCurve({ data }: ThreeLineBurnCurveProps) {
  const chartData = data.periodIds.map((id, i) => ({
    period: id,
    hoursSpentPct: data.hoursSpentPct[i] ?? 0,
    workCompletePct: data.workCompletePct[i] ?? 0,
    benchmarkPct: data.benchmarkPct[i] ?? 0,
  }))

  const lastIdx = data.periodIds.length - 1
  const lastWork = lastIdx >= 0 ? (data.workCompletePct[lastIdx] ?? 0) : 0
  const lastHours = lastIdx >= 0 ? (data.hoursSpentPct[lastIdx] ?? 0) : 0
  const delayBadgeLabel =
    lastIdx >= 0
      ? `Delay risk: ${lastWork}% work complete < ${lastHours}% hours spent`
      : 'Delay risk: % work complete < % hours spent'

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      {data.delayFlag && (
        <div
          className="mb-2 flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium"
          style={{
            backgroundColor: 'var(--figma-chart-exception-light)',
            color: 'var(--figma-chart-exception)',
            alignSelf: 'flex-start',
          }}
        >
          {delayBadgeLabel}
        </div>
      )}
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--figma-bg-outline)" />
            <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="var(--figma-text-secondary)" />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11 }}
              stroke="var(--figma-text-secondary)"
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              wrapperStyle={{ zIndex: 99999 }}
              contentStyle={{ fontSize: 11, padding: '6px 10px' }}
              labelStyle={{ fontSize: 10 }}
              itemStyle={{ fontSize: 10 }}
              formatter={(value: number | undefined) => (value != null ? `${value}%` : '')}
              labelFormatter={(label) => String(label)}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="hoursSpentPct"
              name="% Hours Spent"
              stroke="var(--figma-chart-1)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="workCompletePct"
              name="% Work Complete"
              stroke="var(--figma-chart-2)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="benchmarkPct"
              name="Benchmark"
              stroke="var(--figma-chart-3)"
              strokeWidth={2}
              strokeDasharray="4 2"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
