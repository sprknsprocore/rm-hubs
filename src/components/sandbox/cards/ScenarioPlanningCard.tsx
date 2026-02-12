import { useState, useMemo } from 'react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { ScenarioPlanningData } from '../../../hooks/useHubData'

interface ScenarioPlanningCardProps {
  data: ScenarioPlanningData
}

export default function ScenarioPlanningCard({ data }: ScenarioPlanningCardProps) {
  const [scenarios, setScenarios] = useState(data.scenarios)

  const toggleScenario = (id: string) => {
    setScenarios((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)))
  }

  const totalImpactPct = useMemo(
    () => scenarios.filter((s) => s.active).reduce((sum, s) => sum + s.costImpactPct, 0),
    [scenarios]
  )

  const adjustedEAC = data.baseline.estAtCompletion * (1 + totalImpactPct / 100)
  const adjustedOverBudget = adjustedEAC > data.baseline.totalBudget
  const baselinePct = (data.baseline.estAtCompletion / data.baseline.totalBudget) * 100
  const adjustedPct = Math.min((adjustedEAC / data.baseline.totalBudget) * 100, 110)

  const signal = (
    <div className="flex flex-col gap-4">
      {/* Status badge */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium" style={{ color: 'var(--figma-text-secondary)' }}>
          Scenario Impact
        </span>
        <span
          className="rounded-full border px-2.5 py-1 text-[11px] font-semibold"
          style={{
            backgroundColor: adjustedOverBudget ? 'var(--figma-error-light)' : 'var(--figma-success-light)',
            color: adjustedOverBudget ? 'var(--figma-error)' : 'var(--figma-success)',
            borderColor: adjustedOverBudget ? 'var(--figma-error)' : 'var(--figma-success)',
          }}
        >
          {adjustedOverBudget ? 'Over Budget' : 'Under Budget'}
        </span>
      </div>

      {/* Progress bar with baseline + adjusted */}
      <div className="flex flex-col gap-2">
        <div className="relative h-3 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--figma-bg-depth2)' }}>
          {/* Adjusted EAC (shows overshoot) */}
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300"
            style={{
              width: `${Math.min(adjustedPct, 100)}%`,
              backgroundColor: adjustedOverBudget ? 'var(--figma-error)' : 'var(--figma-success)',
              opacity: 0.3,
            }}
          />
          {/* Baseline EAC */}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${Math.min(baselinePct, 100)}%`,
              backgroundColor: '#2563eb',
            }}
          />
          {/* Actual cost */}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${(data.baseline.actualCost / data.baseline.totalBudget) * 100}%`,
              backgroundColor: '#1e40af',
            }}
          />
        </div>
        <div className="flex justify-between text-[10px]" style={{ color: 'var(--figma-text-tertiary)' }}>
          <span>$0</span>
          <span>${data.baseline.totalBudget.toLocaleString()}</span>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {[
          { label: 'Actual Costs', value: data.baseline.actualCost },
          { label: 'Scheduled costs', value: data.baseline.scheduledCost },
          { label: 'To Date Costs', value: data.baseline.toDateCost },
          { label: 'Est. Cost at Comp.', value: adjustedEAC, highlight: adjustedOverBudget },
          { label: 'Total Budget', value: data.baseline.totalBudget },
        ].map((kpi) => (
          <div key={kpi.label} className="flex flex-col">
            <span className="text-[10px] leading-tight" style={{ color: 'var(--figma-text-tertiary)' }}>
              {kpi.label}
            </span>
            <span
              className="text-[13px] font-semibold tabular-nums"
              style={{ color: kpi.highlight ? 'var(--figma-error)' : 'var(--figma-text-primary)' }}
            >
              ${kpi.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>

      {/* Impact summary */}
      {totalImpactPct > 0 && (
        <div
          className="rounded-lg px-3 py-2"
          style={{
            backgroundColor: adjustedOverBudget ? 'var(--figma-error-light)' : 'var(--figma-chart-exception-light)',
            borderLeft: `3px solid ${adjustedOverBudget ? 'var(--figma-error)' : 'var(--figma-chart-exception)'}`,
          }}
        >
          <span className="text-[12px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
            +{totalImpactPct.toFixed(1)}% cost impact → EAC increases by ${Math.round(adjustedEAC - data.baseline.estAtCompletion).toLocaleString()}
          </span>
        </div>
      )}

      {/* Scenario toggles */}
      <div className="space-y-2">
        {scenarios.map((sc) => (
          <label
            key={sc.id}
            className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors"
            style={{
              borderColor: sc.active ? 'var(--figma-primary-main)' : 'var(--figma-bg-outline)',
              backgroundColor: sc.active ? 'var(--figma-primary-selected)' : 'var(--figma-bg-depth2)',
            }}
          >
            <input
              type="checkbox"
              checked={sc.active}
              onChange={() => toggleScenario(sc.id)}
              className="h-4 w-4 rounded"
              style={{ accentColor: 'var(--figma-primary-main)' }}
            />
            <div className="min-w-0 flex-1">
              <span className="text-[13px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
                {sc.label}
              </span>
              <p className="text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
                {sc.description}
              </p>
            </div>
            <span
              className="shrink-0 text-[12px] font-semibold tabular-nums"
              style={{ color: 'var(--figma-chart-exception)' }}
            >
              +{sc.costImpactPct}%
            </span>
          </label>
        ))}
      </div>
    </div>
  )

  const context = (
    <span>
      Toggle scenarios to model cost impact on Estimate at Completion. Helps validate risk contingency before committing.
    </span>
  )

  return (
    <ActionableInsightCard
      title="Scenario Planning"
      signal={signal}
      context={context}
      kickoff={{ label: 'Lock Scenario', onClick: () => {} }}
      kickoffPriority="p2"
    />
  )
}
