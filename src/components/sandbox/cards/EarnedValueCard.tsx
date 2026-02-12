import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { EarnedValueData } from '../../../hooks/useHubData'

interface EarnedValueCardProps {
  data: EarnedValueData
  onExpand?: (insightId: string) => void
}

type EvTab = 'all' | 'labor' | 'materials' | 'equipment'

const TAB_OPTIONS: { value: EvTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'labor', label: 'Labor' },
  { value: 'materials', label: 'Materials' },
  { value: 'equipment', label: 'Equipment' },
]

function formatK(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`
  return `$${value}`
}

function StatusBadge({ status }: { status: EarnedValueData['billingStatus'] }) {
  const config = {
    under_budget: { label: 'Under Budget', bg: 'var(--figma-success-light)', color: 'var(--figma-success)' },
    over_budget: { label: 'Over Budget', bg: 'var(--figma-error-light)', color: 'var(--figma-error)' },
    cost_in_excess: { label: 'Cost In Excess Of Billings', bg: 'var(--figma-error-light)', color: 'var(--figma-error)' },
  }
  const c = config[status]
  return (
    <span
      className="rounded-full border px-2.5 py-1 text-[11px] font-semibold"
      style={{ backgroundColor: c.bg, color: c.color, borderColor: c.color }}
    >
      {c.label}
    </span>
  )
}

export default function EarnedValueCard({ data, onExpand }: EarnedValueCardProps) {
  const [tab, setTab] = useState<EvTab>('all')

  // Progress bar segments (proportional to totalBudget)
  const pctActual = (data.actualCost / data.totalBudget) * 100
  const pctScheduled = (data.scheduledCost / data.totalBudget) * 100
  const pctEAC = Math.min((data.estAtCompletion / data.totalBudget) * 100, 100)

  // Chart data: pick series based on tab
  const chartData = data.timeSeries.map((pt) => {
    if (tab === 'labor') return { month: pt.month, actual: pt.labor, scheduled: pt.scheduled * 0.5, budgeted: pt.budgeted * 0.5 }
    if (tab === 'materials') return { month: pt.month, actual: pt.materials, scheduled: pt.scheduled * 0.33, budgeted: pt.budgeted * 0.33 }
    if (tab === 'equipment') return { month: pt.month, actual: pt.equipment, scheduled: pt.scheduled * 0.17, budgeted: pt.budgeted * 0.17 }
    return { month: pt.month, actual: pt.actual, scheduled: pt.scheduled, budgeted: pt.budgeted }
  })

  const signal = (
    <div className="flex flex-1 flex-col gap-4">
      {/* Progress bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>
            Cost Progress
          </span>
          <StatusBadge status={data.billingStatus} />
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--figma-bg-depth2)' }}>
          {/* EAC ghost bar (lightest) */}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${pctEAC}%`, backgroundColor: '#d1d5db' }}
          />
          {/* Scheduled (blue hatched) */}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${pctActual + pctScheduled}%`, backgroundColor: '#93c5fd' }}
          />
          {/* Actual (solid blue) */}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${pctActual}%`, backgroundColor: '#2563eb' }}
          />
        </div>
      </div>

      {/* 6 KPI row */}
      <div className="grid grid-cols-3 gap-x-4 gap-y-2 sm:grid-cols-6">
        {[
          { label: 'Actual Costs', value: data.actualCost },
          { label: 'Scheduled costs', value: data.scheduledCost },
          { label: 'To Date Costs', value: data.toDateCost },
          { label: 'Earned Value', value: data.earnedValue },
          { label: 'Est. Cost at Completion', value: data.estAtCompletion },
          { label: 'Total Budgeted Costs', value: data.totalBudget },
        ].map((kpi) => (
          <div key={kpi.label} className="flex flex-col">
            <span className="text-[10px] leading-tight" style={{ color: 'var(--figma-text-tertiary)' }}>
              {kpi.label}
            </span>
            <span className="text-[13px] font-semibold tabular-nums" style={{ color: 'var(--figma-text-primary)' }}>
              ${kpi.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>

      {/* CPI / SPI chips */}
      <div className="flex gap-3">
        <div className="flex items-center gap-1.5 rounded-md border px-2 py-1" style={{ borderColor: 'var(--figma-bg-outline)' }}>
          <span className="text-[10px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>CPI</span>
          <span
            className="text-[13px] font-bold tabular-nums"
            style={{ color: data.cpi >= 1 ? 'var(--figma-success)' : 'var(--figma-error)' }}
          >
            {data.cpi.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border px-2 py-1" style={{ borderColor: 'var(--figma-bg-outline)' }}>
          <span className="text-[10px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>SPI</span>
          <span
            className="text-[13px] font-bold tabular-nums"
            style={{ color: data.spi >= 1 ? 'var(--figma-success)' : 'var(--figma-error)' }}
          >
            {data.spi.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border px-2 py-1" style={{ borderColor: 'var(--figma-bg-outline)' }}>
          <span className="text-[10px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>CV</span>
          <span
            className="text-[13px] font-bold tabular-nums"
            style={{ color: data.costVariance >= 0 ? 'var(--figma-success)' : 'var(--figma-error)' }}
          >
            {data.costVariance >= 0 ? '+' : ''}${(data.costVariance / 1000).toFixed(1)}k
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border px-2 py-1" style={{ borderColor: 'var(--figma-bg-outline)' }}>
          <span className="text-[10px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>SV</span>
          <span
            className="text-[13px] font-bold tabular-nums"
            style={{ color: data.scheduleVariance >= 0 ? 'var(--figma-success)' : 'var(--figma-error)' }}
          >
            {data.scheduleVariance >= 0 ? '+' : ''}${(data.scheduleVariance / 1000).toFixed(1)}k
          </span>
        </div>
      </div>

      {/* L / M / E tabs */}
      <div
        className="flex gap-0.5 rounded-lg border p-0.5"
        style={{ borderColor: 'var(--figma-bg-outline)', backgroundColor: 'var(--figma-bg-depth2)' }}
      >
        {TAB_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTab(opt.value)}
            className="rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors"
            style={
              tab === opt.value
                ? { backgroundColor: 'var(--figma-bg-default)', color: 'var(--figma-text-primary)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
                : { color: 'var(--figma-text-secondary)' }
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="min-h-[180px] w-full min-w-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--figma-bg-outline)" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="var(--figma-text-secondary)" />
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
            <Line type="monotone" dataKey="actual" name="Actual" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3, fill: '#16a34a' }} />
            <Line type="monotone" dataKey="scheduled" name="Scheduled" stroke="#93c5fd" strokeWidth={2} dot={{ r: 3, fill: '#93c5fd' }} />
            <Line type="monotone" dataKey="budgeted" name="Budgeted" stroke="#2563eb" strokeWidth={2} dot={{ r: 3, fill: '#2563eb' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  const context = (
    <span>
      Earned Value Analysis: CPI {data.cpi.toFixed(2)} ({data.cpi >= 1 ? 'under budget' : 'over budget'}),
      SPI {data.spi.toFixed(2)} ({data.spi >= 1 ? 'ahead of schedule' : 'behind schedule'}).
    </span>
  )

  return (
    <ActionableInsightCard
      title="Earned Value"
      signal={signal}
      context={context}
      kickoff={{ label: 'Review Forecast', onClick: () => onExpand?.('earned-value') }}
      kickoffPriority="p1"
      expandSignal
      onInsightExpand={onExpand ? () => onExpand('earned-value') : undefined}
    />
  )
}
