import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { PerformanceFactorData } from '../../../hooks/useHubData'

interface PerformanceGaugeProps {
  data: PerformanceFactorData
}

export default function PerformanceGauge({ data }: PerformanceGaugeProps) {
  const { pf, budgetedHours, actualHours, percentComplete } = data
  const pfDisplay = pf.toFixed(2)
  const pfPct = Math.min(pf * 100, 100)
  const remainder = Math.max(100 - pfPct, 0)
  const isHealthy = pf >= 1.0

  const chartData = [
    { name: 'PF', value: pfPct },
    { name: 'Remainder', value: remainder },
  ]

  const signal = (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[160px] w-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={isHealthy ? 'var(--figma-success)' : 'var(--figma-chart-exception)'} />
              <Cell fill="var(--figma-bg-depth2)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-bold tabular-nums tracking-tight"
            style={{ color: isHealthy ? 'var(--figma-success)' : 'var(--figma-chart-exception)' }}
          >
            {pfDisplay}
          </span>
          <span className="text-[11px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>
            PF
          </span>
        </div>
      </div>
      <div className="flex gap-4 text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
        <span>Earned: {Math.round(budgetedHours * percentComplete).toLocaleString()} hrs</span>
        <span>Actual: {actualHours.toLocaleString()} hrs</span>
      </div>
    </div>
  )

  const context = (
    <span>
      PF = (Budgeted Hrs × %Comp) / Actual Hrs.{' '}
      {isHealthy ? 'Production is ahead of the curve.' : 'Installing slower than bid — review crew sizing.'}
    </span>
  )

  return (
    <ActionableInsightCard
      title="Performance Factor (CPI)"
      signal={signal}
      context={context}
      kickoff={{ label: 'Reconcile', onClick: () => {} }}
      kickoffPriority="p1"
    />
  )
}
