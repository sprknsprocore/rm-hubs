import { useRef, useEffect } from 'react'
import { Search, Bell, Sparkles, X } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ProjectData } from '../../types/lem'
import { SPRING_BOUNCE } from '../../utils/motion'

export interface ResourceManagementHeaderProps {
  /** NL filter query – bound to Command-K search */
  nlQuery: string
  onNlQueryChange: (value: string) => void
  /** Whether the Insights sidebar is open */
  insightsPanelOpen: boolean
  /** Close the Insights sidebar */
  onCloseInsights: () => void
  /** Project data for KPIs when in project view */
  projectData: ProjectData | null
}

export default function ResourceManagementHeader({
  nlQuery,
  onNlQueryChange,
  insightsPanelOpen,
  onCloseInsights,
  projectData,
}: ResourceManagementHeaderProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header
      className="sticky top-0 z-[1040] flex w-full flex-nowrap items-center gap-4 border-b backdrop-blur-md py-3 px-4 md:gap-6 md:px-6"
      style={{
        fontFamily: 'var(--figma-header-font)',
        backgroundColor: 'var(--figma-header-glass-bg)',
        borderColor: 'var(--figma-header-glass-border)',
      }}
      data-tour="resource-header"
    >
      {/* Section title: anchors the header */}
      <h2
        className="shrink-0 text-base font-semibold tracking-tight md:text-lg"
        style={{ color: 'var(--figma-text-primary)' }}
      >
        Resource Management
      </h2>

      {/* Command-K search — NL filter entry (context is in TopRail) */}
      <div className="w-[240px] shrink-0 md:w-[280px]">
        <div
          className="flex items-center gap-2 rounded-md border py-1.5 pl-2.5 pr-2 transition-colors focus-within:ring-2 focus-within:ring-offset-1 focus-within:ring-black/10"
          style={{
            backgroundColor: 'rgba(0,0,0,0.03)',
            borderColor: 'var(--figma-header-glass-border)',
          }}
        >
          <Search className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--figma-text-disabled)' }} aria-hidden />
          <input
            ref={searchInputRef}
            type="text"
            value={nlQuery}
            onChange={(e) => onNlQueryChange(e.target.value)}
            placeholder="Search or ask..."
            className="min-w-0 flex-1 bg-transparent text-sm placeholder:opacity-60 focus:outline-none"
            style={{ color: 'var(--figma-text-primary)' }}
            aria-label="Natural language search and filter"
          />
          <kbd
            className="shrink-0 rounded border px-1.5 py-0.5 font-sans text-[10px] font-medium tabular-nums"
            style={{
              borderColor: 'var(--figma-header-glass-border)',
              color: 'var(--figma-text-disabled)',
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Spacer: pushes right block to the end of the header */}
      <div className="min-w-0 flex-1" aria-hidden />

      {/* Right: KPIs + Bell + Actions — aligned to end of header bar */}
      <div className="flex shrink-0 items-center gap-4 md:gap-5">
        {projectData && (
          <div
            className="hidden items-center gap-4 text-[11px] tabular-nums md:flex"
            style={{ color: 'var(--figma-text-secondary)' }}
            aria-label="Project health metrics"
          >
            <span>
              CPI <strong style={{ color: projectData.kpis.cpi >= 1 ? 'var(--figma-success)' : 'var(--figma-error)' }}>{projectData.kpis.cpi.toFixed(2)}</strong>
            </span>
            <span>
              SPI <strong style={{ color: projectData.kpis.spi >= 1 ? 'var(--figma-success)' : 'var(--figma-error)' }}>{projectData.kpis.spi.toFixed(2)}</strong>
            </span>
            <span>
              Yield <strong style={{ color: 'var(--figma-text-primary)' }}>{projectData.kpis.materialYieldPct}%</strong>
            </span>
          </div>
        )}
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-black/[0.06] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black/10"
          style={{ color: 'var(--figma-text-secondary)' }}
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        {insightsPanelOpen && (
          <motion.button
            type="button"
            onClick={onCloseInsights}
            className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black/10"
            style={{
              height: '35px',
              backgroundColor: 'var(--figma-primary-selected)',
              color: 'var(--figma-primary-main)',
              borderColor: 'var(--figma-cta-p2-border)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={SPRING_BOUNCE}
            aria-label="Close Insights panel"
            data-tour="insights-active"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Insights
            <X className="h-3 w-3" />
          </motion.button>
        )}
      </div>
    </header>
  )
}
