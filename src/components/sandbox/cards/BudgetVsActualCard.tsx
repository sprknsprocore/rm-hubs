import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { BudgetVsActualPoint } from '../../../hooks/useHubData'

interface BudgetVsActualCardProps {
  data: BudgetVsActualPoint[]
  onExpand?: (insightId: string) => void
}

function formatK(value: number): string {
  return `$${(value / 1000).toFixed(0)}k`
}

export default function BudgetVsActualCard({ data, onExpand }: BudgetVsActualCardProps) {
  const latest = data[data.length - 1]
  const ratio = latest ? (latest.actual / latest.budgeted).toFixed(2) : '—'
  const overBudget = latest ? latest.actual > latest.budgeted : false

  const signal = (
    <div className="h-[180px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--figma-bg-outline)" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--figma-text-secondary)" />
          <YAxis tick={{ fontSize: 10 }} stroke="var(--figma-text-secondary)" tickFormatter={formatK} />
          <Tooltip
            wrapperStyle={{ zIndex: 99999 }}
            contentStyle={{
              fontSize: 11,
              backgroundColor: 'var(--figma-bg-default)',
              border: '1px solid var(--figma-bg-outline)',
              borderRadius: 'var(--figma-radius-card)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
            formatter={(value: number | undefined) => [`$${(value ?? 0).toLocaleString()}`, '']}
          />
          <Legend wrapperStyle={{ fontSize: 10 }} iconSize={8} iconType="line" />
          <Area
            type="monotone"
            dataKey="budgeted"
            name="Budgeted"
            stroke="var(--figma-chart-1)"
            fill="var(--figma-chart-1)"
            fillOpacity={0.08}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="actual"
            name="Actual"
            stroke={overBudget ? 'var(--figma-chart-exception)' : 'var(--figma-chart-2)'}
            fill={overBudget ? 'var(--figma-chart-exception)' : 'var(--figma-chart-2)'}
            fillOpacity={0.08}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )

  const context = (
    <span>
      BvA ratio: <strong>{ratio}</strong>.{' '}
      {overBudget ? 'Actual cost is outpacing budget — financial burn is elevated.' : 'Cost is tracking within budget corridor.'}
    </span>
  )

  return (
    <ActionableInsightCard
      title="Budget vs. Actual"
      signal={signal}
      context={context}
      kickoff={{ label: 'Review Forecast', onClick: () => onExpand?.('budget-vs-actual') }}
      kickoffPriority="p2"
      onInsightExpand={onExpand ? () => onExpand('budget-vs-actual') : undefined}
    />
  )
}
