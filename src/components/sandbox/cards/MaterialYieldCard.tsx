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
import type { MaterialYieldItem } from '../../../hooks/useHubData'

interface MaterialYieldCardProps {
  data: MaterialYieldItem[]
}

export default function MaterialYieldCard({ data }: MaterialYieldCardProps) {
  const chartData = data.map((d) => ({
    costCode: d.costCode,
    'Design Take-off': d.designTakeoff,
    'Actual Install': d.actualInstall,
  }))

  const signal = (
    <div className="h-[200px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="costCode"
            tick={{ fontSize: 10 }}
            stroke="var(--figma-text-secondary)"
            interval={0}
            angle={-15}
            textAnchor="end"
            height={40}
          />
          <YAxis tick={{ fontSize: 10 }} stroke="var(--figma-text-secondary)" />
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
          <Bar dataKey="Design Take-off" fill="var(--figma-chart-1)" radius={[2, 2, 0, 0]} maxBarSize={24} />
          <Bar dataKey="Actual Install" fill="var(--figma-chart-exception)" radius={[2, 2, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )

  const overages = data.filter((d) => d.actualInstall > d.designTakeoff)
  const context = (
    <span>
      Design Take-off vs. Actual Installation.{' '}
      {overages.length > 0
        ? `${overages.length} material${overages.length > 1 ? 's' : ''} exceeding design quantity — predicts potential shortages.`
        : 'All materials tracking within design estimates.'}
    </span>
  )

  return (
    <ActionableInsightCard
      title="Material Yield"
      signal={signal}
      context={context}
      kickoff={{ label: 'Adjust PO', onClick: () => {} }}
      kickoffPriority="p2"
    />
  )
}
