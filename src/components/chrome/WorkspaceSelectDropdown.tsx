import { useState, useRef, useEffect } from 'react'
import { Briefcase, Check, Search } from 'lucide-react'
import { getCompanyList, getProjectList } from '../../api/mockLemApi'

type FilterPill = 'All' | 'Active' | 'Planning' | 'Inactive'

interface WorkspaceSelectDropdownProps {
  open: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLElement | null>
  /** When null, company view (show selected company). When set, project view. */
  selectedProjectId: string | null
  selectedCompanyId?: string
  onSelectCompany: (companyId: string) => void
  onSelectProject: (projectId: string | null) => void
}

const PROJECT_LOCATIONS: Record<string, string> = {
  'building-a': 'San Francisco, CA',
  'seattle-corridor': 'Seattle, WA',
  'skyline': 'San Francisco, CA',
  'metro-mall': 'Seattle, WA',
  'harbor-view': 'Portland, OR',
}

export default function WorkspaceSelectDropdown({
  open,
  onClose,
  anchorRef,
  selectedProjectId,
  selectedCompanyId = 'miller-design',
  onSelectCompany,
  onSelectProject,
}: WorkspaceSelectDropdownProps) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterPill>('All')
  const panelRef = useRef<HTMLDivElement>(null)

  const companies = getCompanyList()
  const projects = getProjectList()

  const filteredCompanies = companies.filter((c) =>
    search ? c.name.toLowerCase().includes(search.toLowerCase()) : true
  )
  const filteredProjects = projects.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'All') return true
    if (filter === 'Active') return p.status === 'active'
    if (filter === 'Planning') return p.status === 'precon' || p.status === 'active'
    if (filter === 'Inactive') return p.status === 'off_track' || p.status === 'complete'
    return true
  })

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, onClose, anchorRef])

  if (!open) return null

  const anchorRect = anchorRef.current?.getBoundingClientRect()

  return (
    <div
      ref={panelRef}
      className="fixed z-[1200] overflow-hidden rounded-lg border shadow-lg"
      style={{
        top: (anchorRect?.bottom ?? 0) + 4,
        left: anchorRect?.left ?? 0,
        width: Math.max(anchorRect?.width ?? 320, 360),
        maxWidth: 'min(420px, calc(100vw - 24px))',
        backgroundColor: 'var(--figma-dropdown-bg)',
        borderColor: 'var(--figma-bg-outline)',
      }}
      role="dialog"
      aria-label="Select workspace or project"
    >
      <div className="border-b p-3" style={{ borderColor: 'var(--figma-bg-outline)' }}>
        <div className="relative flex items-center rounded border bg-neutral-50">
          <Search className="absolute left-3 h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search workspaces or projects..."
            className="w-full py-2.5 pl-9 pr-3 text-sm placeholder:text-neutral-400 focus:outline-none"
            aria-label="Search workspaces or projects"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(['All', 'Active', 'Planning', 'Inactive'] as const).map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => setFilter(pill)}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                backgroundColor: filter === pill ? 'var(--figma-primary-main)' : 'var(--figma-bg-depth2)',
                color: filter === pill ? 'white' : 'var(--figma-text-secondary)',
              }}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-3">
        <section className="mb-4">
          <h3 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Companies
          </h3>
          <ul className="space-y-0.5">
            {filteredCompanies.map((c) => {
              const isSelected = !selectedProjectId && selectedCompanyId === c.id
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCompany(c.id)
                      onSelectProject(null)
                      onClose()
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-neutral-100"
                    style={{ color: 'var(--figma-text-primary)' }}
                  >
                    <Briefcase className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
                    <span className="min-w-0 flex-1 truncate font-medium">{c.name}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0" style={{ color: 'var(--figma-brand)' }} aria-hidden />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
        <section>
          <h3 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Projects
          </h3>
          <div className="space-y-3">
            <div>
              <h4 className="mb-1 px-1 text-xs font-medium text-neutral-600">Active</h4>
              <ul className="space-y-0.5">
                {filteredProjects.filter((p) => p.status === 'active' || p.status === 'off_track').map((p) => {
                  const isSelected = selectedProjectId === p.id
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProject(p.id)
                          onClose()
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-neutral-100"
                        style={{ color: 'var(--figma-text-primary)' }}
                      >
                        <Briefcase className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
                        <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
                        {PROJECT_LOCATIONS[p.id] && (
                          <span className="shrink-0 text-xs text-neutral-500">{PROJECT_LOCATIONS[p.id]}</span>
                        )}
                        {isSelected && (
                          <Check className="h-4 w-4 shrink-0" style={{ color: 'var(--figma-brand)' }} aria-hidden />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
            {(filter === 'All' || filter === 'Planning') && (
              <div>
                <h4 className="mb-1 px-1 text-xs font-medium text-neutral-600">Planning</h4>
                <ul className="space-y-0.5">
                  {filteredProjects.filter((p) => p.status === 'precon').length === 0 ? (
                    <li className="px-3 py-2 text-xs text-neutral-500">No planning projects</li>
                  ) : (
                    filteredProjects.filter((p) => p.status === 'precon').map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectProject(p.id)
                            onClose()
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-neutral-100"
                          style={{ color: 'var(--figma-text-primary)' }}
                        >
                          <Briefcase className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
                          <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
                          {PROJECT_LOCATIONS[p.id] && (
                            <span className="shrink-0 text-xs text-neutral-500">{PROJECT_LOCATIONS[p.id]}</span>
                          )}
                          {selectedProjectId === p.id && (
                            <Check className="h-4 w-4 shrink-0" style={{ color: 'var(--figma-brand)' }} aria-hidden />
                          )}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
