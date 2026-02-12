import React, { Children, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { BENTO_DURATION, BENTO_STAGGER_DELAY, EASE_OUT_EXPO } from '../../utils/motion'

/** Number of columns in the bento grid (1 = full-width rows only). */
export type BentoColumns = 1 | 2 | 3

interface BentoGridProps {
  children: ReactNode
  className?: string
  /** Predefined row template: 'hero-action' | 'hero-secondary'. Applied at md+ for aligned heights. */
  rows?: 'hero-action' | 'hero-secondary'
  /** Number of columns (default 2). Use 3 for three cards per row. */
  columns?: BentoColumns
  /** Override: CSS grid-template-columns (e.g. '1fr 1fr 1fr'). Ignored when columns is set. */
  gridTemplateColumns?: string
}

/** Responsive columns using container queries so the grid adapts to its own width, not the viewport. */
const COLUMN_CLASSES: Record<BentoColumns, string> = {
  1: '@min-[640px]:grid-cols-1',
  2: '@min-[640px]:grid-cols-2',
  3: '@min-[640px]:grid-cols-2 @min-[1024px]:grid-cols-3',
}

const cellTransition = {
  duration: BENTO_DURATION,
  ease: EASE_OUT_EXPO,
}

/** Responsive span: single-column when container is narrow; respect span when wide enough. */
function getGridColumnClass(child: React.ReactNode): string {
  if (!React.isValidElement(child) || !('props' in child) || child.props == null) return 'col-span-1'
  const span = (child.props as { span?: 1 | 2 | 3 }).span
  if (span === 3) return 'col-span-full'
  if (span === 2) return 'col-span-1 @min-[640px]:col-span-2'
  return 'col-span-1'
}

export default function BentoGrid({
  children,
  className = '',
  rows,
  columns = 2,
  gridTemplateColumns,
}: BentoGridProps) {
  const rowsClass = rows === 'hero-action' ? 'bento-rows-hero-action' : rows === 'hero-secondary' ? 'bento-rows-hero-secondary' : ''
  const columnsClass = COLUMN_CLASSES[columns]
  const useCustomTemplate = gridTemplateColumns != null
  const childArray = Children.toArray(children)
  return (
    <div className="@container w-full">
      <motion.div
        className={`grid w-full grid-cols-1 gap-4 @min-[480px]:gap-5 @min-[640px]:gap-[var(--bento-gap)] ${columnsClass} ${rowsClass} ${className}`}
        style={{
          ...(useCustomTemplate ? { gridTemplateColumns } : {}),
        }}
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: BENTO_STAGGER_DELAY, delayChildren: 0 } },
          hidden: {},
        }}
      >
        {childArray.map((child, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{
              ...cellTransition,
              delay: index * BENTO_STAGGER_DELAY,
            }}
            className={`flex min-h-0 flex-col ${getGridColumnClass(child)}`}
          >
            <div className="flex min-h-0 flex-1 flex-col">
              {child}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/** Span 1 = one column, 2 = two columns, 3 = full width (all columns). */
export type BentoCellSpan = 1 | 2 | 3

/** Wraps a Bento cell so the child fills the grid cell and heights align. */
export function BentoCell({
  children,
  className = '',
  span,
}: {
  children: ReactNode
  className?: string
  /** Span 1 (default), 2, or 3 columns. Use 3 for full-width cards. */
  span?: BentoCellSpan
}) {
  const gridColumn =
    span === 3 ? '1 / -1' : span === 2 ? 'span 2' : undefined
  return (
    <div
      className={`flex min-h-0 flex-1 flex-col ${className}`}
      style={gridColumn ? { gridColumn } : undefined}
    >
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
