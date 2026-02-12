import { MoreVertical, Zap, ChevronRight } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import {
  financialAllocated,
  financialTotal,
  financialBreakdown,
} from '../../api/mockHelixApi'

export default function FinancialStatusCard() {
  const data = [
    { name: 'Allocated', value: financialAllocated },
    { name: 'Remaining', value: financialTotal / 1_000_000 - financialAllocated },
  ]
  const chartColors = ['var(--helix-text-primary)', 'var(--helix-border-card)']

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
        className="flex items-center justify-between border-b px-5 py-3"
        style={{
          borderColor: 'var(--helix-border-divider)',
          padding: 'var(--helix-space-card)',
        }}
      >
        <h2
          className="text-sm font-semibold"
          style={{ color: 'var(--helix-text-primary)' }}
        >
          Financial Status
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm"
            style={{ color: 'var(--helix-text-secondary)' }}
          >
            View more
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
      <div style={{ padding: 'var(--helix-space-card)' }}>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-lg border p-3 text-left"
          style={{
            borderColor: 'var(--helix-border-divider)',
            backgroundColor: 'var(--helix-bg-cta-pill)',
          }}
        >
          <Zap className="h-5 w-5 shrink-0" style={{ color: 'var(--helix-primary)' }} />
          <div className="min-w-0 flex-1">
            <p className="font-medium" style={{ color: 'var(--helix-text-primary)' }}>
              Budget Optimization
            </p>
            <p className="text-xs" style={{ color: 'var(--helix-text-secondary)' }}>
              Identify key areas for budget optimization
            </p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0" style={{ color: 'var(--helix-text-muted)' }} />
        </button>
        <div className="mt-4 flex items-center gap-4">
          <div className="relative h-32 w-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={48}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-bold" style={{ color: 'var(--helix-text-primary)' }}>
                {financialAllocated}M
              </span>
              <span className="text-xs" style={{ color: 'var(--helix-text-muted)' }}>
                allocated
              </span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium" style={{ color: 'var(--helix-text-primary)' }}>
              Funding Total ${(financialTotal / 1_000_000).toFixed(0)},000,000
            </p>
            <ul className="mt-2 space-y-1">
              {financialBreakdown.map((row) => (
                <li
                  key={row.name}
                  className="flex items-center gap-2 text-xs"
                  style={{ color: 'var(--helix-text-secondary)' }}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: 'var(--helix-text-primary)' }}
                  />
                  {row.name} {row.pct}%
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  )
}
