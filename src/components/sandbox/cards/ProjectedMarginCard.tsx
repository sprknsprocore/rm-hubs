import { LineChart, Line, ResponsiveContainer } from 'recharts'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { ProjectedMarginData } from '../../../hooks/useHubData'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

interface ProjectedMarginCardProps {
  data: ProjectedMarginData
}

export default function ProjectedMarginCard({ data }: ProjectedMarginCardProps) {
  const TrendIcon = data.trend === 'down' ? TrendingDown : data.trend === 'up' ? TrendingUp : Minus
  const trendColor =
    data.trend === 'down'
      ? 'var(--figma-chart-exception)'
      : data.trend === 'up'
        ? 'var(--figma-success)'
        : 'var(--figma-text-secondary)'

  const sparkData = data.sparkline.map((v, i) => ({ idx: i, margin: v }))

  const signal = (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-baseline gap-4">
        <div className="text-center">
          <p className="text-[11px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>
            Current
          </p>
          <p
            className="text-2xl font-bold tabular-nums tracking-tight"
            style={{ color: 'var(--figma-text-primary)' }}
          >
            {data.currentMarginPct}%
          </p>
        </div>
        <TrendIcon className="h-5 w-5" style={{ color: trendColor }} />
        <div className="text-center">
          <p className="text-[11px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>
            Projected
          </p>
          <p className="text-2xl font-bold tabular-nums tracking-tight" style={{ color: trendColor }}>
            {data.projectedMarginPct}%
          </p>
        </div>
      </div>
      <div className="h-[60px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
            <Line
              type="monotone"
              dataKey="margin"
              stroke={trendColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  const context = (
    <span>
      Margin at completion projected at {data.projectedMarginPct}%.{' '}
      {data.trend === 'down' ? 'Margin compression detected — review cost drivers.' : 'Margin holding steady.'}
    </span>
  )

  return (
    <ActionableInsightCard
      title="Projected Margin at Completion"
      signal={signal}
      context={context}
      kickoff={{ label: 'Adjust Estimate', onClick: () => {} }}
      kickoffPriority="p2"
    />
  )
}
