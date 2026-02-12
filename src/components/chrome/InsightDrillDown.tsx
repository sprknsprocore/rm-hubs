import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { InsightDrillDownTable } from '../../types/insights'

interface InsightDrillDownProps {
  table: InsightDrillDownTable
}

export default function InsightDrillDown({ table }: InsightDrillDownProps) {
  const [expanded, setExpanded] = useState(false)
  const previewRows = table.rows.slice(0, 3)
  const hasMore = table.rows.length > 3

  return (
    <div
      className="rounded-lg border"
      style={{
        borderColor: 'var(--figma-bg-outline)',
        backgroundColor: 'var(--figma-bg-default)',
      }}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-black/[0.02]"
      >
        <span
          className="text-[12px] font-semibold"
          style={{ color: 'var(--figma-text-primary)' }}
        >
          {table.title}
        </span>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5" style={{ color: 'var(--figma-text-secondary)' }} />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" style={{ color: 'var(--figma-text-secondary)' }} />
        )}
      </button>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr
              className="border-t"
              style={{ borderColor: 'var(--figma-bg-outline)' }}
            >
              {table.columns.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap px-3 py-2 text-left font-semibold"
                  style={{ color: 'var(--figma-text-secondary)' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(expanded ? table.rows : previewRows).map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-t transition-colors hover:bg-black/[0.02]"
                style={{ borderColor: 'var(--figma-bg-outline)' }}
              >
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="whitespace-nowrap px-3 py-2"
                    style={{
                      color: cellIdx === 0 ? 'var(--figma-info)' : 'var(--figma-text-primary)',
                      fontWeight: cellIdx === 0 ? 500 : 400,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show more */}
      {hasMore && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="w-full border-t px-3 py-2 text-left text-[11px] font-medium transition-colors hover:bg-black/[0.02]"
          style={{
            color: 'var(--figma-info)',
            borderColor: 'var(--figma-bg-outline)',
          }}
        >
          Show more ({table.rows.length - 3} more rows)
        </button>
      )}
    </div>
  )
}
