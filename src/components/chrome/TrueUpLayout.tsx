import { useState, useMemo } from 'react'
import LeftNav from './LeftNav'
import TopRail from './TopRail'
import NextBestActionDrawer from './NextBestActionDrawer'
import ReconciliationWorkspace from '../reconciliation/ReconciliationWorkspace'
import { getReconciliationData } from '../../api/mockLemApi'
import type { Persona } from '../../types/lem'
import type { NextBestAction } from '../../types/lem'

const DELTA_THRESHOLD = 0.1

function getNextBestActionsFromRows(
  rows: { id: string; costCodeOrWBS: string; fieldQuantity: number; pmValidatedQuantity: number }[]
): NextBestAction[] {
  return rows
    .filter((row) => {
      const denom = row.fieldQuantity || 1
      const deltaPct = Math.abs(row.fieldQuantity - row.pmValidatedQuantity) / denom
      return deltaPct > DELTA_THRESHOLD
    })
    .map((row) => ({
      id: row.id,
      label: `True-up ${row.costCodeOrWBS}: Field ${row.fieldQuantity} vs Validated ${row.pmValidatedQuantity}`,
      priority: 'high' as const,
      ctaLabel: 'Review',
    }))
}

export default function TrueUpLayout() {
  const [persona, setPersona] = useState<Persona>('geco')
  const [nlQuery, setNlQuery] = useState('')
  const [actionsPanelOpen, setActionsPanelOpen] = useState(true)
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null)

  const initialData = useMemo(() => getReconciliationData(), [])
  const [rows, setRows] = useState(initialData.rows)
  const meta = initialData.meta

  const nextBestActions = useMemo(() => getNextBestActionsFromRows(rows), [rows])

  const handleSelectRow = (id: string | null) => {
    setSelectedRowId(id)
    if (id != null) setActionsPanelOpen(false)
  }

  const handleToggleActionsDrawer = () => {
    if (actionsPanelOpen) {
      setActionsPanelOpen(false)
    } else {
      setSelectedRowId(null)
      setActionsPanelOpen(true)
    }
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--figma-bg-depth1)' }}>
      <LeftNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopRail
          nlQuery={nlQuery}
          onNlQueryChange={setNlQuery}
          persona={persona}
          onPersonaChange={setPersona}
        />
        <main
          className={`flex-1 ${actionsPanelOpen ? 'md:pr-[var(--figma-drawer-width)]' : 'md:pr-10 pr-0'}`}
          style={{ minHeight: 'calc(100vh - var(--figma-header-height))' }}
        >
          <ReconciliationWorkspace
            meta={meta}
            rows={rows}
            onRowsChange={setRows}
            selectedRowId={selectedRowId}
            onSelectRow={handleSelectRow}
            showConstraintSidebar={!actionsPanelOpen}
          />
        </main>
        <NextBestActionDrawer
          items={nextBestActions}
          open={actionsPanelOpen}
          onToggle={handleToggleActionsDrawer}
        />
      </div>
    </div>
  )
}
