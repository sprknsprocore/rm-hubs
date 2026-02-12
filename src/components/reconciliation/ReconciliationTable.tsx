import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { ReconciliationRow, ForecastMethod } from '../../types/lem'

const VALIDATION_PULSE_MS = 280

function earnedHours(row: ReconciliationRow): number {
  if (row.fieldQuantity <= 0) return 0
  const pct = row.pmValidatedQuantity / row.fieldQuantity
  return Math.round(row.budgetedHours * pct * 100) / 100
}

interface ReconciliationTableProps {
  rows: ReconciliationRow[]
  onRowsChange: (rows: ReconciliationRow[] | ((prev: ReconciliationRow[]) => ReconciliationRow[])) => void
  selectedRowId: string | null
  onSelectRow: (id: string | null) => void
}

export default function ReconciliationTable({
  rows,
  onRowsChange,
  selectedRowId,
  onSelectRow,
}: ReconciliationTableProps) {
  const [reverseCalcRowId, setReverseCalcRowId] = useState<string | null>(null)
  const [pendingEtc, setPendingEtc] = useState<number | null>(null)
  const [etcAtFocus, setEtcAtFocus] = useState<number | null>(null)
  const [etcFocusRowId, setEtcFocusRowId] = useState<string | null>(null)
  const [lastValidatedCellId, setLastValidatedCellId] = useState<string | null>(null)

  const updateRow = useCallback(
    (id: string, updater: (row: ReconciliationRow) => ReconciliationRow) => {
      onRowsChange((prev) =>
        prev.map((r) => (r.id === id ? updater(r) : r))
      )
    },
    [onRowsChange]
  )

  const handlePmValidatedChange = (id: string, value: string) => {
    const num = value === '' ? 0 : Number.parseFloat(value)
    if (Number.isNaN(num) || num < 0) return
    updateRow(id, (r) => ({ ...r, pmValidatedQuantity: num }))
    setLastValidatedCellId(id)
  }

  useEffect(() => {
    if (lastValidatedCellId == null) return
    const t = setTimeout(() => setLastValidatedCellId(null), VALIDATION_PULSE_MS)
    return () => clearTimeout(t)
  }, [lastValidatedCellId])

  const handleMethodChange = (id: string, method: ForecastMethod) => {
    updateRow(id, (r) => {
      const next = { ...r, forecastMethod: method }
      // Stub recalc: adjust ETC based on method
      if (method === 'Production Units') {
        next.estimatedCostToComplete = Math.round(r.budgetedHours * 0.98)
        next.remainingHours = Math.round(r.budgetedHours * 0.1)
        next.performanceFactor = 0.98
      } else if (method === 'Remaining Hours') {
        next.remainingHours = next.remainingHours ?? Math.round(r.budgetedHours * 0.15)
        next.estimatedCostToComplete =
          (r.budgetedHours - earnedHours(r)) + (next.remainingHours ?? 0)
        next.performanceFactor = next.performanceFactor ?? 1
      } else {
        next.performanceFactor = next.performanceFactor ?? 1
        next.estimatedCostToComplete = Math.round(
          r.budgetedHours * (next.performanceFactor ?? 1)
        )
        next.remainingHours = next.remainingHours ?? 0
      }
      return next
    })
  }

  const handleEtcFocus = (id: string) => {
    const row = rows.find((r) => r.id === id)
    if (row) {
      setEtcAtFocus(row.estimatedCostToComplete)
      setEtcFocusRowId(id)
    }
  }

  const handleEtcBlur = (id: string, value: string) => {
    const num = value === '' ? 0 : Number.parseFloat(value)
    if (Number.isNaN(num) || num < 0) return
    setEtcFocusRowId(null)
    setEtcAtFocus(null)
    const row = rows.find((r) => r.id === id)
    if (!row) return
    const prev = etcFocusRowId === id ? etcAtFocus : row.estimatedCostToComplete
    updateRow(id, (r) => ({ ...r, estimatedCostToComplete: num }))
    if (prev != null && prev !== num) {
      setPendingEtc(num)
      setReverseCalcRowId(id)
    }
  }

  const handleEtcChange = (id: string, value: string) => {
    const num = value === '' ? 0 : Number.parseFloat(value)
    if (Number.isNaN(num) || num < 0) return
    updateRow(id, (r) => ({ ...r, estimatedCostToComplete: num }))
  }

  const applyReverseCalc = (choice: 'remainingHours' | 'performanceFactor') => {
    if (reverseCalcRowId == null || pendingEtc == null) return
    const row = rows.find((r) => r.id === reverseCalcRowId)
    if (!row) return
    const hrsSpent = earnedHours(row)
    if (choice === 'remainingHours') {
      const remaining = Math.max(0, pendingEtc - hrsSpent)
      updateRow(reverseCalcRowId, (r) => ({
        ...r,
        remainingHours: remaining,
      }))
    } else {
      const factor = row.budgetedHours > 0 ? pendingEtc / row.budgetedHours : 1
      updateRow(reverseCalcRowId, (r) => ({
        ...r,
        performanceFactor: Math.round(factor * 100) / 100,
      }))
    }
    setReverseCalcRowId(null)
    setPendingEtc(null)
  }

  const closeReverseCalc = () => {
    setReverseCalcRowId(null)
    setPendingEtc(null)
  }

  return (
    <>
      <div
        className="overflow-auto rounded-lg border"
        style={{
          backgroundColor: 'var(--figma-bg-default)',
          borderColor: 'var(--figma-bg-outline)',
        }}
      >
        <table className="w-full min-w-[800px] border-collapse text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--figma-bg-depth2)' }}>
              <th
                className="border-b px-3 py-2 text-left font-semibold"
                style={{
                  borderColor: 'var(--figma-bg-outline)',
                  color: 'var(--figma-text-primary)',
                }}
              >
                Cost Code / WBS
              </th>
              <th
                className="border-b px-3 py-2 text-right font-semibold"
                style={{
                  borderColor: 'var(--figma-bg-outline)',
                  color: 'var(--figma-text-primary)',
                }}
              >
                Field Quantity
              </th>
              <th
                className="border-b px-3 py-2 text-right font-semibold"
                style={{
                  borderColor: 'var(--figma-bg-outline)',
                  color: 'var(--figma-text-primary)',
                }}
              >
                PM Validated Quantity
              </th>
              <th
                className="border-b px-3 py-2 text-right font-semibold"
                style={{
                  borderColor: 'var(--figma-bg-outline)',
                  color: 'var(--figma-text-primary)',
                }}
              >
                Earned Hours
              </th>
              <th
                className="border-b px-3 py-2 text-left font-semibold"
                style={{
                  borderColor: 'var(--figma-bg-outline)',
                  color: 'var(--figma-text-primary)',
                }}
              >
                Method
              </th>
              <th
                className="border-b px-3 py-2 text-right font-semibold"
                style={{
                  borderColor: 'var(--figma-bg-outline)',
                  color: 'var(--figma-text-primary)',
                }}
              >
                Adjusted Hrs to Complete
              </th>
              <th
                className="border-b px-3 py-2 text-right font-semibold"
                style={{
                  borderColor: 'var(--figma-bg-outline)',
                  color: 'var(--figma-text-primary)',
                }}
              >
                Est. Cost to Complete
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isSelected = row.id === selectedRowId
              const eh = earnedHours(row)
              return (
                <tr
                  key={row.id}
                  onClick={() => onSelectRow(row.id)}
                  className="cursor-pointer transition-colors hover:bg-black/[0.03]"
                  style={{
                    backgroundColor: isSelected
                      ? 'var(--figma-primary-selected)'
                      : index % 2 === 1
                        ? 'var(--figma-bg-depth2)'
                        : undefined,
                  }}
                >
                  <td
                    className="border-b px-3 py-1.5 font-medium"
                    style={{
                      borderColor: 'var(--figma-bg-outline)',
                      color: 'var(--figma-text-primary)',
                    }}
                  >
                    {row.costCodeOrWBS}
                  </td>
                  <td
                    className="border-b px-3 py-1.5 text-right tabular-nums"
                    style={{
                      borderColor: 'var(--figma-bg-outline)',
                      color: 'var(--figma-text-secondary)',
                    }}
                  >
                    {row.fieldQuantity}
                  </td>
                  <motion.td
                    className="border-b px-3 py-1.5 text-right"
                    style={{ borderColor: 'var(--figma-bg-outline)' }}
                    onClick={(e) => e.stopPropagation()}
                    animate={{
                      backgroundColor:
                        lastValidatedCellId === row.id
                          ? 'var(--figma-success-light)'
                          : 'transparent',
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={row.pmValidatedQuantity}
                      onChange={(e) =>
                        handlePmValidatedChange(row.id, e.target.value)
                      }
                      className="w-20 rounded border px-2 py-1 text-right tabular-nums"
                      style={{
                        borderColor: 'var(--figma-bg-outline)',
                        backgroundColor: 'var(--figma-bg-default)',
                        color: 'var(--figma-text-primary)',
                      }}
                    />
                  </motion.td>
                  <td
                    className="border-b px-3 py-1.5 text-right tabular-nums"
                    style={{
                      borderColor: 'var(--figma-bg-outline)',
                      color: 'var(--figma-text-primary)',
                    }}
                  >
                    {eh}
                  </td>
                  <td
                    className="border-b px-3 py-1.5 text-right tabular-nums"
                    style={{
                      borderColor: 'var(--figma-bg-outline)',
                      color: 'var(--figma-text-secondary)',
                    }}
                  >
                    {row.remainingHours ?? '—'}
                  </td>
                  <td
                    className="border-b px-3 py-1.5"
                    style={{ borderColor: 'var(--figma-bg-outline)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={row.forecastMethod}
                      onChange={(e) =>
                        handleMethodChange(
                          row.id,
                          e.target.value as ForecastMethod
                        )
                      }
                      className="rounded border px-2 py-1 text-sm"
                      style={{
                        borderColor: 'var(--figma-bg-outline)',
                        backgroundColor: 'var(--figma-bg-default)',
                        color: 'var(--figma-text-primary)',
                      }}
                    >
                      <option value="Production Units">Production Units</option>
                      <option value="Remaining Hours">Remaining Hours</option>
                      <option value="Performance Factor">
                        Performance Factor
                      </option>
                    </select>
                  </td>
                  <td
                    className="border-b px-3 py-1.5 text-right"
                    style={{ borderColor: 'var(--figma-bg-outline)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={row.estimatedCostToComplete}
                      onChange={(e) =>
                        handleEtcChange(row.id, e.target.value)
                      }
                      onFocus={() => handleEtcFocus(row.id)}
                      onBlur={(e) =>
                        handleEtcBlur(row.id, e.target.value)
                      }
                      className="w-24 rounded border px-2 py-1 text-right tabular-nums"
                      style={{
                        borderColor: 'var(--figma-bg-outline)',
                        backgroundColor: 'var(--figma-bg-default)',
                        color: 'var(--figma-text-primary)',
                      }}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Reverse calculation modal */}
      {reverseCalcRowId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={closeReverseCalc}
          onKeyDown={(e) => e.key === 'Escape' && closeReverseCalc()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reverse-calc-title"
        >
          <div
            className="mx-4 max-w-sm rounded-lg border p-4 shadow-lg"
            style={{
              backgroundColor: 'var(--figma-bg-default)',
              borderColor: 'var(--figma-bg-outline)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="reverse-calc-title"
              className="mb-2 font-semibold"
              style={{ color: 'var(--figma-text-primary)' }}
            >
              Reverse calculation
            </h2>
            <p
              className="mb-4 text-sm"
              style={{ color: 'var(--figma-text-secondary)' }}
            >
              Should this change the <strong>Remaining Hours</strong> or the{' '}
              <strong>Performance Factor</strong>?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => applyReverseCalc('remainingHours')}
                className="rounded-lg px-3 py-2 text-sm font-medium"
                style={{
                  backgroundColor: 'var(--figma-cta-p2-bg)',
                  color: 'var(--figma-cta-p2-text)',
                  border: '1px solid var(--figma-cta-p2-border)',
                }}
              >
                Remaining Hours
              </button>
              <button
                type="button"
                onClick={() => applyReverseCalc('performanceFactor')}
                className="rounded-lg px-3 py-2 text-sm font-medium"
                style={{
                  backgroundColor: 'var(--figma-cta-p2-bg)',
                  color: 'var(--figma-cta-p2-text)',
                  border: '1px solid var(--figma-cta-p2-border)',
                }}
              >
                Performance Factor
              </button>
              <button
                type="button"
                onClick={closeReverseCalc}
                className="rounded-lg px-3 py-2 text-sm font-medium"
                style={{ color: 'var(--figma-text-secondary)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
