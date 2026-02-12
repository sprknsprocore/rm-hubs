import { ArrowUpDown } from 'lucide-react'

interface SortableThProps {
  label: string
  className?: string
}

export default function SortableTh({ label, className = '' }: SortableThProps) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${className}`}
      style={{ color: 'var(--figma-text-secondary)' }}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3.5 w-3.5 opacity-70" />
      </span>
    </th>
  )
}
