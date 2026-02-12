import { useState, useRef, useEffect } from 'react'
import {
  X,
  Sparkles,
  Star,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Settings,
  UserPlus,
  Clock,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPRING_BOUNCE } from '../../utils/motion'
import { getInsightById } from '../../api/mockInsightsData'
import type { InsightDetail, InsightAction } from '../../types/insights'
import InsightDrillDown from './InsightDrillDown'
import InsightMiniViz from './InsightMiniViz'

/** Format an ISO timestamp into a relative "Updated X ago" string. */
function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60_000)
  if (mins < 1) return 'Updated just now'
  if (mins < 60) return `Updated ${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `Updated ${hrs}h ago`
  const days = Math.round(hrs / 24)
  return `Updated ${days}d ago`
}

const CONTENT_TRANSITION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.15 },
}

interface InsightsSidebarProps {
  /** The card insight ID to display, or null when closed. */
  selectedInsightId: string | null
  onClose: () => void
}

const ACTION_PRIORITY_STYLES: Record<InsightAction['priority'], React.CSSProperties> = {
  p1: {
    backgroundColor: 'var(--figma-cta-p1-bg)',
    color: 'var(--figma-cta-p1-text)',
    border: 'none',
  },
  p2: {
    backgroundColor: 'var(--figma-cta-p2-bg)',
    color: 'var(--figma-cta-p2-text)',
    border: '1px solid var(--figma-cta-p2-border)',
  },
  p3: {
    backgroundColor: 'var(--figma-cta-p3-bg)',
    color: 'var(--figma-cta-p3-text)',
    border: '1px solid var(--figma-cta-p3-border)',
  },
}

function TrendIcon({ trend }: { trend?: 'up' | 'down' | 'flat' }) {
  if (!trend) return null
  if (trend === 'up') return <TrendingUp className="h-3 w-3" style={{ color: 'var(--figma-error)' }} />
  if (trend === 'down') return <TrendingDown className="h-3 w-3" style={{ color: 'var(--figma-error)' }} />
  return <Minus className="h-3 w-3" style={{ color: 'var(--figma-text-disabled)' }} />
}

export default function InsightsSidebar({ selectedInsightId, onClose }: InsightsSidebarProps) {
  const insight: InsightDetail | undefined = selectedInsightId
    ? getInsightById(selectedInsightId)
    : undefined

  const open = !!insight
  const closeRef = useRef<HTMLButtonElement>(null)
  const [quickInsightOpen, setQuickInsightOpen] = useState(true)

  // Reset accordion when insight changes
  useEffect(() => {
    setQuickInsightOpen(true)
  }, [selectedInsightId])

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  return (
    <AnimatePresence>
      {open && insight && (
        <motion.aside
          className="fixed right-0 z-[1060] flex hidden flex-col border-l md:flex"
          style={{
            top: 'var(--figma-drawer-top)',
            height: 'calc(100vh - var(--figma-drawer-top))',
            width: 'var(--figma-drawer-width)',
            minWidth: '340px',
            maxWidth: 'var(--figma-drawer-width)',
            backgroundColor: 'var(--figma-bg-default)',
            borderColor: 'var(--figma-bg-outline)',
          }}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={SPRING_BOUNCE}
          aria-label="Insights"
        >
          {/* ── Header ── */}
          <div
            className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3"
            style={{ borderColor: 'var(--figma-bg-outline)' }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0" style={{ color: 'var(--figma-text-primary)' }} />
              <h2
                className="text-sm font-semibold"
                style={{ color: 'var(--figma-text-primary)' }}
              >
                Insights
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded-lg p-1.5 transition-colors hover:bg-black/[0.06]"
                style={{ color: 'var(--figma-text-secondary)' }}
                aria-label="Settings"
              >
                <Settings className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="rounded-lg p-1.5 transition-colors hover:bg-black/[0.06]"
                style={{ color: 'var(--figma-text-secondary)' }}
                aria-label="Share"
              >
                <UserPlus className="h-3.5 w-3.5" />
              </button>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 transition-colors hover:bg-black/[0.06]"
                style={{ color: 'var(--figma-text-secondary)' }}
                aria-label="Close Insights panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── AI disclaimer ── */}
          <div
            className="shrink-0 border-b px-4 py-2.5"
            style={{
              borderColor: 'var(--figma-bg-outline)',
              backgroundColor: 'var(--figma-bg-depth2)',
            }}
          >
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--figma-text-secondary)' }}>
              Making informed, data-driven decisions can help{' '}
              <strong style={{ color: 'var(--figma-text-primary)' }}>mitigate project risk</strong>.
              AI powered predictions should be verified for accuracy.{' '}
              <button
                type="button"
                className="font-medium underline underline-offset-2 transition-colors hover:opacity-80"
                style={{ color: 'var(--figma-info)' }}
              >
                Learn more
              </button>{' '}
              <span
                className="inline-flex h-3.5 w-3.5 cursor-help items-center justify-center rounded-full border text-[9px] font-bold"
                style={{
                  borderColor: 'var(--figma-text-disabled)',
                  color: 'var(--figma-text-disabled)',
                }}
              >
                i
              </span>
            </p>
          </div>

          {/* ── Scrollable Content ── */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {/* ── Sticky Title Bar ── */}
            <div
              className="sticky top-0 z-10 border-b px-4 py-3"
              style={{
                borderColor: 'var(--figma-bg-outline)',
                backgroundColor: 'var(--figma-bg-default)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    className="mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{
                      backgroundColor: 'var(--figma-primary-selected)',
                      color: 'var(--figma-primary-main)',
                    }}
                  >
                    {insight.category}
                  </span>
                  <h3
                    className="mt-1 text-base font-semibold leading-snug"
                    style={{ color: 'var(--figma-text-primary)' }}
                  >
                    {insight.title}
                  </h3>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    className="rounded-lg p-1.5 transition-colors hover:bg-black/[0.06]"
                    style={{ color: 'var(--figma-text-disabled)' }}
                    aria-label="Favorite"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg p-1.5 transition-colors hover:bg-black/[0.06]"
                    style={{ color: 'var(--figma-text-disabled)' }}
                    aria-label="More options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Timeframe Context */}
              {(insight.timeframe || insight.lastUpdated) && (
                <div className="mt-2 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" style={{ color: 'var(--figma-text-disabled)' }} />
                  <span className="text-[10px]" style={{ color: 'var(--figma-text-disabled)' }}>
                    {insight.timeframe}
                    {insight.timeframe && insight.lastUpdated && ' · '}
                    {insight.lastUpdated && formatRelativeTime(insight.lastUpdated)}
                  </span>
                </div>
              )}
            </div>

            {/* ── Animated Content Area ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedInsightId}
                {...CONTENT_TRANSITION}
              >
                <div className="p-4">
                  {/* Quick Insight Accordion */}
                  <div
                    className="mb-4 rounded-lg border"
                    style={{
                      borderColor: 'var(--figma-bg-outline)',
                      backgroundColor: 'var(--figma-bg-depth2)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setQuickInsightOpen((v) => !v)}
                      className="flex w-full items-center justify-between px-3 py-2.5 text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--figma-primary-main)' }} />
                        <span
                          className="text-[12px] font-semibold"
                          style={{ color: 'var(--figma-primary-main)' }}
                        >
                          Quick Insight
                        </span>
                      </span>
                      {quickInsightOpen ? (
                        <ChevronUp className="h-3.5 w-3.5" style={{ color: 'var(--figma-text-secondary)' }} />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" style={{ color: 'var(--figma-text-secondary)' }} />
                      )}
                    </button>
                    <AnimatePresence initial={false}>
                      {quickInsightOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3">
                            <p
                              className="mb-2 text-[13px] font-medium leading-snug"
                              style={{ color: 'var(--figma-success)' }}
                            >
                              {insight.quickInsight.summary}
                            </p>
                            <p
                              className="text-[12px] leading-relaxed"
                              style={{ color: 'var(--figma-text-secondary)' }}
                            >
                              {insight.quickInsight.detail}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mini Visualization */}
                  {insight.visualization && (
                    <div className="mb-4">
                      <InsightMiniViz visualization={insight.visualization} />
                    </div>
                  )}

                  {/* Key Metrics */}
                  <div className="mb-4">
                    <h4
                      className="mb-2 text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--figma-text-secondary)' }}
                    >
                      Key Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {insight.metrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="rounded-lg border px-3 py-2.5"
                          style={{
                            borderColor: 'var(--figma-bg-outline)',
                            backgroundColor: 'var(--figma-bg-depth2)',
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="text-base font-bold tabular-nums"
                              style={{ color: 'var(--figma-text-primary)' }}
                            >
                              {metric.value}
                            </span>
                            <TrendIcon trend={metric.trend} />
                          </div>
                          <span
                            className="text-[10px]"
                            style={{ color: 'var(--figma-text-secondary)' }}
                          >
                            {metric.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Drill-Down Table */}
                  {insight.drillDownTable && (
                    <div className="mb-4">
                      <InsightDrillDown table={insight.drillDownTable} />
                    </div>
                  )}

                  {/* Recommended Actions */}
                  <div className="mb-4">
                    <h4
                      className="mb-2 text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--figma-text-secondary)' }}
                    >
                      Recommended Actions
                    </h4>
                    <ul className="space-y-2.5">
                      {insight.recommendedActions.map((action, idx) => (
                        <li
                          key={idx}
                          className="rounded-lg border p-3"
                          style={{
                            borderColor: 'var(--figma-bg-outline)',
                            backgroundColor: 'var(--figma-bg-default)',
                          }}
                        >
                          <p
                            className="mb-2.5 text-[12px] leading-relaxed"
                            style={{ color: 'var(--figma-text-secondary)' }}
                          >
                            {action.text}
                          </p>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
                            style={ACTION_PRIORITY_STYLES[action.priority]}
                          >
                            {action.ctaLabel}
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Report Link */}
                  {insight.reportLink && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="flex items-center gap-1 text-[12px] font-medium transition-colors hover:opacity-80"
                        style={{ color: 'var(--figma-info)' }}
                      >
                        {insight.reportLink.label}
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
