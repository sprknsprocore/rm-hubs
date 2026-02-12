import { Plus, Search, Wrench, FileStack, Pencil, LayoutGrid } from 'lucide-react'

const icons = [
  { icon: Plus, label: 'Add', primary: true },
  { icon: Search, label: 'Search' },
  { icon: Wrench, label: 'Tools' },
  { icon: FileStack, label: 'Documents' },
  { icon: Pencil, label: 'Edit' },
  { icon: LayoutGrid, label: 'Modules' },
]

export default function HelixRightRail() {
  return (
    <aside
      className="hidden flex-col items-center py-4 md:flex"
      style={{
        width: 'var(--helix-rail-width)',
        backgroundColor: 'var(--helix-bg-card)',
        borderLeft: '1px solid var(--helix-border-card)',
      }}
      aria-label="Tools"
    >
      {icons.map(({ icon: Icon, label, primary }) => (
        <button
          key={label}
          type="button"
          className="mt-2 flex h-9 w-9 items-center justify-center rounded-lg transition-colors first:mt-0"
          style={{
            color: primary ? 'var(--helix-primary)' : 'var(--helix-text-secondary)',
          }}
          aria-label={label}
          title={label}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </aside>
  )
}
