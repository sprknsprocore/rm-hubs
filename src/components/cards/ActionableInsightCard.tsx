import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export interface KickoffConfig {
  label: string
  onClick: () => void
}

export type KickoffPriority = 'p1' | 'p2' | 'p3'

export interface SecondaryActionConfig {
  icon: ReactNode
  label: string
  onClick: () => void
}

interface ActionableInsightCardProps {
  signal: ReactNode
  context: string | ReactNode
  kickoff: KickoffConfig
  kickoffPriority?: KickoffPriority
  title?: string
  /** When set, the title is wrapped in motion for shared layout transition (e.g. reconciliation-workspace-title). */
  titleLayoutId?: string
  secondaryAction?: SecondaryActionConfig
  /** When provided, renders a Sparkles "Insights" button in the card header to open the Insights sidebar. */
  onInsightExpand?: () => void
  className?: string
}

const kickoffStyles: Record<KickoffPriority, React.CSSProperties> = {
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

export default function ActionableInsightCard({
  signal,
  context,
  kickoff,
  kickoffPriority = 'p2',
  title,
  titleLayoutId,
  secondaryAction,
  onInsightExpand,
  className = '',
}: ActionableInsightCardProps) {
  const showHeader = !!(title || secondaryAction || onInsightExpand)

  return (
    <article
      className={`figma-card-base group relative flex h-full min-h-0 flex-col overflow-hidden ${className}`}
    >
      {showHeader && (
        <div
          className="figma-card-border relative flex shrink-0 items-center justify-between gap-2 border-b px-3 pt-3 pb-2.5 md:px-4 md:pt-4 md:pb-3"
        >
          {title ? (
            titleLayoutId ? (
              <motion.h3
                layoutId={titleLayoutId}
                className="text-[13px] font-semibold tracking-[-0.02em]"
                style={{ color: 'var(--figma-text-primary)' }}
              >
                {title}
              </motion.h3>
            ) : (
              <h3
                className="text-[13px] font-semibold tracking-[-0.02em]"
                style={{ color: 'var(--figma-text-primary)' }}
              >
                {title}
              </h3>
            )
          ) : (
            <span className="flex-1" />
          )}
          <div className="flex items-center gap-0.5">
            {onInsightExpand && (
              <button
                type="button"
                onClick={onInsightExpand}
                className="rounded-md p-1.5 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-black/[0.04] focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-black/10 focus:ring-offset-1"
                style={{ color: 'var(--figma-text-disabled)' }}
                aria-label="View Insights"
                title="View Insights"
              >
                <Sparkles className="h-3.5 w-3.5" />
              </button>
            )}
            {secondaryAction && (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="rounded-lg p-2 transition-colors hover:bg-black/[0.04] focus:outline-none focus:ring-2 focus:ring-black/10 focus:ring-offset-2"
                style={{ color: 'var(--figma-text-secondary)' }}
                aria-label={secondaryAction.label}
                title={secondaryAction.label}
              >
                {secondaryAction.icon}
              </button>
            )}
          </div>
        </div>
      )}
      <div className="relative flex min-h-0 flex-1 flex-col px-3 pb-3 pt-3 md:px-4 md:pb-4 md:pt-4">
        {/* Signal + context: flex-1 + justify-center so content is vertically centered in the available space */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center overflow-hidden">
          <div className="flex min-h-0 min-w-0 shrink-0 flex-col overflow-hidden">
            {signal}
          </div>
          <div
            className="mt-3 shrink-0 text-[13px] leading-relaxed md:mt-4"
            style={{ color: 'var(--figma-text-secondary)' }}
          >
            {context}
          </div>
        </div>
        {/* CTA – pinned to bottom so all cards in a row align */}
        <div className="mt-auto shrink-0 pt-3 md:pt-4">
          <button
            type="button"
            onClick={kickoff.onClick}
            className="inline-flex justify-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-all duration-150 active:scale-[0.98] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black/10 focus:ring-offset-2 md:px-4 md:py-2.5"
            style={kickoffStyles[kickoffPriority]}
          >
            {kickoff.label}
          </button>
        </div>
      </div>
    </article>
  )
}
