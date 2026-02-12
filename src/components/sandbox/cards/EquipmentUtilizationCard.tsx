import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { EquipmentUtilizationData } from '../../../hooks/useHubData'

interface EquipmentUtilizationCardProps {
  data: EquipmentUtilizationData
  onExpand?: (insightId: string) => void
}

export default function EquipmentUtilizationCard({ data, onExpand }: EquipmentUtilizationCardProps) {
  const { engineOnHours, onSiteHours, utilizationPct } = data
  const idlePct = 100 - utilizationPct

  const chartData = [
    { name: 'Engine On', value: utilizationPct },
    { name: 'Idle (On-Site)', value: idlePct },
  ]

  const isLow = utilizationPct < 70

  const signal = (
    <div className="flex flex-1 flex-col items-center justify-center gap-3">
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
              <Cell fill={isLow ? 'var(--figma-chart-exception)' : 'var(--figma-chart-2)'} />
              <Cell fill="var(--figma-bg-depth2)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-bold tabular-nums tracking-tight"
            style={{ color: isLow ? 'var(--figma-chart-exception)' : 'var(--figma-chart-2)' }}
          >
            {utilizationPct}%
          </span>
          <span className="text-[11px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>
            Utilization
          </span>
        </div>
      </div>
      <div className="flex gap-4 text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: isLow ? 'var(--figma-chart-exception)' : 'var(--figma-chart-2)' }} />
          Engine On: {engineOnHours.toLocaleString()} hrs
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--figma-bg-depth2)' }} />
          On-Site: {onSiteHours.toLocaleString()} hrs
        </span>
      </div>
    </div>
  )

  const context = (
    <span>
      Engine-On vs. On-Site time.{' '}
      {isLow
        ? 'Low utilization — wasted rental spend where equipment is parked but not productive.'
        : 'Fleet utilization within target range.'}
    </span>
  )

  return (
    <ActionableInsightCard
      title="Equipment Utilization"
      signal={signal}
      context={context}
      kickoff={{ label: 'Review Fleet', onClick: () => onExpand?.('equipment-utilization') }}
      kickoffPriority="p2"
      expandSignal
      onInsightExpand={onExpand ? () => onExpand('equipment-utilization') : undefined}
    />
  )
}
