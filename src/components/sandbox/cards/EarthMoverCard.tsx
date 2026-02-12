import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Cell, Tooltip } from 'recharts'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { EarthMoverData } from '../../../hooks/useHubData'

interface EarthMoverCardProps {
  data: EarthMoverData
}

export default function EarthMoverCard({ data }: EarthMoverCardProps) {
  const pct = Math.round((data.actualCubicYards / data.budgetedCubicYards) * 100)
  const remaining = Math.max(data.budgetedCubicYards - data.actualCubicYards, 0)
  const chartData = [
    { name: 'Actual', value: data.actualCubicYards },
    { name: 'Remaining', value: remaining },
  ]

  const signal = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--figma-text-primary)' }}>
          {data.actualCubicYards.toLocaleString()} yd³
        </span>
        <span
          className="rounded px-2 py-0.5 text-[11px] font-semibold"
          style={{
            backgroundColor: pct >= 100 ? 'var(--figma-success-light, rgba(34,197,94,0.12))' : 'var(--figma-error-light)',
            color: pct >= 100 ? 'var(--figma-success)' : 'var(--figma-error)',
          }}
        >
          {pct}% of budget
        </span>
      </div>

      <div className="h-[80px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--figma-text-secondary)' }} width={80} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--figma-bg-default)', border: '1px solid var(--figma-bg-outline)', borderRadius: 8, fontSize: 12 }}
              formatter={(value: number | undefined) => [`${(value ?? 0).toLocaleString()} yd³`, '']}
            />
            <ReferenceLine x={data.budgetedCubicYards} stroke="var(--figma-text-disabled)" strokeDasharray="4 4" label={{ value: 'Budget', fontSize: 10, fill: 'var(--figma-text-secondary)' }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
              <Cell fill="var(--figma-chart-1)" />
              <Cell fill="var(--figma-chart-muted, var(--figma-bg-depth2))" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-4 text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
        <span>Industry avg: {data.industryAvgUtilizationPct}%</span>
        {data.weatherRisk && <span style={{ color: 'var(--figma-error)' }}>Weather risk active</span>}
      </div>
    </div>
  )

  const context = (
    <span>Actual cubic yards moved vs. budgeted target. Falling behind budget means haul crews may need reinforcement or cycle time optimization.</span>
  )

  return (
    <ActionableInsightCard
      title="Earth Mover Productivity"
      signal={signal}
      context={context}
      kickoff={{ label: 'Adjust Crew', onClick: () => {} }}
      kickoffPriority="p2"
    />
  )
}
