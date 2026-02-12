import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import LeftNav, { type Domain } from './LeftNav'
import TopRail from './TopRail'
import ResourceManagementHeader from './ResourceManagementHeader'
import InsightsSidebar from './InsightsSidebar'
import QuickCreateFAB from './QuickCreateFAB'
import HeavyCivilHub from '../personas/HeavyCivil/HeavyCivilHub'
import SpecialtyHub from '../personas/Specialty/SpecialtyHub'
import PlannerHub from '../personas/Planner/PlannerHub'
import UnifiedDomainGrid, { type GridDomain } from '../domains/UnifiedDomainGrid'
import type { Persona } from '../../types/lem'
import { getUnifiedLemPayload, getProjectList, getCompanyList } from '../../api/mockLemApi'

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
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null)
  const [navExpanded, setNavExpanded] = useState(true)
  const [selectedCompanyId, setSelectedCompanyId] = useState('miller-design')
  const [isTourActive, setIsTourActive] = useState(false)
  const tourTriggeredRef = useRef(false)
  const handleExpand = useCallback((insightId: string) => setSelectedInsightId(insightId), [])
  const insightsPanelOpen = selectedInsightId !== null
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
                insightsPanelOpen={insightsPanelOpen}
                onCloseInsights={() => setSelectedInsightId(null)}
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
              <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="pb-4 pt-4 md:pb-6 md:pt-5" data-tour="hub-content">
                  {showHub && (
                    <>
                      {persona === 'heavyCivil' && <HeavyCivilHub nlFilter={nlFilter} onExpand={handleExpand} />}
                      {persona === 'specialty' && <SpecialtyHub nlFilter={nlFilter} onExpand={handleExpand} />}
                      {persona === 'planner' && <PlannerHub nlFilter={nlFilter} onExpand={handleExpand} />}
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
          {insightsPanelOpen && (
            <div
              className="hidden shrink-0 md:block"
              style={{ width: 'var(--figma-drawer-width)' }}
              aria-hidden
            />
          )}
        </div>
        <InsightsSidebar
          selectedInsightId={selectedInsightId}
          onClose={() => setSelectedInsightId(null)}
        />
      </div>
      <QuickCreateFAB persona={persona} actionsDrawerOpen={insightsPanelOpen} />
    </div>
  )
}
