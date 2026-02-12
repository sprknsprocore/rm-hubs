import { useEffect } from 'react'
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
import { motion, useSpring } from 'framer-motion'
import type { LaborCurves } from '../../../types/lem'
import { SPRING_TOOLTIP } from '../../../utils/motion'

interface SCurveForecastProps {
  data: LaborCurves
}

interface SensingTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value?: number; dataKey: string }>
  label?: string
  coordinate?: { x?: number; y?: number }
}
function SensingTooltipContent({ active, payload, label, coordinate }: SensingTooltipProps) {
  const x = useSpring(0, SPRING_TOOLTIP)
  const y = useSpring(0, SPRING_TOOLTIP)
  useEffect(() => {
    if (typeof coordinate?.x === 'number') x.set(coordinate.x)
    if (typeof coordinate?.y === 'number') y.set(coordinate.y)
  }, [coordinate?.x, coordinate?.y, x, y])

  if (!active || !payload?.length || coordinate == null) return null
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        x,
        y,
        zIndex: 99999,
      }}
    >
      <div
        className="pointer-events-none rounded border px-2 py-1 shadow-lg"
        style={{
          transform: 'translate(-50%, calc(-100% - 8px))',
          backgroundColor: 'var(--figma-bg-default)',
          borderColor: 'var(--figma-bg-outline)',
          color: 'var(--figma-text-primary)',
          fontSize: 10,
        }}
      >
        <div className="font-semibold" style={{ color: 'var(--figma-text-secondary)', fontSize: 10 }}>
          Week {label}
        </div>
        <ul className="mt-0.5 space-y-0.5 text-[10px]">
          {payload.map((entry: { name: string; value?: number; dataKey: string }) => (
            <li key={entry.dataKey}>
              {entry.name}: {entry.value != null ? Number(entry.value).toLocaleString() : '—'}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export default function SCurveForecast({ data }: SCurveForecastProps) {
  const combined = data.planned.map((p, i) => ({
    week: p.weekId,
    planned: p.value,
    actual: data.actual[i]?.value ?? 0,
    forecast: data.forecast[i]?.value ?? 0,
  }))

  return (
    <div className="h-full min-h-[200px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={200}>
        <LineChart data={combined} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--figma-bg-outline)" />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--figma-text-secondary)" />
          <YAxis tick={{ fontSize: 11 }} stroke="var(--figma-text-secondary)" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            wrapperStyle={{ zIndex: 99999 }}
            content={<SensingTooltipContent />}
            formatter={(value: number | undefined) => (value != null ? value.toLocaleString() : '')}
            labelFormatter={(label) => `Week ${label}`}
          />
          <Legend
            wrapperStyle={{ fontSize: 10 }}
            iconSize={8}
            iconType="line"
            formatter={(value) => <span style={{ fontSize: 10, color: 'var(--figma-text-secondary)' }}>{value}</span>}
          />
          {/* Planned = solid dark, Actual = solid blue (stands out), Forecast = dashed gray */}
          <Line
            type="monotone"
            dataKey="planned"
            name="Planned"
            stroke="#334155"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual"
            stroke="#0369a1"
            strokeWidth={2.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            name="Forecast"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
