import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { BurnCurveData } from '../../../hooks/useHubData'

interface BurnCurveCardProps {
  data: BurnCurveData
}

export default function BurnCurveCard({ data }: BurnCurveCardProps) {
  const signal = (
    <div className="flex flex-col gap-3">
      {data.delayFlag && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium"
          style={{ backgroundColor: 'var(--figma-error-light)', color: 'var(--figma-error)' }}
        >
          <span>Delay risk:</span> {data.insight}
        </div>
      )}
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.points} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--figma-bg-outline)" />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: 'var(--figma-text-secondary)' }} />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: 'var(--figma-text-secondary)' }}
              tickFormatter={(v: number | undefined) => `${v ?? 0}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--figma-bg-default)',
                border: '1px solid var(--figma-bg-outline)',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value: number | undefined) => [`${(value ?? 0).toFixed(1)}%`, '']}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="hoursSpentPct" name="% Hours Spent" stroke="var(--figma-chart-1)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="workCompletePct" name="% Work Complete" stroke="var(--figma-chart-2)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="benchmarkPct" name="Benchmark" stroke="var(--figma-chart-3)" strokeWidth={2} strokeDasharray="6 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  const context = (
    <span>Compares % hours burned vs % work completed vs benchmark. A growing gap between hours spent and work complete signals productivity drag.</span>
  )

  return (
    <ActionableInsightCard
      title="Burn Curve"
      signal={signal}
      context={context}
      kickoff={{ label: 'Create Delay Notice', onClick: () => {} }}
      kickoffPriority="p1"
    />
  )
}
