import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TablePaginationProps {
  start: number
  end: number
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  /** If true, show page dropdown instead of "Page N of M" text */
  showPageSelect?: boolean
}

export default function TablePagination({
  start,
  end,
  total,
  page,
  totalPages,
  onPageChange,
  showPageSelect = false,
}: TablePaginationProps) {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-4 border-t px-4 py-3"
      style={{ borderColor: 'var(--figma-bg-outline)', backgroundColor: 'var(--figma-bg-depth2)' }}
    >
      <p className="text-xs" style={{ color: 'var(--figma-text-secondary)' }}>
        Showing {start}–{end} of {total.toLocaleString()}
      </p>
      <div className="flex items-center gap-2">
        {showPageSelect ? (
          <>
            <span className="text-sm" style={{ color: 'var(--figma-text-secondary)' }}>
              Page:
            </span>
            <select
              value={page}
              onChange={(e) => onPageChange(Number(e.target.value))}
              className="rounded border py-1.5 pl-2 pr-7 text-sm focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--figma-bg-default)',
                borderColor: 'var(--figma-bg-outline)',
                color: 'var(--figma-text-primary)',
              }}
              aria-label="Page number"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </>
        ) : (
          <span className="px-2 text-sm" style={{ color: 'var(--figma-text-primary)' }}>
            Page {page} of {totalPages}
          </span>
        )}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="rounded-md p-1.5 transition-colors disabled:opacity-40"
          style={{ color: 'var(--figma-text-secondary)' }}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="rounded-md p-1.5 transition-colors disabled:opacity-40"
          style={{ color: 'var(--figma-text-secondary)' }}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
