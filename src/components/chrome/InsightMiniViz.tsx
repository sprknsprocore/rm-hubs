import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, ReferenceLine } from 'recharts'
import type { InsightVisualization } from '../../types/insights'

interface InsightMiniVizProps {
  visualization: InsightVisualization
}

function DonutViz({ value, label }: { value: number; label: string }) {
  const remainder = 100 - value
  const data = [
    { name: 'Value', value },
    { name: 'Rest', value: remainder },
  ]
  const isLow = value < 50

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-[100px] w-[100px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={32}
              outerRadius={44}
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
            className="text-lg font-bold tabular-nums"
            style={{ color: isLow ? 'var(--figma-chart-exception)' : 'var(--figma-chart-2)' }}
          >
            {value}%
          </span>
        </div>
      </div>
      <span className="text-[11px] leading-snug" style={{ color: 'var(--figma-text-secondary)' }}>
        {label}
      </span>
    </div>
  )
}

function SparklineViz({ points, label }: { points: number[]; label: string }) {
  const data = points.map((v, i) => ({ idx: i, value: v }))
  const trending = points.length >= 2 ? points[points.length - 1] >= points[points.length - 2] : true
  const color = trending ? 'var(--figma-success)' : 'var(--figma-chart-exception)'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-[48px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <span className="text-[10px]" style={{ color: 'var(--figma-text-secondary)' }}>
        {label}
      </span>
    </div>
  )
}

function BarViz({ bars }: { bars: { label: string; value: number; max: number }[] }) {
  const globalMax = Math.max(...bars.map((b) => b.max), ...bars.map((b) => b.value))

  return (
    <div className="h-[80px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={bars}
          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          layout="horizontal"
        >
          <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'var(--figma-text-secondary)' }} axisLine={false} tickLine={false} />
          <Bar dataKey="value" fill="var(--figma-chart-1)" radius={[3, 3, 0, 0]} maxBarSize={24} />
          {bars[0]?.max && (
            <ReferenceLine
              y={bars[0].max}
              stroke="var(--figma-chart-3)"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              label={{ value: `Cap (${bars[0].max})`, fontSize: 9, fill: 'var(--figma-text-secondary)', position: 'right' }}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function ProgressViz({ current, target, label }: { current: number; target: number; label: string }) {
  const pct = Math.min(Math.round((current / target) * 100), 100)
  const isShort = current < target

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>
          {label}
        </span>
        <span
          className="text-[13px] font-bold tabular-nums"
          style={{ color: isShort ? 'var(--figma-chart-exception)' : 'var(--figma-success)' }}
        >
          {current} / {target}
        </span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--figma-bg-depth2)' }}>
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: isShort ? 'var(--figma-chart-exception)' : 'var(--figma-success)',
          }}
        />
      </div>
      <span className="text-right text-[10px] tabular-nums" style={{ color: 'var(--figma-text-disabled)' }}>
        {pct}%
      </span>
    </div>
  )
}

export default function InsightMiniViz({ visualization }: InsightMiniVizProps) {
  return (
    <div
      className="rounded-lg border px-3 py-3"
      style={{
        borderColor: 'var(--figma-bg-outline)',
        backgroundColor: 'var(--figma-bg-depth2)',
      }}
    >
      {visualization.type === 'donut' && <DonutViz value={visualization.value} label={visualization.label} />}
      {visualization.type === 'sparkline' && <SparklineViz points={visualization.points} label={visualization.label} />}
      {visualization.type === 'bar' && <BarViz bars={visualization.bars} />}
      {visualization.type === 'progress' && <ProgressViz current={visualization.current} target={visualization.target} label={visualization.label} />}
    </div>
  )
}
