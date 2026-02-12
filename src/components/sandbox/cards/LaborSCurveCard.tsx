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
import ActionableInsightCard from '../../cards/ActionableInsightCard'

interface DataPoint {
  weekId: string
  value: number
}

interface LaborSCurveCardProps {
  data: {
    planned: DataPoint[]
    actual: DataPoint[]
    forecast: DataPoint[]
  }
}

export default function LaborSCurveCard({ data }: LaborSCurveCardProps) {
  const combined = data.planned.map((p, i) => ({
    week: p.weekId,
    planned: p.value,
    actual: data.actual[i]?.value ?? null,
    forecast: data.forecast[i]?.value || null,
  }))

  const signal = (
    <div className="h-[220px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={combined} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--figma-bg-outline)" />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--figma-text-secondary)" />
          <YAxis
            tick={{ fontSize: 10 }}
            stroke="var(--figma-text-secondary)"
            tickFormatter={(v: number) => `${v}`}
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
          />
          <Legend wrapperStyle={{ fontSize: 10 }} iconSize={8} iconType="line" />
          <Line
            type="monotone"
            dataKey="planned"
            name="Planned"
            stroke="#334155"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual"
            stroke="#0369a1"
            strokeWidth={2.5}
            dot={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            name="Forecast"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )

  const context = (
    <span>
      Planned vs. Actual vs. Forecast labor hours. Identifies sandbagging or productivity lag early in the project lifecycle.
    </span>
  )

  return (
    <ActionableInsightCard
      title="Labor S-Curve"
      signal={signal}
      context={context}
      kickoff={{ label: 'Notify GC', onClick: () => {} }}
      kickoffPriority="p2"
    />
  )
}
