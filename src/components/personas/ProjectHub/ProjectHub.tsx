import { useNavigate } from 'react-router-dom'
import BentoGrid, { BentoCell } from '../../layout/BentoGrid'
import WbsProductivityHeatmap from './WbsProductivityHeatmap'
import GoldenThreadTimeline from './GoldenThreadTimeline'
import MaterialYieldWatch from './MaterialYieldWatch'
import ProjectProductionHealthCard from './ProjectProductionHealthCard'
import CycleTimeCard from './CycleTimeCard'
import MilestoneBufferCard from './MilestoneBufferCard'
import SkillsetGapCard from './SkillsetGapCard'
import TrueUpReconciliationDrawer from '../../reconciliation/TrueUpReconciliationDrawer'
import type { ProjectData } from '../../../types/lem'
import type { Persona } from '../../../types/lem'

interface ProjectHubProps {
  projectData: ProjectData
  persona: Persona
  onOpenTrueUp: (rowId: string) => void
  /** Open True-Up drawer without a selected row (e.g. Reconcile Load Counts). */
  onReconcileLoadCounts?: () => void
  trueUpDrawerOpen: boolean
  selectedCostCodeRowId: string | null
  onCloseTrueUp: () => void
  onSelectRowInTrueUp: (rowId: string | null) => void
}

export default function ProjectHub({
  projectData,
  persona,
  onOpenTrueUp,
  onReconcileLoadCounts,
  trueUpDrawerOpen,
  selectedCostCodeRowId,
  onCloseTrueUp,
  onSelectRowInTrueUp,
}: ProjectHubProps) {
  const navigate = useNavigate()
  const openDrawerForLoadCounts = onReconcileLoadCounts ?? (() => {
    const firstId = projectData.reconciliationRows[0]?.id
    if (firstId) onOpenTrueUp(firstId)
  })

  // Persona A: Heavy Civil PM — Overview of Labor, Materials, Equipment + Golden Thread
  if (persona === 'heavyCivil') {
    return (
      <>
        <BentoGrid columns={2} rows="hero-action">
          <BentoCell span={2}>
            <div data-tour="card-material-yield-watch" className="flex min-h-0 flex-1 flex-col">
              <MaterialYieldWatch
                materialUsage={projectData.materialUsage}
                onReview={() => navigate(`/project/${projectData.projectId}?domain=materials`)}
              />
            </div>
          </BentoCell>
          <BentoCell span={1}>
            <div data-tour="card-project-production-health" className="flex min-h-0 flex-1 flex-col">
              <ProjectProductionHealthCard projectData={projectData} />
            </div>
          </BentoCell>
          <BentoCell span={1}>
            <div data-tour="card-cycle-time" className="flex min-h-0 flex-1 flex-col">
              <CycleTimeCard projectData={projectData} onReconcileLoadCounts={openDrawerForLoadCounts} />
            </div>
          </BentoCell>
          <BentoCell span={2}>
            <div data-tour="card-golden-thread" className="flex min-h-0 flex-1 flex-col">
              <GoldenThreadTimeline fieldLogs={projectData.fieldLogs} />
            </div>
          </BentoCell>
        </BentoGrid>
        <TrueUpReconciliationDrawer
          open={trueUpDrawerOpen}
          onClose={onCloseTrueUp}
          projectId={projectData.projectId}
          projectName={projectData.projectName}
          reconciliationRows={projectData.reconciliationRows}
          selectedRowId={selectedCostCodeRowId}
          onSelectRow={onSelectRowInTrueUp}
        />
      </>
    )
  }

  // Persona B: Enterprise Specialty PM — WBS Heatmap, Golden Thread, Production Health, True-Up Hours
  if (persona === 'geco') {
    return (
      <>
        <BentoGrid columns={2} rows="hero-action">
          <BentoCell span={2}>
            <div data-tour="card-wbs-heatmap" className="flex min-h-0 flex-1 flex-col">
              <WbsProductivityHeatmap
                wbsCodes={projectData.wbsCodes}
                onSelectCode={(rowId) => onOpenTrueUp(rowId)}
              />
            </div>
          </BentoCell>
          <BentoCell span={1}>
            <div data-tour="card-project-production-health" className="flex min-h-0 flex-1 flex-col">
              <ProjectProductionHealthCard projectData={projectData} />
            </div>
          </BentoCell>
          <BentoCell span={1}>
            <div data-tour="card-golden-thread" className="flex min-h-0 flex-1 flex-col">
              <GoldenThreadTimeline fieldLogs={projectData.fieldLogs} />
            </div>
          </BentoCell>
          <BentoCell span={2}>
            <div data-tour="card-material-yield-watch" className="flex min-h-0 flex-1 flex-col">
              <MaterialYieldWatch
                materialUsage={projectData.materialUsage}
                onReview={() => navigate(`/project/${projectData.projectId}?domain=materials`)}
              />
            </div>
          </BentoCell>
        </BentoGrid>
        <TrueUpReconciliationDrawer
          open={trueUpDrawerOpen}
          onClose={onCloseTrueUp}
          projectId={projectData.projectId}
          projectName={projectData.projectName}
          reconciliationRows={projectData.reconciliationRows}
          selectedRowId={selectedCostCodeRowId}
          onSelectRow={onSelectRowInTrueUp}
        />
      </>
    )
  }

  // Persona C: Technical Planner — Milestone Buffer, Skillset Gap, Assign from Smart Bench
  return (
    <>
      <BentoGrid columns={2} rows="hero-action">
        <BentoCell span={2}>
          <div data-tour="card-wbs-heatmap" className="flex min-h-0 flex-1 flex-col">
            <WbsProductivityHeatmap
              wbsCodes={projectData.wbsCodes}
              onSelectCode={(rowId) => onOpenTrueUp(rowId)}
            />
          </div>
        </BentoCell>
        <BentoCell span={1}>
          <div data-tour="card-milestone-buffer" className="flex min-h-0 flex-1 flex-col">
            <MilestoneBufferCard projectData={projectData} />
          </div>
        </BentoCell>
        <BentoCell span={1}>
          <div data-tour="card-skillset-gap" className="flex min-h-0 flex-1 flex-col">
            <SkillsetGapCard
              projectData={projectData}
              onAssignFromSmartBench={() => navigate('/')}
            />
          </div>
        </BentoCell>
        <BentoCell span={2}>
          <div data-tour="card-golden-thread" className="flex min-h-0 flex-1 flex-col">
            <GoldenThreadTimeline fieldLogs={projectData.fieldLogs} />
          </div>
        </BentoCell>
      </BentoGrid>
      <TrueUpReconciliationDrawer
        open={trueUpDrawerOpen}
        onClose={onCloseTrueUp}
        projectId={projectData.projectId}
        projectName={projectData.projectName}
        reconciliationRows={projectData.reconciliationRows}
        selectedRowId={selectedCostCodeRowId}
        onSelectRow={onSelectRowInTrueUp}
      />
    </>
  )
}
