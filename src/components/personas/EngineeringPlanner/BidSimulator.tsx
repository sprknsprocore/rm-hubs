import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { Opportunity } from '../../../types/lem'

interface BidSimulatorProps {
  opportunities: Opportunity[]
  onToggle: (id: string, won: boolean) => void
  /** Total FTE capacity (static line). */
  totalCapacity: number
  /** Base demand from current projects (excl. won opportunities). */
  baseDemand: number
}

export default function BidSimulator({ opportunities, onToggle, totalCapacity, baseDemand }: BidSimulatorProps) {
  const wonDemand = useMemo(
    () => opportunities.filter((o) => o.won).reduce((s, o) => s + o.demand, 0),
    [opportunities]
  )
  const totalDemand = baseDemand + wonDemand
  const demandChartData = useMemo(
    () => [
      { name: 'Current', demand: baseDemand },
      ...(wonDemand > 0 ? [{ name: 'Won', demand: wonDemand }] : []),
    ],
    [baseDemand, wonDemand]
  )

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={demandChartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="var(--figma-text-secondary)" />
            <YAxis tick={{ fontSize: 10 }} stroke="var(--figma-text-secondary)" />
            <Bar dataKey="demand" name="Demand (FTE)" fill="var(--figma-chart-1)" radius={[2, 2, 0, 0]} />
            <ReferenceLine
              y={totalCapacity}
              stroke="var(--figma-chart-3)"
              strokeWidth={2}
              strokeDasharray="4 2"
              label={{ value: 'Capacity', position: 'right', fontSize: 10 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs" style={{ color: 'var(--figma-text-secondary)' }}>
        Toggle Win to see demand jump vs capacity ({totalDemand} vs {totalCapacity} FTE).
      </p>
      <p className="text-sm font-medium" style={{ color: 'var(--figma-text-primary)' }}>Pending sales opportunities</p>
      <ul className="space-y-2">
        {opportunities.map((opp) => (
          <li
            key={opp.id}
            className="flex items-center justify-between rounded-lg border px-3 py-2"
            style={{ borderColor: 'var(--figma-bg-outline)', backgroundColor: 'var(--figma-bg-depth2)' }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--figma-text-primary)' }}>{opp.name}</p>
              <p className="text-xs" style={{ color: 'var(--figma-text-secondary)' }}>Demand: {opp.demand} FTE</p>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm" style={{ color: 'var(--figma-text-secondary)' }}>
              <span>Win</span>
              <input
                type="checkbox"
                checked={opp.won}
                onChange={(e) => onToggle(opp.id, e.target.checked)}
                className="h-4 w-4 rounded"
                style={{ accentColor: 'var(--figma-primary-main)' }}
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
