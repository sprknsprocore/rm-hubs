import { type ReactNode } from 'react'
import { Search, Filter } from 'lucide-react'

interface ListToolbarProps {
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  onFilterClick?: () => void
  /** Extra controls between search/filter and right actions (e.g. date range, Configure, segment) */
  leftExtra?: ReactNode
  /** Right-side actions (e.g. Export, Create) */
  rightActions?: ReactNode
}

const toolbarInputStyles = {
  backgroundColor: 'var(--figma-bg-default)',
  borderColor: 'var(--figma-bg-outline)',
  color: 'var(--figma-text-primary)',
}

const toolbarButtonStyles = {
  backgroundColor: 'var(--figma-bg-default)',
  borderColor: 'var(--figma-bg-outline)',
  color: 'var(--figma-text-secondary)',
}

export default function ListToolbar({
  searchPlaceholder = 'Search',
  searchValue,
  onSearchChange,
  onFilterClick,
  leftExtra,
  rightActions,
}: ListToolbarProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-lg border px-4 py-3"
      style={{
        backgroundColor: 'var(--figma-bg-default)',
        borderColor: 'var(--figma-bg-outline)',
      }}
    >
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <input
          type="search"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border py-2 pl-3 pr-9 text-sm focus:outline-none focus:ring-2"
          style={toolbarInputStyles}
          aria-label="Search"
        />
        <Search
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
          style={{ color: 'var(--figma-text-disabled)' }}
          aria-hidden
        />
      </div>
      {onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:opacity-90"
          style={toolbarButtonStyles}
        >
          <Filter className="h-4 w-4" />
          Filter
        </button>
      )}
      {leftExtra}
      {rightActions && (
        <div className="ml-auto flex items-center gap-2">
          {rightActions}
        </div>
      )}
    </div>
  )
}
