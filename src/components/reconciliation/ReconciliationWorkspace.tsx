import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import ReconciliationTable from './ReconciliationTable'
import ConstraintHistorySidebar from './ConstraintHistorySidebar'
import type { ReconciliationRow, ReconciliationWorkspaceMeta } from '../../types/lem'

interface ReconciliationWorkspaceProps {
  meta: ReconciliationWorkspaceMeta
  rows: ReconciliationRow[]
  onRowsChange: (rows: ReconciliationRow[] | ((prev: ReconciliationRow[]) => ReconciliationRow[])) => void
  selectedRowId: string | null
  onSelectRow: (id: string | null) => void
  showConstraintSidebar: boolean
}

export default function ReconciliationWorkspace({
  meta,
  rows,
  onRowsChange,
  selectedRowId,
  onSelectRow,
  showConstraintSidebar,
}: ReconciliationWorkspaceProps) {
  const navigate = useNavigate()
  const selectedRow = selectedRowId ? rows.find((r) => r.id === selectedRowId) ?? null : null

  return (
    <motion.div
      layoutId="reconciliation-workspace"
      className="flex h-full flex-col"
      initial={false}
    >
      {/* Header */}
      <header
        className="flex shrink-0 flex-wrap items-center gap-3 border-b px-4 py-3"
        style={{
          backgroundColor: 'var(--figma-bg-default)',
          borderColor: 'var(--figma-bg-outline)',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-black/[0.06]"
          style={{ color: 'var(--figma-text-secondary)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Hub
        </button>
        <span
          className="text-sm"
          style={{ color: 'var(--figma-text-disabled)' }}
        >
          |
        </span>
        <motion.h1
          layoutId="reconciliation-workspace-title"
          className="text-lg font-semibold"
          style={{ color: 'var(--figma-text-primary)' }}
        >
          {meta.projectName}
        </motion.h1>
        <span
          className="text-sm"
          style={{ color: 'var(--figma-text-secondary)' }}
        >
          {meta.accountingPeriod}
        </span>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            backgroundColor: 'var(--figma-primary-selected)',
            color: 'var(--figma-primary-main)',
            border: '1px solid var(--figma-cta-p2-border)',
          }}
        >
          {meta.status}
        </span>
      </header>

      {/* Main: chart morphs into this area via shared layoutId "production-health-chart" */}
      <motion.div
        layoutId="production-health-chart"
        className="flex min-h-0 flex-1 gap-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="min-w-0 flex-1 overflow-auto p-5" style={{ padding: 'var(--figma-space-5)' }}>
          <ReconciliationTable
            rows={rows}
            onRowsChange={onRowsChange}
            selectedRowId={selectedRowId}
            onSelectRow={onSelectRow}
          />
        </div>
        {showConstraintSidebar && (
          <ConstraintHistorySidebar selectedRow={selectedRow} />
        )}
      </motion.div>
    </motion.div>
  )
}
