import { Zap, MoreVertical, AlertTriangle } from 'lucide-react'
import { portfolioSummaryKpis } from '../../api/mockHelixApi'

export default function PortfolioSummaryCard() {
  return (
    <article
      className="flex flex-col"
      style={{
        backgroundColor: 'var(--helix-bg-card)',
        border: '1px solid var(--helix-border-card)',
        borderRadius: 'var(--helix-radius-card)',
      }}
    >
      <div
        className="flex items-center justify-between border-b"
        style={{
          borderColor: 'var(--helix-border-divider)',
          padding: 'var(--helix-space-card)',
        }}
      >
        <h2
          className="text-sm font-semibold"
          style={{ color: 'var(--helix-text-primary)' }}
        >
          Portfolio Summary
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium"
            style={{
              backgroundColor: 'var(--helix-bg-cta-pill)',
              color: 'var(--helix-primary)',
            }}
          >
            <Zap className="h-3.5 w-3.5" />
            Generate key metrics
          </button>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm"
            style={{ color: 'var(--helix-text-secondary)' }}
          >
            View data
          </button>
          <button
            type="button"
            className="rounded p-1"
            style={{ color: 'var(--helix-text-muted)' }}
            aria-label="More"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        className="grid grid-cols-2 gap-x-4 gap-y-3 p-5 sm:grid-cols-4"
        style={{ padding: 'var(--helix-space-card)' }}
      >
        {portfolioSummaryKpis.map((kpi) => (
          <div key={kpi.label} className="min-w-0">
            <p
              className="truncate text-xs"
              style={{ color: 'var(--helix-text-muted)' }}
            >
              {kpi.label}
            </p>
            <p
              className={`mt-0.5 flex items-center gap-1 font-semibold tabular-nums ${
                kpi.alert ? '' : ''
              }`}
              style={{
                color: kpi.alert ? 'var(--helix-error)' : 'var(--helix-text-primary)',
              }}
            >
              {kpi.alert && <AlertTriangle className="h-3.5 w-3.5 shrink-0" />}
              {kpi.value}
            </p>
          </div>
        ))}
      </div>
    </article>
  )
}
