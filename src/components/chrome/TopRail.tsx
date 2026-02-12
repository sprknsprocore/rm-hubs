import { useState, useRef } from 'react'
import { ChevronDown, Briefcase, Search, Bell, MessageSquare, PanelLeftClose, PanelLeftOpen, BookOpen, Square } from 'lucide-react'
import PersonaDropdown from '../personas/PersonaDropdown'
import WorkspaceSelectDropdown from './WorkspaceSelectDropdown'
import { getCompanyList, getProjectList } from '../../api/mockLemApi'
import type { Persona } from '../../types/lem'

export interface ProjectOption {
  id: string
  name: string
}

interface TopRailProps {
  nlQuery: string
  onNlQueryChange: (value: string) => void
  persona: Persona
  onPersonaChange: (p: Persona) => void
  /** When set, project view. When null, company view. */
  selectedProjectId?: string | null
  selectedCompanyId?: string
  projectList?: ProjectOption[]
  onProjectChange?: (projectId: string | null) => void
  onCompanyChange?: (companyId: string) => void
  /** Sidebar (left nav) expanded state – used for menu toggle icon */
  sidebarExpanded?: boolean
  onSidebarToggle?: () => void
  /** Walkthrough: active when tour is running */
  isTourActive?: boolean
  onStartTour?: () => void
  onStopTour?: () => void
}

export default function TopRail({
  nlQuery: _nlQuery,
  onNlQueryChange: _onNlQueryChange,
  persona,
  onPersonaChange,
  selectedProjectId,
  selectedCompanyId = 'miller-design',
  projectList = [],
  onProjectChange,
  onCompanyChange,
  sidebarExpanded = true,
  onSidebarToggle,
  isTourActive = false,
  onStartTour,
  onStopTour,
}: TopRailProps) {
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false)
  const [favoriteToolsOpen, setFavoriteToolsOpen] = useState(false)
  const workspaceTriggerRef = useRef<HTMLButtonElement>(null)

  const companies = getCompanyList()
  const projects = projectList.length > 0 ? projectList : getProjectList()
  const selectedCompany = companies.find((c) => c.id === selectedCompanyId)
  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  const workspaceLabel = selectedProject ? selectedProject.name : (selectedCompany?.name ?? 'Select View')
  const showWorkspaceSelector = (projects.length > 0 || companies.length > 0) && (onProjectChange || onCompanyChange)

  return (
    <header
      className="sticky top-0 z-[1100] flex h-[var(--figma-top-height)] items-center border-b px-4 gap-4 md:gap-6"
      style={{
        backgroundColor: 'var(--figma-topbar-bg)',
        borderColor: 'var(--figma-topbar-border)',
      }}
    >
      {/* Sidebar collapse/expand menu toggle (or logo when no toggle handler) */}
      <div className="flex shrink-0 items-center gap-2">
        {onSidebarToggle ? (
          <button
            type="button"
            onClick={onSidebarToggle}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded transition-colors hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/30"
            style={{ color: 'var(--figma-topbar-text)' }}
            aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarExpanded ? (
              <PanelLeftClose className="h-5 w-5" aria-hidden />
            ) : (
              <PanelLeftOpen className="h-5 w-5" aria-hidden />
            )}
          </button>
        ) : (
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded"
            style={{ backgroundColor: 'var(--figma-brand)' }}
            aria-hidden
          >
            <span className="text-sm font-bold text-white">P</span>
          </div>
        )}
      </div>

      {/* Workspace / Company selector – opens dropdown panel */}
      {showWorkspaceSelector && (
        <div className="relative flex shrink-0 items-center" data-tour="workspace-selector">
          <button
            ref={workspaceTriggerRef}
            type="button"
            onClick={() => setWorkspaceDropdownOpen((o) => !o)}
            className="flex min-w-0 items-center gap-2 rounded border py-2 pl-3 pr-2 text-left text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
            style={{
              maxWidth: 280,
              backgroundColor: 'var(--figma-topbar-select-bg)',
              borderColor: 'var(--figma-topbar-border)',
              color: 'var(--figma-topbar-text)',
            }}
            aria-haspopup="dialog"
            aria-expanded={workspaceDropdownOpen}
            aria-label="Select workspace or project"
          >
            <Briefcase className="h-4 w-4 shrink-0" style={{ color: 'var(--figma-topbar-text-muted)' }} aria-hidden />
            <span className="min-w-0 truncate">{workspaceLabel}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform ${workspaceDropdownOpen ? 'rotate-180' : ''}`}
              style={{ color: 'var(--figma-topbar-text-muted)' }}
              aria-hidden
            />
          </button>
          <WorkspaceSelectDropdown
            open={workspaceDropdownOpen}
            onClose={() => setWorkspaceDropdownOpen(false)}
            anchorRef={workspaceTriggerRef}
            selectedProjectId={selectedProjectId ?? null}
            selectedCompanyId={selectedCompanyId}
            onSelectCompany={(id) => onCompanyChange?.(id)}
            onSelectProject={(id) => onProjectChange?.(id ?? null)}
          />
        </div>
      )}

      {/* Favorite Tools Overview dropdown */}
      <button
        type="button"
        onClick={() => setFavoriteToolsOpen((o) => !o)}
        className="flex shrink-0 items-center gap-1.5 rounded border py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
        style={{
          backgroundColor: 'var(--figma-topbar-select-bg)',
          borderColor: 'var(--figma-topbar-border)',
          color: 'var(--figma-topbar-text-muted)',
        }}
        aria-expanded={favoriteToolsOpen}
        aria-label="Favorite tools overview"
      >
        <span>Favorite Tools Overview</span>
        <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
      </button>

      <div className="flex-1 min-w-4" />

      {/* Right: Search, Notifications, Ask Assist */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded transition-colors hover:bg-white/10"
          style={{ color: 'var(--figma-topbar-text-muted)' }}
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded transition-colors hover:bg-white/10"
          style={{ color: 'var(--figma-topbar-text-muted)' }}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded border py-2 px-3 text-sm font-medium transition-colors hover:bg-white/10"
          style={{
            borderColor: 'var(--figma-topbar-border)',
            color: 'var(--figma-topbar-text)',
          }}
        >
          Ask Assist
          <MessageSquare className="h-4 w-4 shrink-0" aria-hidden />
        </button>
        {(onStartTour || onStopTour) && (
          <button
            type="button"
            onClick={isTourActive ? onStopTour : onStartTour}
            className="flex items-center gap-1.5 rounded border py-2 px-3 text-sm font-medium transition-colors hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/30"
            style={{
              backgroundColor: isTourActive ? 'rgba(255,255,255,0.15)' : 'var(--figma-topbar-select-bg)',
              borderColor: 'var(--figma-topbar-border)',
              color: 'var(--figma-topbar-text)',
            }}
            aria-label={isTourActive ? 'Stop walkthrough' : 'Start walkthrough'}
          >
            {isTourActive ? (
              <>
                <Square className="h-4 w-4 shrink-0" aria-hidden />
                <span>Stop tour</span>
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
                <span>Guide</span>
              </>
            )}
          </button>
        )}
        <div data-tour="persona-switcher">
          <PersonaDropdown value={persona} onChange={onPersonaChange} variant="dark" />
        </div>
      </div>
    </header>
  )
}
