import { AnimatePresence, motion } from 'framer-motion'
import type { Domain } from '../chrome/LeftNav'
import type { NlFilterResult } from '../../types/lem'
import BentoGrid, { BentoCell } from '../layout/BentoGrid'
import TimesheetsListView from './TimesheetsListView'
import MaterialsListView from './MaterialsListView'
import EquipmentListView from './EquipmentListView'
import { BENTO_DURATION, EASE_OUT_EXPO } from '../../utils/motion'

export type GridDomain = Exclude<Domain, 'hub'>

interface UnifiedDomainGridProps {
  domain: GridDomain
  nlFilter: NlFilterResult | null
}

const DOMAIN_LABELS: Record<GridDomain, string> = {
  timesheets: 'Timesheets',
  materials: 'Materials',
  resourcePlanning: 'Resource Planning',
  equipment: 'Equipment',
}

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: BENTO_DURATION, ease: EASE_OUT_EXPO },
}

export default function UnifiedDomainGrid({ domain, nlFilter }: UnifiedDomainGridProps) {
  const label = DOMAIN_LABELS[domain]
  const filterActive = nlFilter != null && Object.keys(nlFilter).length > 0

  return (
    <AnimatePresence mode="wait">
      {domain === 'timesheets' ? (
        <motion.div
          key="timesheets"
          className="min-w-0 w-full"
          initial={pageTransition.initial}
          animate={pageTransition.animate}
          exit={pageTransition.exit}
          transition={pageTransition.transition}
        >
          <TimesheetsListView />
        </motion.div>
      ) : domain === 'materials' ? (
        <motion.div
          key="materials"
          className="min-w-0 w-full"
          initial={pageTransition.initial}
          animate={pageTransition.animate}
          exit={pageTransition.exit}
          transition={pageTransition.transition}
        >
          <MaterialsListView />
        </motion.div>
      ) : domain === 'equipment' ? (
        <motion.div
          key="equipment"
          className="min-w-0 w-full"
          initial={pageTransition.initial}
          animate={pageTransition.animate}
          exit={pageTransition.exit}
          transition={pageTransition.transition}
        >
          <EquipmentListView />
        </motion.div>
      ) : (
        <motion.div
          key={domain}
          initial={pageTransition.initial}
          animate={pageTransition.animate}
          exit={pageTransition.exit}
          transition={pageTransition.transition}
        >
          <BentoGrid columns={2} rows="hero-secondary">
            <BentoCell span={2}>
              <div
                className="flex min-h-[200px] flex-col justify-center rounded-lg border px-6 py-8 text-center"
                style={{
                  backgroundColor: 'var(--figma-bg-default)',
                  borderColor: 'var(--figma-bg-outline)',
                }}
              >
                <h2
                  className="text-lg font-semibold"
                  style={{ color: 'var(--figma-text-primary)' }}
                >
                  {label}
                </h2>
                <p
                  className="mt-2 text-sm"
                  style={{ color: 'var(--figma-text-secondary)' }}
                >
                  {filterActive
                    ? 'Filtered by your search. Project context applied.'
                    : 'All entries. Project context applied.'}
                </p>
                <p
                  className="mt-1 text-xs"
                  style={{ color: 'var(--figma-text-disabled)' }}
                >
                  Full Procore {label} integration coming soon.
                </p>
              </div>
            </BentoCell>
          </BentoGrid>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
