import { useMemo, useRef, useEffect } from 'react'
import { AlertTriangle, BarChart3, ChevronRight, PanelRightClose, ListChecks } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { NextBestAction, NextBestActionPriority } from '../../types/lem'
import { SPRING_BOUNCE } from '../../utils/motion'

const SEVERITY_ORDER: NextBestActionPriority[] = ['critical', 'high', 'medium', 'low']

/** Sort by financial risk (desc, null last) then by priority severity. */
function sortByFinancialRiskThenSeverity(items: NextBestAction[]): NextBestAction[] {
  return [...items].sort((a, b) => {
    const aRisk = a.financialRiskAmount ?? -1
    const bRisk = b.financialRiskAmount ?? -1
    if (bRisk !== aRisk) return bRisk - aRisk // higher risk first
    const aIdx = SEVERITY_ORDER.indexOf((a.priority ?? 'low') as NextBestActionPriority)
    const bIdx = SEVERITY_ORDER.indexOf((b.priority ?? 'low') as NextBestActionPriority)
    return aIdx - bIdx
  })
}

interface NextBestActionDrawerProps {
  items: NextBestAction[]
  open: boolean
  onToggle: () => void
  /** When true, the drawer does not render a floating trigger when closed (caller provides trigger, e.g. in TopRail). */
  hideTriggerWhenClosed?: boolean
}

export default function NextBestActionDrawer({
  items,
  open,
  onToggle,
  hideTriggerWhenClosed = false,
}: NextBestActionDrawerProps) {
  const sortedItems = useMemo(() => sortByFinancialRiskThenSeverity(items), [items])
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus()
    }
  }, [open])

  if (!open && hideTriggerWhenClosed) return null

  return (
    <>
      {!open && !hideTriggerWhenClosed && (
        <button
          type="button"
          onClick={onToggle}
          className="fixed z-[1060] hidden h-10 w-10 items-center justify-center rounded-lg border md:flex"
          style={{
            top: 'var(--figma-drawer-top)',
            right: 'calc(2.5rem + var(--figma-space-5))',
            backgroundColor: 'var(--figma-bg-default)',
            borderColor: 'var(--figma-bg-outline)',
            color: 'var(--figma-text-secondary)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
          aria-label="Open Actions panel"
        >
          <ListChecks className="h-4 w-4" />
        </button>
      )}
      <AnimatePresence>
        {open && (
          <motion.aside
            className="fixed right-0 z-[1060] flex hidden flex-col border-l md:flex"
            style={{
              top: 'var(--figma-drawer-top)',
              height: 'calc(100vh - var(--figma-drawer-top))',
              width: 'var(--figma-drawer-width)',
              minWidth: '301px',
              maxWidth: 'var(--figma-drawer-width)',
              backgroundColor: 'var(--figma-bg-default)',
              borderColor: 'var(--figma-bg-outline)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={SPRING_BOUNCE}
            aria-label="Actions"
          >
      <div
        className="flex h-[var(--figma-domain-bar-height)] shrink-0 items-center justify-between gap-2 border-b px-3 py-2 md:px-4"
        style={{
          borderColor: 'var(--figma-bg-outline)',
        }}
      >
        <h2
          className="flex items-center gap-2 text-sm font-semibold"
          style={{ color: 'var(--figma-text-primary)' }}
        >
          <AlertTriangle
            className="h-4 w-4 shrink-0"
            style={{ color: 'var(--figma-primary-main)' }}
          />
          Actions
        </h2>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onToggle}
          className="rounded-lg p-1.5 transition-colors hover:bg-black/[0.06]"
          style={{ color: 'var(--figma-text-secondary)' }}
          aria-label="Close Actions panel"
        >
          <PanelRightClose className="h-4 w-4" />
        </button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto p-3">
        {sortedItems.length === 0 ? (
          <p
            className="py-4 text-center text-sm"
            style={{ color: 'var(--figma-text-secondary)' }}
          >
            No actions right now.
          </p>
        ) : (
          <ul className="space-y-2">
            {sortedItems.map((item) => (
              <li key={item.id}>
                <div
                  className="flex flex-col gap-2 rounded-lg border p-3 transition-colors hover:border-[var(--figma-primary-main)]/30"
                  style={{
                    borderColor: 'var(--figma-bg-outline)',
                    backgroundColor: 'var(--figma-bg-depth2)',
                  }}
                >
                  <p
                    className="text-sm font-medium leading-snug"
                    style={{ color: 'var(--figma-text-primary)' }}
                  >
                    {item.label}
                  </p>
                  {item.financialRiskLabel && (
                    <p
                      className="text-xs font-medium"
                      style={{ color: 'var(--figma-error)' }}
                    >
                      {item.financialRiskLabel}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    {item.priority && (
                      <span
                        className="text-xs capitalize"
                        style={{
                          color:
                            item.priority === 'critical'
                              ? 'var(--figma-error)'
                              : item.priority === 'high'
                                ? 'var(--figma-primary-main)'
                                : item.priority === 'medium'
                                  ? 'var(--figma-text-secondary)'
                                  : 'var(--figma-text-disabled)',
                        }}
                      >
                        {item.priority}
                      </span>
                    )}
                    {item.ctaLabel && (
                      <button
                        type="button"
                        className="flex shrink-0 items-center gap-0.5 text-xs font-medium"
                        style={{ color: 'var(--figma-cta-p2-text)' }}
                      >
                        {item.ctaLabel}
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <section
        className="shrink-0 border-t px-3 py-3"
        style={{
          borderColor: 'var(--figma-bg-outline)',
          backgroundColor: 'var(--figma-bg-depth2)',
        }}
      >
        <h3
          className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--figma-text-secondary)' }}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          At a glance
        </h3>
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between gap-2">
            <dt style={{ color: 'var(--figma-text-secondary)' }}>Open actions</dt>
            <dd className="font-medium" style={{ color: 'var(--figma-text-primary)' }}>
              {sortedItems.length}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt style={{ color: 'var(--figma-text-secondary)' }}>High priority</dt>
            <dd className="font-medium" style={{ color: 'var(--figma-text-primary)' }}>
              {sortedItems.filter((i) => i.priority === 'high' || i.priority === 'critical').length}
            </dd>
          </div>
        </dl>
      </section>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
