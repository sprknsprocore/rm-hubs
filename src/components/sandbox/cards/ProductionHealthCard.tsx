import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { ProductionHealthData } from '../../../hooks/useHubData'

interface ProductionHealthCardProps {
  data: ProductionHealthData
}

export default function ProductionHealthCard({ data }: ProductionHealthCardProps) {
  const avgCpi = data.periods.reduce((s, p) => s + p.cpi, 0) / data.periods.length
  const isException = avgCpi < 1

  const signal = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[12px]" style={{ color: 'var(--figma-text-secondary)' }}>Avg CPI:</span>
          <span
            className="text-lg font-bold tabular-nums"
            style={{ color: isException ? 'var(--figma-chart-exception)' : 'var(--figma-success)' }}
          >
            {avgCpi.toFixed(2)}
          </span>
        </div>
        {isException && (
          <span
            className="rounded px-2 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: 'var(--figma-error-light)', color: 'var(--figma-error)' }}
          >
            CPI &lt; 1
          </span>
        )}
        {data.projectedOverrunHours > 0 && (
          <span className="text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
            +{data.projectedOverrunHours}h projected overrun
          </span>
        )}
      </div>

      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data.periods} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--figma-bg-outline)" />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: 'var(--figma-text-secondary)' }} />
            <YAxis yAxisId="hours" tick={{ fontSize: 11, fill: 'var(--figma-text-secondary)' }} />
            <YAxis yAxisId="cpi" orientation="right" domain={[0.5, 1.5]} tick={{ fontSize: 11, fill: 'var(--figma-text-secondary)' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--figma-bg-default)',
                border: '1px solid var(--figma-bg-outline)',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="cpi" y={1} stroke="var(--figma-text-disabled)" strokeDasharray="4 4" />
            <Bar yAxisId="hours" dataKey="earnedHours" name="Earned Hrs" fill="var(--figma-chart-3)" radius={[3, 3, 0, 0]} barSize={18} />
            <Bar yAxisId="hours" dataKey="actualHours" name="Actual Hrs" fill={isException ? 'var(--figma-chart-exception)' : 'var(--figma-chart-1)'} radius={[3, 3, 0, 0]} barSize={18} />
            <Line yAxisId="cpi" type="monotone" dataKey="cpi" name="CPI" stroke="var(--figma-primary-main)" strokeWidth={2} dot={{ r: 3, fill: 'var(--figma-primary-main)' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {data.varianceReason && (
        <p className="text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
          <span className="font-semibold" style={{ color: 'var(--figma-text-primary)' }}>Top constraint: </span>
          {data.varianceReason}
        </p>
      )}
    </div>
  )

  const context = (
    <span>Earned vs. actual hours per period with CPI trend line. CPI below 1.0 means the crew is spending more hours than they're earning.</span>
  )

  return (
    <ActionableInsightCard
      title="Production Health"
      signal={signal}
      context={context}
      kickoff={{ label: 'Reconcile Forecast', onClick: () => {} }}
      kickoffPriority="p2"
    />
  )
}
