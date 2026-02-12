import { useState } from 'react'
import BentoGrid, { BentoCell } from '../../layout/BentoGrid'
import TrueUpReconciliationDrawer from '../../reconciliation/TrueUpReconciliationDrawer'
import type { ProjectData, Persona } from '../../../types/lem'
import { useHubData } from '../../../hooks/useHubData'

// Sandbox card components (reused across hubs)
import PerformanceGauge from '../../sandbox/cards/PerformanceGauge'
import ProductionHealthCard from '../../sandbox/cards/ProductionHealthCard'
import EarthMoverCard from '../../sandbox/cards/EarthMoverCard'
import CycleTimeCard from '../../sandbox/cards/CycleTimeCard'
import MaterialYieldCard from '../../sandbox/cards/MaterialYieldCard'
import WbsHeatmapCard from '../../sandbox/cards/WbsHeatmapCard'
import WeatherRiskCard from '../../sandbox/cards/WeatherRiskCard'
import CriticalMaintenanceCard from '../../sandbox/cards/CriticalMaintenanceCard'
import EarnedValueCard from '../../sandbox/cards/EarnedValueCard'
import BurnCurveCard from '../../sandbox/cards/BurnCurveCard'
import MilestoneTrackerCard from '../../sandbox/cards/MilestoneTrackerCard'
import MissingProductionCard from '../../sandbox/cards/MissingProductionCard'
import DearGcCard from '../../sandbox/cards/DearGcCard'
import PredecessorDelayCard from '../../sandbox/cards/PredecessorDelayCard'
import MilestoneBufferCard from '../../sandbox/cards/MilestoneBufferCard'
import SkillsetGapCard from '../../sandbox/cards/SkillsetGapCard'
import AllocationPlanCard from '../../sandbox/cards/AllocationPlanCard'
import HistoricalBenchmarkCard from '../../sandbox/cards/HistoricalBenchmarkCard'
import GoldenThreadTimelineCard from '../../sandbox/cards/GoldenThreadTimelineCard'

interface ProjectHubProps {
  projectData: ProjectData
  persona: Persona
  onOpenTrueUp: (rowId: string) => void
  onReconcileLoadCounts?: () => void
  trueUpDrawerOpen: boolean
  selectedCostCodeRowId: string | null
  onCloseTrueUp: () => void
  onSelectRowInTrueUp: (rowId: string | null) => void
}

/** Small toggle for variable triggers */
function VarToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-[var(--figma-primary-main)]" />
      {label}
    </label>
  )
}

export default function ProjectHub({
  projectData,
  persona,
  onOpenTrueUp: _onOpenTrueUp,
  onReconcileLoadCounts: _onReconcileLoadCounts,
  trueUpDrawerOpen,
  selectedCostCodeRowId,
  onCloseTrueUp,
  onSelectRowInTrueUp,
}: ProjectHubProps) {
  const data = useHubData()

  // Variable triggers for project-level event cards
  const [showWeather, setShowWeather] = useState(true)
  const [showMaintenance, setShowMaintenance] = useState(true)
  const [showPredecessor, setShowPredecessor] = useState(true)

  const trueUpDrawer = (
    <TrueUpReconciliationDrawer
      open={trueUpDrawerOpen}
      onClose={onCloseTrueUp}
      projectId={projectData.projectId}
      projectName={projectData.projectName}
      reconciliationRows={projectData.reconciliationRows}
      selectedRowId={selectedCostCodeRowId}
      onSelectRow={onSelectRowInTrueUp}
    />
  )

  // ── Persona A: Heavy Civil PM (9 static + 2 variable) ──
  // Removed: BudgetVsActual (covered by Production Health CPI),
  //          DailyHuddle (on company hub), CommandCenterMap (on company hub)
  if (persona === 'heavyCivil') {
    return (
      <>
        <BentoGrid columns={2} rows="hero-action">
          <BentoCell span={2}>
            <div className="flex min-h-0 flex-1 flex-col">
              <ProductionHealthCard data={data.productionHealth} />
            </div>
          </BentoCell>
          <BentoCell>
            <div className="flex min-h-0 flex-1 flex-col">
              <PerformanceGauge data={data.performanceFactor} />
            </div>
          </BentoCell>
          <BentoCell>
            <div className="flex min-h-0 flex-1 flex-col">
              <EarthMoverCard data={data.earthMover} />
            </div>
          </BentoCell>
          <BentoCell>
            <div className="flex min-h-0 flex-1 flex-col">
              <CycleTimeCard data={data.cycleTime} />
            </div>
          </BentoCell>
          <BentoCell>
            <div className="flex min-h-0 flex-1 flex-col">
              <MaterialYieldCard data={data.materialYield} />
            </div>
          </BentoCell>
          <BentoCell span={2}>
            <div className="flex min-h-0 flex-1 flex-col">
              <WbsHeatmapCard data={data.wbsCodes} />
            </div>
          </BentoCell>
          <BentoCell span={2}>
            <div className="flex min-h-0 flex-1 flex-col">
              <GoldenThreadTimelineCard data={data.fieldLogs} />
            </div>
          </BentoCell>
        </BentoGrid>

        {/* Variable cards */}
        <div className="mt-4 flex gap-3 px-1">
          <VarToggle label="Weather" checked={showWeather} onChange={setShowWeather} />
          <VarToggle label="Fault Codes" checked={showMaintenance} onChange={setShowMaintenance} />
        </div>
        {(showWeather || showMaintenance) && (
          <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            {showWeather && <WeatherRiskCard data={data.weatherRisk} />}
            {showMaintenance && <CriticalMaintenanceCard data={data.equipmentFaultCodes} />}
          </div>
        )}
        {trueUpDrawer}
      </>
    )
  }

  // ── Persona B: Specialty Contractor (9 static + 2 variable) ──
  // Removed: PerformanceGauge (redundant with EVM CPI/SPI),
  //          LaborSCurve (overlaps Burn Curve), MaterialYield (on company hub),
  //          GoldenThread (deep-drill, stays in sandbox)
  if (persona === 'specialty') {
    return (
      <>
        <BentoGrid columns={2} rows="hero-action">
          <BentoCell span={2}>
            <div className="flex min-h-0 flex-1 flex-col">
              <EarnedValueCard data={data.earnedValue} />
            </div>
          </BentoCell>
          <BentoCell span={2}>
            <div className="flex min-h-0 flex-1 flex-col">
              <ProductionHealthCard data={data.productionHealth} />
            </div>
          </BentoCell>
          <BentoCell span={2}>
            <div className="flex min-h-0 flex-1 flex-col">
              <BurnCurveCard data={data.burnCurve} />
            </div>
          </BentoCell>
          <BentoCell span={2}>
            <div className="flex min-h-0 flex-1 flex-col">
              <WbsHeatmapCard data={data.wbsCodes} />
            </div>
          </BentoCell>
          <BentoCell>
            <div className="flex min-h-0 flex-1 flex-col">
              <MilestoneTrackerCard data={data.milestones} />
            </div>
          </BentoCell>
          <BentoCell>
            <div className="flex min-h-0 flex-1 flex-col">
              <DearGcCard />
            </div>
          </BentoCell>
          <BentoCell span={2}>
            <div className="flex min-h-0 flex-1 flex-col">
              <MissingProductionCard data={data.missingProduction} />
            </div>
          </BentoCell>
        </BentoGrid>

        {/* Variable cards */}
        <div className="mt-4 flex gap-3 px-1">
          <VarToggle label="Predecessor Delay" checked={showPredecessor} onChange={setShowPredecessor} />
        </div>
        {showPredecessor && (
          <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            <PredecessorDelayCard data={data.predecessorDelay} />
            <MilestoneBufferCard data={data.milestoneBuffer} />
          </div>
        )}
        {trueUpDrawer}
      </>
    )
  }

  // ── Persona C: Engineering Planner (8 static + 2 variable — no change) ──
  return (
    <>
      <BentoGrid columns={2} rows="hero-action">
        <BentoCell span={2}>
          <div className="flex min-h-0 flex-1 flex-col">
            <WbsHeatmapCard data={data.wbsCodes} />
          </div>
        </BentoCell>
        <BentoCell>
          <div className="flex min-h-0 flex-1 flex-col">
            <MilestoneTrackerCard data={data.milestones} />
          </div>
        </BentoCell>
        <BentoCell>
          <div className="flex min-h-0 flex-1 flex-col">
            <PerformanceGauge data={data.performanceFactor} />
          </div>
        </BentoCell>
        <BentoCell>
          <div className="flex min-h-0 flex-1 flex-col">
            <MilestoneBufferCard data={data.milestoneBuffer} />
          </div>
        </BentoCell>
        <BentoCell>
          <div className="flex min-h-0 flex-1 flex-col">
            <SkillsetGapCard data={data.skillsetGap} />
          </div>
        </BentoCell>
        <BentoCell>
          <div className="flex min-h-0 flex-1 flex-col">
            <AllocationPlanCard data={data.allocationPlan} />
          </div>
        </BentoCell>
        <BentoCell>
          <div className="flex min-h-0 flex-1 flex-col">
            <HistoricalBenchmarkCard data={data.historicalBenchmark} />
          </div>
        </BentoCell>
        <BentoCell span={2}>
          <div className="flex min-h-0 flex-1 flex-col">
            <GoldenThreadTimelineCard data={data.fieldLogs} />
          </div>
        </BentoCell>
      </BentoGrid>

      {/* Variable cards */}
      <div className="mt-4 flex gap-3 px-1">
        <VarToggle label="Predecessor Delay" checked={showPredecessor} onChange={setShowPredecessor} />
      </div>
      {showPredecessor && (
        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
          <PredecessorDelayCard data={data.predecessorDelay} />
          <MilestoneBufferCard data={data.milestoneBuffer} />
        </div>
      )}
      {trueUpDrawer}
    </>
  )
}
