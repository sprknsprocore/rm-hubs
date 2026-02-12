interface DataTableHeaderCellProps {
  label: string
  showCheckbox?: boolean
  className?: string
  /** Match alignment of cell content (default: left) */
  align?: 'left' | 'right' | 'center'
}

export default function DataTableHeaderCell({ label, showCheckbox = false, className = '', align = 'left' }: DataTableHeaderCellProps) {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
  const innerAlignClass = align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : ''
  return (
    <th
      className={`min-w-0 whitespace-normal px-4 py-3 text-xs font-semibold uppercase tracking-wider ${alignClass} ${className}`.trim()}
      style={{ color: 'var(--figma-text-secondary)' }}
    >
      <span className={`inline-flex flex-wrap items-center gap-x-1 gap-y-0.5 ${innerAlignClass}`.trim()}>
        {showCheckbox && (
          <input
            type="checkbox"
            className="h-4 w-4 shrink-0 rounded border"
            style={{ borderColor: 'var(--figma-bg-outline)' }}
            aria-label="Select all"
          />
        )}
        <span className="break-words">{label}</span>
      </span>
    </th>
  )
}
