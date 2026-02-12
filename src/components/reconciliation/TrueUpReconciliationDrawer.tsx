import { useState, useRef, useEffect } from 'react'
import { PanelLeftClose } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReconciliationTable from './ReconciliationTable'
import ConstraintHistorySidebar from './ConstraintHistorySidebar'
import { SPRING_BOUNCE } from '../../utils/motion'
import type { ReconciliationRow } from '../../types/lem'

const DRAWER_WIDTH = 720

interface TrueUpReconciliationDrawerProps {
  open: boolean
  onClose: () => void
  projectId: string
  projectName: string
  reconciliationRows: ReconciliationRow[]
  selectedRowId: string | null
  onSelectRow: (rowId: string | null) => void
}

export default function TrueUpReconciliationDrawer({
  open,
  onClose,
  projectName,
  reconciliationRows,
  selectedRowId,
  onSelectRow,
}: TrueUpReconciliationDrawerProps) {
  const [rows, setRows] = useState<ReconciliationRow[]>(reconciliationRows)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      setRows(reconciliationRows)
      closeButtonRef.current?.focus()
    }
  }, [open, reconciliationRows])

  const selectedRow = selectedRowId ? rows.find((r) => r.id === selectedRowId) ?? null : null

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            role="presentation"
            className="fixed inset-0 z-[1050] bg-black/20 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            className="fixed left-0 top-0 z-[1050] flex hidden flex-col border-r md:flex"
            style={{
              width: Math.min(DRAWER_WIDTH, typeof window !== 'undefined' ? window.innerWidth * 0.9 : DRAWER_WIDTH),
              maxWidth: '100%',
              height: '100vh',
              backgroundColor: 'var(--figma-bg-default)',
              borderColor: 'var(--figma-bg-outline)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={SPRING_BOUNCE}
            aria-label="True-Up reconciliation"
          >
            <div
              className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3"
              style={{
                borderColor: 'var(--figma-bg-outline)',
              }}
            >
              <div className="min-w-0">
                <h2 className="text-sm font-semibold truncate" style={{ color: 'var(--figma-text-primary)' }}>
                  True-Up · {projectName}
                </h2>
                <p className="text-xs" style={{ color: 'var(--figma-text-secondary)' }}>
                  Field vs PM validated · Select a cost code
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 transition-colors hover:bg-black/[0.06] shrink-0"
                style={{ color: 'var(--figma-text-secondary)' }}
                aria-label="Close True-Up drawer"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 overflow-hidden">
              <div className="min-w-0 flex-1 overflow-auto p-4">
                <ReconciliationTable
                  rows={rows}
                  onRowsChange={setRows}
                  selectedRowId={selectedRowId}
                  onSelectRow={onSelectRow}
                />
              </div>
              <ConstraintHistorySidebar selectedRow={selectedRow} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
