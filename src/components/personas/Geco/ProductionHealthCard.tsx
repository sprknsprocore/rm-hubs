import { useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type {
  LaborCurves,
  LaborBurnCurvePayload,
} from '../../../types/lem'

const TOOLTIP_OFFSET = { x: 0, y: -12 }

interface ProductionHealthTooltipProps {
  active?: boolean
  payload?: ReadonlyArray<{ name?: string; value?: number; dataKey?: string; color?: string }>
  label?: string | number
  coordinate?: { x?: number; y?: number }
  chartRef: React.RefObject<HTMLDivElement | null>
  formatter: (value: number | undefined, name?: string) => string
}

function ProductionHealthTooltipContent({
  active,
  payload,
  label,
  coordinate,
  chartRef,
  formatter,
}: ProductionHealthTooltipProps) {
  if (!active || !payload?.length || coordinate == null || !chartRef.current) return null
  const rect = chartRef.current.getBoundingClientRect()
  const x = rect.left + (coordinate.x ?? 0) + TOOLTIP_OFFSET.x
  const y = rect.top + (coordinate.y ?? 0) + TOOLTIP_OFFSET.y

  const tooltipEl = (
    <div
      role="tooltip"
      className="pointer-events-none rounded-md border shadow-lg"
      style={{
        position: 'fixed',
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
        zIndex: 999999,
        fontSize: 10,
        padding: '6px 10px',
        border: '1px solid var(--figma-bg-outline)',
        borderRadius: 6,
        backgroundColor: 'var(--figma-bg-default)',
        color: 'var(--figma-text-primary)',
      }}
    >
      <div className="font-semibold" style={{ marginBottom: 4 }}>{String(label)}</div>
      <ul className="space-y-1">
        {payload.map((entry, i) => (
          <li key={entry.dataKey ?? i} style={{ color: entry.color ?? 'var(--figma-text-secondary)' }}>
            {entry.name}: {formatter(entry.value, entry.name)}
          </li>
        ))}
      </ul>
    </div>
  )
  return createPortal(tooltipEl, document.body)
}

interface ProductionHealthCardProps {
  laborCurves: LaborCurves
  laborBurnCurve: LaborBurnCurvePayload
  varianceReason?: string
  projectedOverrunHours?: number
}

function buildChartData(
  laborCurves: LaborCurves,
  laborBurnCurve: LaborBurnCurvePayload
): { period: string; hoursSpent: number; earnedHours: number; cpi: number }[] {
  const actual = laborCurves.actual
  const planned = laborCurves.planned
  const totalBudgetedHours = planned.length > 0 ? planned[planned.length - 1]?.value ?? 0 : 0
  const periods = laborBurnCurve.periodIds
  const workCompletePct = laborBurnCurve.workCompletePct

  const len = Math.min(actual.length, periods.length, workCompletePct.length)
  const rows: { period: string; hoursSpent: number; earnedHours: number; cpi: number }[] = []

  for (let i = 0; i < len; i++) {
    const hoursSpent = actual[i]?.value ?? 0
    const pct = (workCompletePct[i] ?? 0) / 100
    const earnedHours = totalBudgetedHours * pct
    const cpi = hoursSpent > 0 ? earnedHours / hoursSpent : 1
    rows.push({
      period: periods[i] ?? `W${i}`,
      hoursSpent,
      earnedHours: Math.round(earnedHours),
      cpi: Math.round(cpi * 100) / 100,
    })
  }
  return rows
}

const productionHealthFormatter = (value: number | undefined, name?: string) => {
  if (name === 'CPI') return value != null ? value.toFixed(2) : ''
  return value != null ? value.toLocaleString() : ''
}

export default function ProductionHealthCard({
  laborCurves,
  laborBurnCurve,
  varianceReason,
  projectedOverrunHours,
}: ProductionHealthCardProps) {
  const navigate = useNavigate()
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartData = useMemo(
    () => buildChartData(laborCurves, laborBurnCurve),
    [laborCurves, laborBurnCurve]
  )

  const latestCpi = chartData.length > 0 ? chartData[chartData.length - 1]?.cpi ?? 1 : 1
  const isException = latestCpi < 1.0

  const barColor = isException ? 'var(--figma-chart-exception)' : 'var(--figma-chart-1)'
  const earnedColor = 'var(--figma-chart-3)'
  const lineColor = isException ? 'var(--figma-chart-exception)' : 'var(--figma-chart-3)'

  const contextParts: string[] = []
  if (projectedOverrunHours != null && projectedOverrunHours > 0) {
    contextParts.push(`Projected overrun: ${projectedOverrunHours} hrs`)
  }
  if (varianceReason?.trim()) {
    contextParts.push(`Lag detected: ${varianceReason.trim()}`)
  }
  const context = contextParts.length > 0
    ? contextParts.join(' · ')
    : isException
      ? 'Performance Factor (CPI) < 1: earned hours trail actual—productivity leak.'
      : 'CPI on track.'

  const workWeekId =
    laborBurnCurve.periodIds.length > 0
      ? laborBurnCurve.periodIds[laborBurnCurve.periodIds.length - 1]
      : 'current'
  const timesheetListUrl = `/timesheets?workWeek=${encodeURIComponent(workWeekId)}`

  const secondaryAction = {
    icon: <ExternalLink className="h-4 w-4" />,
    label: 'View timesheets (this week)',
    onClick: () => window.history.pushState({}, '', timesheetListUrl),
  }

  const signal = (
    <div className="flex h-full min-h-0 w-full flex-col">
      {isException && (
        <div
          className="mb-2 flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium"
          style={{
            backgroundColor: 'var(--figma-chart-exception-light)',
            color: 'var(--figma-chart-exception)',
            alignSelf: 'flex-start',
          }}
        >
          Performance Factor (CPI) &lt; 1 · productivity leak
        </div>
      )}
      <motion.div
        ref={chartContainerRef}
        layoutId="production-health-chart"
        className="min-h-[220px] min-w-0 flex-1"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <ResponsiveContainer width="100%" height="100%" minHeight={220}>
          <ComposedChart
            data={chartData}
            margin={{ top: 8, right: 32, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--figma-bg-outline)" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11 }}
              stroke="var(--figma-text-secondary)"
            />
            <YAxis
              yAxisId="hours"
              tick={{ fontSize: 11 }}
              stroke="var(--figma-text-secondary)"
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
            />
            <YAxis
              yAxisId="cpi"
              orientation="right"
              domain={[0.5, 1.5]}
              tick={{ fontSize: 11 }}
              stroke="var(--figma-text-secondary)"
              tickFormatter={(v) => v.toFixed(2)}
            />
            <Tooltip
              content={(props) => (
                <ProductionHealthTooltipContent
                  {...props}
                  chartRef={chartContainerRef}
                  formatter={productionHealthFormatter}
                />
              )}
            />
            <ReferenceLine yAxisId="cpi" y={1} stroke="var(--figma-text-disabled)" strokeDasharray="3 3" />
            <Legend />
            <Bar
              yAxisId="hours"
              dataKey="hoursSpent"
              name="Hours spent"
              fill={barColor}
              radius={[2, 2, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              yAxisId="hours"
              dataKey="earnedHours"
              name="Earned hours"
              fill={earnedColor}
              radius={[2, 2, 0, 0]}
              maxBarSize={28}
            />
            <Line
              yAxisId="cpi"
              type="monotone"
              dataKey="cpi"
              name="CPI"
              stroke={lineColor}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )

  return (
    <ActionableInsightCard
      title="Production Health"
      titleLayoutId="reconciliation-workspace-title"
      signal={signal}
      context={context}
      kickoff={{
        label: 'Reconcile forecast',
        onClick: () => navigate('/workflow/true-up'),
      }}
      kickoffPriority="p2"
      secondaryAction={secondaryAction}
    />
  )
}
