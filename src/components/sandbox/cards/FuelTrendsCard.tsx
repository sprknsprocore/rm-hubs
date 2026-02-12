import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts'
import { Fuel } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { FuelTrendPoint } from '../../../hooks/useHubData'

interface FuelTrendsCardProps {
  data: FuelTrendPoint[]
}

export default function FuelTrendsCard({ data }: FuelTrendsCardProps) {
  const totalGallons = data.reduce((s, d) => s + d.gallons, 0)
  const totalCost = data.reduce((s, d) => s + d.cost, 0)
  const avgCostPerGal = totalCost / totalGallons

  const signal = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'var(--figma-bg-depth2)', color: 'var(--figma-text-secondary)' }}
        >
          <Fuel className="h-5 w-5" />
        </div>
        <div className="flex gap-5">
          <div>
            <p className="text-[10px]" style={{ color: 'var(--figma-text-tertiary)' }}>Total Gallons</p>
            <p className="text-[15px] font-bold tabular-nums" style={{ color: 'var(--figma-text-primary)' }}>
              {totalGallons.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px]" style={{ color: 'var(--figma-text-tertiary)' }}>Total Cost</p>
            <p className="text-[15px] font-bold tabular-nums" style={{ color: 'var(--figma-text-primary)' }}>
              ${totalCost.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px]" style={{ color: 'var(--figma-text-tertiary)' }}>Avg $/gal</p>
            <p className="text-[15px] font-bold tabular-nums" style={{ color: 'var(--figma-text-primary)' }}>
              ${avgCostPerGal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <div className="h-[160px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="var(--figma-text-secondary)" />
            <YAxis
              yAxisId="gal"
              tick={{ fontSize: 10 }}
              stroke="var(--figma-text-secondary)"
              tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
            />
            <YAxis
              yAxisId="cost"
              orientation="right"
              tick={{ fontSize: 10 }}
              stroke="var(--figma-text-secondary)"
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
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
            <Bar yAxisId="gal" dataKey="gallons" name="Gallons" fill="var(--figma-chart-1)" radius={[2, 2, 0, 0]} maxBarSize={28} />
            <Line yAxisId="cost" type="monotone" dataKey="cost" name="Cost ($)" stroke="var(--figma-chart-exception)" strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  const context = (
    <span>
      Weekly fuel consumption and cost trends across the fleet. Useful for tracking operating cost patterns and anomalies.
    </span>
  )

  return (
    <ActionableInsightCard
      title="Fuel Consumption Trends"
      signal={signal}
      context={context}
      kickoff={{ label: 'View Fleet Costs', onClick: () => {} }}
      kickoffPriority="p3"
    />
  )
}
