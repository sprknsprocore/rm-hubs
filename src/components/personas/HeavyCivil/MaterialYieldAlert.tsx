import { AlertTriangle, Package } from 'lucide-react'
import type { MaterialYieldAlert as MaterialYieldAlertType } from '../../../types/lem'

interface MaterialYieldAlertProps {
  materialYield: MaterialYieldAlertType
}

export default function MaterialYieldAlert({ materialYield }: MaterialYieldAlertProps) {
  const { actualWastePct, budgetedWastePct, label } = materialYield
  const message = label ?? `Actual waste ${actualWastePct}% exceeds budgeted ${budgetedWastePct}%. Check subgrade before next pour.`
  const overage = actualWastePct - budgetedWastePct

  const alertAccent = 'var(--figma-chart-exception)'
  const alertBg = 'var(--figma-chart-exception-light)'

  return (
    <article className="figma-card-base flex min-h-0 flex-col overflow-hidden rounded-xl">
      {/* Header: left accent + title, no heavy background */}
      <div
        className="figma-card-border relative flex shrink-0 items-center gap-3 border-b px-4 py-3 md:px-5 md:py-3.5"
        style={{
          borderLeftWidth: 3,
          borderLeftColor: alertAccent,
        }}
      >
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: alertBg, color: alertAccent }}
        >
          <AlertTriangle className="h-4 w-4" strokeWidth={2.25} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[13px] font-semibold tracking-[-0.02em]" style={{ color: 'var(--figma-text-primary)' }}>
            Material Yield Alert
          </h3>
          <p className="mt-0.5 text-[12px] font-medium leading-snug" style={{ color: alertAccent }}>
            Waste {overage}% over budget
          </p>
        </div>
      </div>

      {/* Body: message + visual + CTA */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4 pt-4 md:px-5 md:pb-5 md:pt-5">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--figma-text-primary)' }}>
          {message}
        </p>

        {/* Waste comparison bars */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--figma-text-secondary)' }}>
            <span>Budgeted</span>
            <span className="tabular-nums font-medium" style={{ color: 'var(--figma-text-primary)' }}>{budgetedWastePct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--figma-bg-depth2)' }}>
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{
                width: `${Math.min(budgetedWastePct, 100)}%`,
                backgroundColor: 'var(--figma-chart-3)',
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--figma-text-secondary)' }}>
            <span>Actual waste</span>
            <span className="tabular-nums font-medium" style={{ color: 'var(--figma-chart-exception)' }}>{actualWastePct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--figma-bg-depth2)' }}>
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{
                width: `${Math.min(actualWastePct, 100)}%`,
                backgroundColor: 'var(--figma-chart-exception)',
              }}
            />
          </div>
        </div>

        <div className="figma-card-border mt-auto flex shrink-0 items-center justify-between gap-3 border-t pt-4">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--figma-text-secondary)' }}>
            <Package className="h-3.5 w-3.5" />
            Compare to material log
          </span>
          <button
            type="button"
            onClick={() => window.history.pushState({}, '', '/workflow/materials')}
            className="rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-all duration-150 active:scale-[0.98] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black/10 focus:ring-offset-2"
            style={{
              backgroundColor: 'var(--figma-cta-p2-bg)',
              color: 'var(--figma-cta-p2-text)',
              border: '1px solid var(--figma-cta-p2-border)',
            }}
          >
            View materials
          </button>
        </div>
      </div>
    </article>
  )
}
