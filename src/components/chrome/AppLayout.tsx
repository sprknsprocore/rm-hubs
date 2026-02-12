import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import LeftNav, { type Domain } from './LeftNav'
import TopRail from './TopRail'
import ResourceManagementHeader from './ResourceManagementHeader'
import NextBestActionDrawer from './NextBestActionDrawer'
import QuickCreateFAB from './QuickCreateFAB'
import HeavyCivilHub from '../personas/HeavyCivil/HeavyCivilHub'
import GecoHub from '../personas/Geco/GecoHub'
import EngineeringHub from '../personas/EngineeringPlanner/EngineeringHub'
import UnifiedDomainGrid, { type GridDomain } from '../domains/UnifiedDomainGrid'
import type { Persona } from '../../types/lem'
import { getNextBestActions, getUnifiedLemPayload, getProjectList, getCompanyList } from '../../api/mockLemApi'

const VALID_DOMAIN = new Set<Domain>(['hub', 'timesheets', 'materials', 'resourcePlanning', 'equipment'])

function domainFromSearchParams(searchParams: URLSearchParams): Domain {
  const d = searchParams.get('domain')
  return (d && VALID_DOMAIN.has(d as Domain)) ? (d as Domain) : 'hub'
}
import { parseNlQuery } from '../../api/nlSearch'
import { runDashboardTour, stopDashboardTour } from '../../tour/dashboardTour'

export default function AppLayout() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [persona, setPersona] = useState<Persona>('heavyCivil')
  const domain = domainFromSearchParams(searchParams)
  const [nlQuery, setNlQuery] = useState('')
  const [actionsPanelOpen, setActionsPanelOpen] = useState(false)
  const [navExpanded, setNavExpanded] = useState(true)
  const [selectedCompanyId, setSelectedCompanyId] = useState('miller-design')
  const [isTourActive, setIsTourActive] = useState(false)
  const tourTriggeredRef = useRef(false)
  const nextBestActions = getNextBestActions()
  const projectList = useMemo(() => getProjectList(), [])
  const companyList = useMemo(() => getCompanyList(), [])
  const currentWorkspaceLabel = companyList.find((c) => c.id === selectedCompanyId)?.name ?? 'Miller Design'
  const unifiedPayload = useMemo(() => getUnifiedLemPayload(), [])
  const nlFilter = useMemo(
    () => parseNlQuery(nlQuery, unifiedPayload),
    [nlQuery, unifiedPayload]
  )

  const handleProjectChange = (projectId: string | null) => {
    if (projectId) navigate(`/project/${projectId}`)
    else navigate('/')
  }

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId)
  }

  const showHub = domain === 'hub'
  const showUnifiedGrid = !showHub
  const showActionsBar = domain !== 'timesheets'
  const showResourceManagementHeader = domain === 'hub'

  useEffect(() => {
    if (tourTriggeredRef.current) return
    const params = new URLSearchParams(window.location.search)
    if (params.get('tour') === '1' || params.get('walkthrough') === '1') {
      tourTriggeredRef.current = true
      setIsTourActive(true)
      runDashboardTour({ onClose: () => setIsTourActive(false) })
    }
  }, [])

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--figma-bg-depth1)' }}>
      <aside className="hidden h-screen shrink-0 md:block" aria-hidden="true" style={{ height: '100vh' }}>
        <LeftNav currentWorkspaceLabel={currentWorkspaceLabel} expanded={navExpanded} />
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <TopRail
          nlQuery={nlQuery}
          onNlQueryChange={setNlQuery}
          persona={persona}
          onPersonaChange={setPersona}
          selectedProjectId={null}
          selectedCompanyId={selectedCompanyId}
          projectList={projectList}
          onProjectChange={handleProjectChange}
          onCompanyChange={handleCompanyChange}
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
                projectData={null}
              />
            )}
            {showUnifiedGrid && (domain === 'timesheets' || domain === 'materials') ? (
              <div className="w-full">
                <div className="pb-4 pt-4 md:pb-6 md:pt-5" data-tour="hub-content">
                  <UnifiedDomainGrid
                    domain={domain as GridDomain}
                    nlFilter={nlFilter}
                  />
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-7xl px-0">
                <div className="pb-4 pt-4 md:pb-6 md:pt-5" data-tour="hub-content">
                  {showHub && (
                    <>
                      {persona === 'heavyCivil' && <HeavyCivilHub nlFilter={nlFilter} />}
                      {persona === 'geco' && <GecoHub nlFilter={nlFilter} />}
                      {persona === 'engineering' && <EngineeringHub nlFilter={nlFilter} />}
                    </>
                  )}
                  {showUnifiedGrid && (
                    <UnifiedDomainGrid
                      domain={domain as GridDomain}
                      nlFilter={nlFilter}
                    />
                  )}
                </div>
              </div>
            )}
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
            items={nextBestActions}
            open={actionsPanelOpen}
            onToggle={() => setActionsPanelOpen((prev) => !prev)}
            hideTriggerWhenClosed
          />
        )}
      </div>
      <QuickCreateFAB persona={persona} actionsDrawerOpen={showActionsBar && actionsPanelOpen} />
    </div>
  )
}
