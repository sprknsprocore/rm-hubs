import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { ProjectedMarginData } from '../../../hooks/useHubData'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

interface ProjectedMarginCardProps {
  data: ProjectedMarginData
  onExpand?: (insightId: string) => void
}

export default function ProjectedMarginCard({ data, onExpand }: ProjectedMarginCardProps) {
  const TrendIcon = data.trend === 'down' ? TrendingDown : data.trend === 'up' ? TrendingUp : Minus
  const trendColor =
    data.trend === 'down'
      ? 'var(--figma-chart-exception)'
      : data.trend === 'up'
        ? 'var(--figma-success)'
        : 'var(--figma-text-secondary)'

  const sparkData = data.sparkline.map((v, i) => ({ idx: i, margin: v }))

  const signal = (
    <div className="flex flex-1 flex-col items-center gap-3">
      <div className="flex shrink-0 items-baseline gap-4">
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
      <div className="min-h-[60px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="idx"
              tick={{ fontSize: 10, fill: 'var(--figma-text-tertiary)' }}
              stroke="var(--figma-bg-outline)"
              tickFormatter={(i: number) => `W${i + 1}`}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--figma-text-tertiary)' }}
              stroke="var(--figma-bg-outline)"
              tickFormatter={(v: number) => `${v}%`}
              domain={['dataMin - 1', 'dataMax + 1']}
              width={40}
            />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                backgroundColor: 'var(--figma-bg-default)',
                border: '1px solid var(--figma-bg-outline)',
                borderRadius: 8,
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Margin']}
              labelFormatter={(i: number) => `Week ${i + 1}`}
            />
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
      kickoff={{ label: 'Adjust Estimate', onClick: () => onExpand?.('projected-margin') }}
      kickoffPriority="p2"
      expandSignal
      onInsightExpand={onExpand ? () => onExpand('projected-margin') : undefined}
    />
  )
}
