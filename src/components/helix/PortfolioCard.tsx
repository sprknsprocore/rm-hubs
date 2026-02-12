import { MoreVertical, ChevronRight } from 'lucide-react'
import { portfolioProjects, portfolioFilters } from '../../api/mockHelixApi'
import { useState } from 'react'

export default function PortfolioCard() {
  const [activeFilter, setActiveFilter] = useState('Active')

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
          Portfolio 43
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm"
            style={{ color: 'var(--helix-text-secondary)' }}
          >
            See all
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
        className="border-b px-5 py-2"
        style={{
          borderColor: 'var(--helix-border-divider)',
          paddingLeft: 'var(--helix-space-card)',
          paddingRight: 'var(--helix-space-card)',
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="rounded border px-2 py-1 text-xs"
            style={{
              borderColor: 'var(--helix-border-card)',
              color: 'var(--helix-text-secondary)',
              backgroundColor: 'var(--helix-bg-card)',
            }}
          >
            <option>Quick Filter 01</option>
          </select>
          {portfolioFilters.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => setActiveFilter(f.label)}
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: activeFilter === f.label ? 'var(--helix-border-card)' : 'var(--helix-bg-input)',
                color: 'var(--helix-text-secondary)',
              }}
            >
              {f.label} {f.count != null ? f.count : ''}
            </button>
          ))}
        </div>
      </div>
      <ul className="flex-1 divide-y" style={{ borderColor: 'var(--helix-border-divider)' }}>
        {portfolioProjects.map((project) => (
          <li key={project.id}>
            <button
              type="button"
              className="flex w-full items-center gap-3 px-5 py-3 text-left"
            >
              <div
                className="h-10 w-14 shrink-0 overflow-hidden rounded"
                style={{ backgroundColor: 'var(--helix-border-card)' }}
              />
              <div className="min-w-0 flex-1">
                <span
                  className="inline-block rounded px-1.5 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: project.status === 'off_track' ? 'var(--helix-primary-muted)' : 'rgba(47, 133, 90, 0.15)',
                    color: project.status === 'off_track' ? 'var(--helix-warning)' : 'var(--helix-success)',
                  }}
                >
                  {project.status === 'off_track' ? 'Off Track' : 'Active'}
                </span>
                <p className="mt-1 font-medium" style={{ color: 'var(--helix-text-primary)' }}>
                  {project.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--helix-text-muted)' }}>
                  {project.address}
                </p>
                <p className="text-xs" style={{ color: 'var(--helix-text-muted)' }}>
                  {project.company} · {project.role} · {project.pm}
                </p>
              </div>
              {project.status === 'off_track' && (
                <ChevronRight className="h-4 w-4 shrink-0" style={{ color: 'var(--helix-text-muted)' }} />
              )}
            </button>
          </li>
        ))}
      </ul>
    </article>
  )
}
