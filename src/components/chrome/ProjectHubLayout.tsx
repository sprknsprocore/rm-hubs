import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import LeftNav from './LeftNav'
import TopRail from './TopRail'
import { type Domain } from './LeftNav'
import ResourceManagementHeader from './ResourceManagementHeader'
import NextBestActionDrawer from './NextBestActionDrawer'
import ProjectHub from '../personas/ProjectHub/ProjectHub'
import type { Persona } from '../../types/lem'
import type { NextBestAction } from '../../types/lem'
import { getProjectList, getProjectData, getUnifiedLemPayload } from '../../api/mockLemApi'
import { parseNlQuery } from '../../api/nlSearch'
import { runDashboardTour, stopDashboardTour } from '../../tour/dashboardTour'
import UnifiedDomainGrid, { type GridDomain } from '../domains/UnifiedDomainGrid'

export default function ProjectHubLayout() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const domain = (() => {
    const d = searchParams.get('domain')
    if (d === 'timesheets' || d === 'materials' || d === 'resourcePlanning' || d === 'equipment' || d === 'hub') return d
    return 'hub'
  })() as Domain
  const [nlQuery, setNlQuery] = useState('')
  const [persona, setPersona] = useState<Persona>('heavyCivil')
  const [navExpanded, setNavExpanded] = useState(true)
  const [actionsPanelOpen, setActionsPanelOpen] = useState(false)
  const [trueUpDrawerOpen, setTrueUpDrawerOpen] = useState(false)
  const [selectedCostCodeRowId, setSelectedCostCodeRowId] = useState<string | null>(null)
  const [isTourActive, setIsTourActive] = useState(false)
  const tourTriggeredRef = useRef(false)

  const effectiveProjectId = projectId ?? getProjectList()[0]?.id ?? ''
  const projectList = useMemo(() => getProjectList(), [])
  const projectData = useMemo(
    () => (effectiveProjectId ? getProjectData(effectiveProjectId) : null),
    [effectiveProjectId]
  )
  const unifiedPayload = useMemo(() => getUnifiedLemPayload(), [])
  const nlFilter = useMemo(() => parseNlQuery(nlQuery, unifiedPayload), [nlQuery, unifiedPayload])

  const handleProjectChange = (projectIdOrNull: string | null) => {
    if (projectIdOrNull) navigate(`/project/${projectIdOrNull}`)
    else navigate('/')
  }

  const showActionsBar = domain !== 'timesheets'
  const showResourceManagementHeader = domain === 'hub'
  const redFlagsAsActions: NextBestAction[] = projectData?.redFlags ?? []

  useEffect(() => {
    if (tourTriggeredRef.current || !effectiveProjectId || !projectData) return
    const params = new URLSearchParams(window.location.search)
    const wantTour = params.get('tour') === '1' || params.get('walkthrough') === '1'
    if (wantTour) {
      tourTriggeredRef.current = true
      setIsTourActive(true)
      runDashboardTour({ onClose: () => setIsTourActive(false) })
    }
  }, [effectiveProjectId, projectData])

  if (!effectiveProjectId || !projectData) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: 'var(--figma-bg-depth1)' }}>
        <p style={{ color: 'var(--figma-text-secondary)' }}>Project not found.</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--figma-bg-depth1)' }}>
      <aside className="hidden h-screen shrink-0 md:block" aria-hidden="true" style={{ height: '100vh' }}>
        <LeftNav currentWorkspaceLabel={projectData.projectName} expanded={navExpanded} />
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <TopRail
          nlQuery={nlQuery}
          onNlQueryChange={setNlQuery}
          persona={persona}
          onPersonaChange={setPersona}
          selectedProjectId={effectiveProjectId}
          selectedCompanyId="miller-design"
          projectList={projectList}
          onProjectChange={handleProjectChange}
          onCompanyChange={() => navigate('/')}
          sidebarExpanded={navExpanded}
          onSidebarToggle={() => setNavExpanded((v) => !v)}
          isTourActive={isTourActive}
          onStartTour={() => {
            setIsTourActive(true)
            runDashboardTour({ onClose: () => setIsTourActive(false) })
          }}
          onStopTour={() => {
            stopDashboardTour()
            setIsTourActive(false)
          }}
        />
        <div className="flex min-h-0 min-w-0 flex-1 flex-row">
          <main
            className="min-h-0 min-w-0 flex-1 overflow-auto"
            style={{ minHeight: 0 }}
          >
            {showResourceManagementHeader && (
              <ResourceManagementHeader
                nlQuery={nlQuery}
                onNlQueryChange={setNlQuery}
                onOpenActions={showActionsBar && !actionsPanelOpen ? () => setActionsPanelOpen(true) : undefined}
                actionsPanelOpen={actionsPanelOpen}
                onToggleActions={() => setActionsPanelOpen((prev) => !prev)}
                showActionsBar={showActionsBar}
                projectData={projectData}
              />
            )}
            <div className="mx-auto max-w-7xl px-4 md:px-6">
              <div className="pb-4 pt-4 md:pb-6 md:pt-5" data-tour="hub-content">
                {domain === 'hub' ? (
                  <motion.div
                    initial={{ scale: 0.98, opacity: 0.96 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  >
                    <ProjectHub
                    projectData={projectData}
                    persona={persona}
                    onOpenTrueUp={(rowId) => {
                      setSelectedCostCodeRowId(rowId)
                      setTrueUpDrawerOpen(true)
                    }}
                    onReconcileLoadCounts={() => {
                      setTrueUpDrawerOpen(true)
                      setSelectedCostCodeRowId(null)
                    }}
                    trueUpDrawerOpen={trueUpDrawerOpen}
                    selectedCostCodeRowId={selectedCostCodeRowId}
                    onCloseTrueUp={() => {
                      setTrueUpDrawerOpen(false)
                      setSelectedCostCodeRowId(null)
                    }}
                    onSelectRowInTrueUp={setSelectedCostCodeRowId}
                  />
                  </motion.div>
                ) : (
                  <UnifiedDomainGrid
                    domain={domain as GridDomain}
                    nlFilter={nlFilter}
                  />
                )}
              </div>
            </div>
          </main>
          {showActionsBar && actionsPanelOpen && (
            <div
              className="hidden shrink-0 md:block"
              style={{ width: 'var(--figma-drawer-width)' }}
              aria-hidden
            />
          )}
        </div>
        {showActionsBar && (
          <NextBestActionDrawer
            items={redFlagsAsActions}
            open={actionsPanelOpen}
            onToggle={() => setActionsPanelOpen((prev) => !prev)}
            hideTriggerWhenClosed
          />
        )}
      </div>
    </div>
  )
}
