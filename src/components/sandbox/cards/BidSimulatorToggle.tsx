import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { BidOpportunity } from '../../../hooks/useHubData'

interface BidSimulatorToggleProps {
  data: {
    opportunities: BidOpportunity[]
    capacityBaselineFTE: number
  }
  onExpand?: (insightId: string) => void
}

export default function BidSimulatorToggle({ data, onExpand }: BidSimulatorToggleProps) {
  const [opps, setOpps] = useState(data.opportunities)

  const toggleWon = (id: string) => {
    setOpps((prev) => prev.map((o) => (o.id === id ? { ...o, won: !o.won } : o)))
  }

  const wonDemand = useMemo(() => opps.filter((o) => o.won).reduce((s, o) => s + o.demandFTE, 0), [opps])
  const baseDemand = 30 // current project demand
  const totalDemand = baseDemand + wonDemand
  const overCapacity = totalDemand > data.capacityBaselineFTE

  const chartData = [
    { name: 'Current', demand: baseDemand },
    ...(wonDemand > 0 ? [{ name: 'Won Bids', demand: wonDemand }] : []),
  ]

  const signal = (
    <div className="flex flex-col gap-3">
      <div className="h-[100px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="var(--figma-text-secondary)" />
            <YAxis tick={{ fontSize: 10 }} stroke="var(--figma-text-secondary)" domain={[0, data.capacityBaselineFTE + 10]} />
            <Bar dataKey="demand" fill="var(--figma-chart-1)" radius={[2, 2, 0, 0]} maxBarSize={32} />
            <ReferenceLine
              y={data.capacityBaselineFTE}
              stroke="var(--figma-chart-3)"
              strokeWidth={2}
              strokeDasharray="4 2"
              label={{ value: 'Capacity', position: 'right', fontSize: 10 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className="text-sm font-semibold tabular-nums"
          style={{ color: overCapacity ? 'var(--figma-error)' : 'var(--figma-text-primary)' }}
        >
          {totalDemand} / {data.capacityBaselineFTE} FTE
        </span>
        {overCapacity && (
          <span className="text-[11px] font-medium" style={{ color: 'var(--figma-error)' }}>
            Over capacity!
          </span>
        )}
      </div>
    </div>
  )

  const context = (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
        What-If Scenarios
      </p>
      <ul className="space-y-2">
        {opps.map((opp) => (
          <li
            key={opp.id}
            className="flex items-center justify-between rounded-lg border px-3 py-2"
            style={{
              borderColor: opp.won ? 'var(--figma-primary-main)' : 'var(--figma-bg-outline)',
              backgroundColor: opp.won ? 'var(--figma-primary-selected)' : 'var(--figma-bg-depth2)',
            }}
          >
            <div>
              <p className="text-[13px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
                {opp.name}
              </p>
              <p className="text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
                +{opp.demandFTE} FTE · {Math.round(opp.confidence * 100)}% confidence
              </p>
            </div>
            <label className="flex cursor-pointer items-center gap-2">
              <span className="text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>Win</span>
              <input
                type="checkbox"
                checked={opp.won}
                onChange={() => toggleWon(opp.id)}
                className="h-4 w-4 rounded"
                style={{ accentColor: 'var(--figma-primary-main)' }}
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <ActionableInsightCard
      title="Bid Simulator"
      signal={signal}
      context={context}
      kickoff={{ label: 'Model Capacity', onClick: () => onExpand?.('bid-simulator') }}
      kickoffPriority="p2"
      onInsightExpand={onExpand ? () => onExpand('bid-simulator') : undefined}
    />
  )
}
