import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { ProjectData, ReconciliationRow } from '../../../types/lem'

function earnedHoursFromRow(row: ReconciliationRow): number {
  if (row.fieldQuantity <= 0) return 0
  const pct = row.pmValidatedQuantity / row.fieldQuantity
  return Math.round(row.budgetedHours * pct * 100) / 100
}

function actualHoursFromRow(row: ReconciliationRow): number {
  const spent = row.remainingHours != null ? row.budgetedHours - row.remainingHours : row.budgetedHours * 0.6
  return Math.round(spent * 100) / 100
}

interface ProjectProductionHealthCardProps {
  projectData: ProjectData
}

export default function ProjectProductionHealthCard({ projectData }: ProjectProductionHealthCardProps) {
  const navigate = useNavigate()
  const { earnedHours, actualHours } = useMemo(() => {
    let earned = 0
    let actual = 0
    for (const row of projectData.reconciliationRows) {
      earned += earnedHoursFromRow(row)
      actual += actualHoursFromRow(row)
    }
    return { earnedHours: Math.round(earned * 10) / 10, actualHours: Math.round(actual * 10) / 10 }
  }, [projectData.reconciliationRows])

  const cpi = projectData.kpis.cpi
  const isException = cpi < 1.0
  const contextParts: string[] = []
  if (isException && projectData.varianceReason?.trim()) {
    contextParts.push(`Reason for variance: ${projectData.varianceReason.trim()}`)
  } else if (isException) {
    contextParts.push('Earned hours trail actual—productivity leak.')
  } else {
    contextParts.push('CPI on track.')
  }
  const context = contextParts.join(' · ')

  const chartData = useMemo(
    () => [{ name: 'Hours', earned: earnedHours, actual: actualHours }],
    [earnedHours, actualHours]
  )
  const barColor = isException ? 'var(--figma-chart-exception)' : 'var(--figma-chart-1)'

  const signal = (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {isException && (
        <div
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium"
          style={{
            backgroundColor: 'var(--figma-chart-exception-light)',
            color: 'var(--figma-chart-exception)',
            alignSelf: 'flex-start',
          }}
        >
          Performance Factor (CPI) &lt; 1
        </div>
      )}
      <div className="min-h-[140px] min-w-0 flex-1">
        <ResponsiveContainer width="100%" height="100%" minHeight={140}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--figma-text-secondary)" />
            <YAxis
              tick={{ fontSize: 11 }}
              stroke="var(--figma-text-secondary)"
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
            />
            <Tooltip
              formatter={(value: number | undefined) => (value != null ? value.toLocaleString() : '')}
              contentStyle={{ fontSize: 11 }}
              labelStyle={{ fontSize: 10 }}
            />
            <Bar dataKey="earned" name="Earned" fill="var(--figma-chart-3)" radius={[2, 2, 0, 0]} maxBarSize={48} />
            <Bar dataKey="actual" name="Actual" fill={barColor} radius={[2, 2, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid shrink-0 grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-xs font-medium" style={{ color: 'var(--figma-text-disabled)' }}>Earned Hours</div>
          <div className="tabular-nums font-semibold" style={{ color: 'var(--figma-text-primary)' }}>{earnedHours.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs font-medium" style={{ color: 'var(--figma-text-disabled)' }}>Actual Hours</div>
          <div className="tabular-nums font-semibold" style={{ color: 'var(--figma-text-primary)' }}>{actualHours.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs font-medium" style={{ color: 'var(--figma-text-disabled)' }}>CPI</div>
          <div
            className="tabular-nums font-semibold"
            style={{ color: cpi >= 1 ? 'var(--figma-success)' : 'var(--figma-chart-exception)' }}
          >
            {cpi.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <ActionableInsightCard
      title="Production Health"
      titleLayoutId="project-production-health-title"
      signal={signal}
      context={context}
      kickoff={{
        label: 'True-Up Hours',
        onClick: () => navigate(`/workflow/true-up?project=${encodeURIComponent(projectData.projectId)}`),
      }}
      kickoffPriority="p2"
    />
  )
}
