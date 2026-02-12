import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight, Home, Building2, MessageCircle, FileText, Search, Briefcase, Target } from 'lucide-react'
import procoreLogoUrl from '../../assets/procoreLogo.svg'
import procoreHexUrl from '../../assets/procorehex.svg'

export type Domain = 'hub' | 'timesheets' | 'materials' | 'resourcePlanning' | 'equipment'

/** Sub-tools under RESOURCES (Hub). Hub is the section itself; these link to individual tool pages. */
const RESOURCE_MANAGEMENT_ITEMS: { value: Exclude<Domain, 'hub'>; label: string }[] = [
  { value: 'timesheets', label: 'Timesheets' },
  { value: 'materials', label: 'Materials' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'resourcePlanning', label: 'Planning' },
]

const COMMUNICATION_ITEMS: { label: string }[] = [
  { label: 'Messages' },
  { label: 'Meetings' },
  { label: 'Notifications' },
]

const PROJECT_EXECUTION_ITEMS: { label: string }[] = [
  { label: 'Tasks' },
  { label: 'Schedule' },
  { label: 'Deliverables' },
]

function useHubBasePath(): string {
  const { pathname } = useLocation()
  const match = pathname.match(/^\/project\/([^/?#]+)/)
  return match ? `/project/${match[1]}` : '/'
}

function useCurrentDomain(): Domain {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const d = params.get('domain')
  if (d === 'timesheets' || d === 'materials' || d === 'resourcePlanning' || d === 'equipment' || d === 'hub') return d
  return 'hub'
}

interface LeftNavProps {
  /** Current company or project name – shown at top of sidebar (Figma: context display) */
  currentWorkspaceLabel?: string
  /** When false, sidebar is collapsed to icon-only width */
  expanded?: boolean
}

export default function LeftNav({ currentWorkspaceLabel, expanded = true }: LeftNavProps = {}) {
  const location = useLocation()
  const [resourceManagementOpen, setResourceManagementOpen] = useState(true)
  const [communicationOpen, setCommunicationOpen] = useState(true)
  const [projectExecutionOpen, setProjectExecutionOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const basePath = useHubBasePath()
  const currentDomain = useCurrentDomain()

  // LeftNav only renders inside Resource Management layouts, so Resources is always the active section.
  // Home is a placeholder for Procore company home — never the active page here.
  const isCompanyHome = false
  const isResourcesSectionActive = true

  const getDomainPath = (domain: Domain) =>
    domain === 'hub' ? basePath : `${basePath}${basePath.includes('?') ? '&' : '?'}domain=${domain}`

  const navWidth = expanded ? 'var(--figma-nav-width-expanded)' : 'var(--figma-nav-width)'

  return (
    <aside
      className="flex h-full flex-col border-r"
      style={{
        width: navWidth,
        minWidth: navWidth,
        height: '100vh',
        backgroundColor: 'var(--figma-bg-nav)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
      aria-label="Main navigation"
    >
      {/* Logo row */}
      <div
        className={`flex h-14 shrink-0 items-center border-b py-3 ${expanded ? 'px-3' : 'justify-center px-0'}`}
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        {expanded ? (
          <img
            src={procoreLogoUrl}
            alt="Procore"
            className="h-8 w-full max-w-[140px] object-contain object-left"
          />
        ) : (
          <img
            src={procoreHexUrl}
            alt="Procore"
            className="h-6 w-6 shrink-0 object-contain"
          />
        )}
      </div>

      {/* Current context (Figma: Miller Design at top of sidebar) */}
      {currentWorkspaceLabel && (
        <div
          className={`flex shrink-0 items-center gap-2 border-b py-2.5 ${expanded ? 'px-3' : 'justify-center px-0'}`}
          style={{ height: '56px', borderColor: 'rgba(255,255,255,0.08)', color: 'var(--figma-topbar-text)' }}
        >
          <Briefcase className="h-4 w-4 shrink-0" style={{ color: 'var(--figma-topbar-text-muted)' }} aria-hidden />
          {expanded && <span className="truncate text-sm font-medium">{currentWorkspaceLabel}</span>}
        </div>
      )}

      {/* Search Project Tools */}
      <div className={`shrink-0 py-3 ${expanded ? 'px-2' : 'flex justify-center px-0'}`}>
        {expanded ? (
          <div className="relative flex items-center rounded border" style={{ borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Project Tools"
              className="w-full bg-transparent py-2 pl-3 pr-9 text-sm placeholder-white/50 focus:outline-none"
              style={{ color: 'rgba(255,255,255,0.9)' }}
              aria-label="Search project tools"
            />
            <Search className="absolute right-2.5 h-4 w-4 shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }} aria-hidden />
          </div>
        ) : (
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-white/10"
            style={{ color: 'rgba(255,255,255,0.7)' }}
            aria-label="Search project tools"
          >
            <Search className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Home, Conversations, Documents */}
      <nav className={`flex shrink-0 flex-col border-b py-1 ${expanded ? '' : 'items-center'}`} style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <Link
          to="/"
          className={`flex items-center py-2.5 text-sm transition-colors hover:bg-white/10 ${expanded ? 'gap-3 px-3' : 'justify-center w-full px-0'}`}
          style={{
            height: '44px',
            color: isCompanyHome ? 'white' : 'rgba(255,255,255,0.7)',
            backgroundColor: isCompanyHome ? 'rgba(255,255,255,0.12)' : undefined,
          }}
        >
          <Home className="h-4 w-4 shrink-0" />
          {expanded && <span>Home</span>}
        </Link>
        <button
          type="button"
          className={`flex w-full items-center text-left text-sm transition-colors hover:bg-white/10 ${expanded ? 'gap-3 px-3 py-2.5' : 'justify-center py-2.5 px-0'}`}
          style={{ height: '44px', color: 'rgba(255,255,255,0.7)' }}
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          {expanded && (
            <>
              <span className="min-w-0 flex-1 truncate">Conversations</span>
              <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-medium" style={{ backgroundColor: 'var(--figma-error)', color: 'white' }}>13</span>
            </>
          )}
        </button>
        <button
          type="button"
          className={`flex items-center text-left text-sm transition-colors hover:bg-white/10 ${expanded ? 'gap-3 px-3 py-2.5' : 'justify-center w-full py-2.5 px-0'}`}
          style={{ height: '44px', color: 'rgba(255,255,255,0.7)' }}
        >
          <FileText className="h-4 w-4 shrink-0" />
          {expanded && <span>Documents</span>}
        </button>
      </nav>

      {/* Collapsible: RESOURCES, Communication, Project Execution */}
      <nav className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden py-2">
        <div className={expanded ? 'px-2' : 'flex justify-center px-0'} data-tour="leftnav-resources">
          <div
            className={`flex w-full items-center rounded py-2 text-left transition-colors hover:bg-white/10 ${expanded ? 'gap-2 px-2' : 'justify-center px-0'}`}
            style={{
              height: '44px',
              color: isResourcesSectionActive ? 'white' : 'rgba(255,255,255,0.9)',
              backgroundColor: isResourcesSectionActive ? 'rgba(255,255,255,0.12)' : undefined,
            }}
          >
            {expanded && (
              <button
                type="button"
                onClick={() => setResourceManagementOpen((o) => !o)}
                className="flex shrink-0 items-center justify-center rounded p-0.5 transition-colors hover:bg-white/10"
                aria-expanded={resourceManagementOpen}
                aria-label={resourceManagementOpen ? 'Collapse Resources' : 'Expand Resources'}
              >
                {resourceManagementOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
              </button>
            )}
            <Link
              to={getDomainPath('hub')}
              className={`flex min-w-0 flex-1 items-center gap-2 rounded py-1 transition-colors ${expanded ? '' : 'justify-center'}`}
            >
              <Building2 className="h-4 w-4 shrink-0" style={{ color: 'var(--figma-topbar-text-muted)' }} aria-hidden />
              {expanded && <span className="text-[11px] font-semibold uppercase tracking-wider">Resources</span>}
            </Link>
          </div>
          {expanded && resourceManagementOpen && (
            <ul className="mt-0.5 space-y-0.5">
              {RESOURCE_MANAGEMENT_ITEMS.map(({ value, label }) => {
                const path = getDomainPath(value)
                const isActive =
                  currentDomain === value ||
                  (value === 'equipment' && location.pathname === '/workflow/off-rent-idle')
                return (
                  <li key={value}>
                    <Link
                      to={path}
                      className="flex items-center gap-2 rounded py-2 pl-14 pr-2 text-sm transition-colors hover:bg-white/10 hover:text-white"
                      style={{
                        backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : undefined,
                        color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                      }}
                    >
                      <span className="min-w-0 flex-1 truncate">{label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        <div className={expanded ? 'px-2' : 'flex justify-center px-0'}>
          <button
            type="button"
            onClick={() => setCommunicationOpen((o) => !o)}
            className={`flex w-full items-center rounded py-2 text-left transition-colors hover:bg-white/10 ${expanded ? 'gap-2 px-2' : 'justify-center px-0'}`}
            style={{ color: 'rgba(255,255,255,0.9)' }}
            aria-expanded={expanded ? communicationOpen : undefined}
          >
            {expanded && (communicationOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />)}
            <MessageCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--figma-topbar-text-muted)' }} aria-hidden />
            {expanded && <span className="text-[11px] font-semibold uppercase tracking-wider">Communication</span>}
          </button>
          {expanded && communicationOpen && (
            <ul className="mt-0.5 space-y-0.5">
              {COMMUNICATION_ITEMS.map(({ label }) => (
                <li key={label}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded py-2 pl-14 pr-2 text-left text-sm transition-colors hover:bg-white/10 hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    <span className="min-w-0 flex-1 truncate">{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={expanded ? 'px-2' : 'flex justify-center px-0'}>
          <button
            type="button"
            onClick={() => setProjectExecutionOpen((o) => !o)}
            className={`flex w-full items-center rounded py-2 text-left transition-colors hover:bg-white/10 ${expanded ? 'gap-2 px-2' : 'justify-center px-0'}`}
            style={{ height: '55px', color: 'rgba(255,255,255,0.9)' }}
            aria-expanded={expanded ? projectExecutionOpen : undefined}
          >
            {expanded && (projectExecutionOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />)}
            <Target className="h-4 w-4 shrink-0" style={{ color: 'var(--figma-topbar-text-muted)' }} aria-hidden />
            {expanded && <span className="text-[11px] font-semibold uppercase tracking-wider">Project Execution</span>}
          </button>
          {expanded && projectExecutionOpen && (
            <ul className="mt-0.5 space-y-0.5">
              {PROJECT_EXECUTION_ITEMS.map(({ label }) => (
                <li key={label}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded py-2 pl-14 pr-2 text-left text-sm transition-colors hover:bg-white/10 hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    <span className="min-w-0 flex-1 truncate">{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      {/* Profile */}
      <div
        className={`mt-auto flex shrink-0 flex-row items-center border-t py-4 ${expanded ? 'gap-3 px-3' : 'justify-center px-0'}`}
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: 'var(--figma-nav-avatar-bg)' }}
          aria-hidden
        >
          LR
        </div>
        {expanded && (
          <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
            <span className="truncate text-left text-sm font-medium" style={{ color: 'var(--figma-topbar-text)' }}>
              Lisa Rodriguez
            </span>
            <button
              type="button"
              className="text-left text-xs font-medium transition-colors hover:underline"
              style={{ color: 'var(--figma-topbar-text-muted)' }}
            >
              View Profile
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
