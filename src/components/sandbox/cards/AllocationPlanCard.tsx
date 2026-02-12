import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { AllocationPlanPoint } from '../../../hooks/useHubData'

interface AllocationPlanCardProps {
  data: AllocationPlanPoint[]
}

export default function AllocationPlanCard({ data }: AllocationPlanCardProps) {
  const latest = data[data.length - 1]
  const gap = latest ? latest.requested - latest.assigned : 0

  const signal = (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-3">
        <span className="text-[12px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>
          Resource gap:
        </span>
        <span
          className="text-lg font-bold tabular-nums"
          style={{ color: gap > 10 ? 'var(--figma-chart-exception)' : 'var(--figma-text-primary)' }}
        >
          {gap > 0 ? `−${gap}` : gap} headcount
        </span>
      </div>
      <div className="h-[220px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="var(--figma-text-secondary)" />
            <YAxis tick={{ fontSize: 10 }} stroke="var(--figma-text-secondary)" domain={[0, 'auto']} />
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
            <Legend wrapperStyle={{ fontSize: 10 }} iconSize={8} />
            <Bar dataKey="assigned" name="Assigned" stackId="a" fill="#93c5fd" radius={[0, 0, 0, 0]} maxBarSize={20} />
            <Bar dataKey="allocated" name="Allocated" stackId="b" fill="#2563eb" radius={[0, 0, 0, 0]} maxBarSize={20} />
            <Bar dataKey="requested" name="Requested" stackId="c" fill="#16a34a" radius={[2, 2, 0, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  const context = (
    <span>
      Assigned vs. Allocated vs. Requested resources by month. Highlights staffing gaps before they impact schedule.
    </span>
  )

  return (
    <ActionableInsightCard
      title="Allocation Plan"
      signal={signal}
      context={context}
      kickoff={{ label: 'Request Resources', onClick: () => {} }}
      kickoffPriority="p2"
    />
  )
}
