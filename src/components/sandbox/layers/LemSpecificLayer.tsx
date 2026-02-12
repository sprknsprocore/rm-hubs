import BentoGrid, { BentoCell } from '../../layout/BentoGrid'
import SandboxCard from '../SandboxCard'
import CardDescriptor from '../CardDescriptor'
import LayerSection from '../LayerSection'
import LaborSCurveCard from '../cards/LaborSCurveCard'
import EquipmentUtilizationCard from '../cards/EquipmentUtilizationCard'
import MaterialYieldCard from '../cards/MaterialYieldCard'
import AllocationPlanCard from '../cards/AllocationPlanCard'
import UtilizationTrendCard from '../cards/UtilizationTrendCard'
import CommandCenterMapCard from '../cards/CommandCenterMapCard'
import EarthMoverCard from '../cards/EarthMoverCard'
import MilestoneTrackerCard from '../cards/MilestoneTrackerCard'
import CapacityDemandCard from '../cards/CapacityDemandCard'
import CycleTimeCard from '../cards/CycleTimeCard'
import WbsHeatmapCard from '../cards/WbsHeatmapCard'
import type { HubData, SandboxPersona } from '../../../hooks/useHubData'

interface LemSpecificLayerProps {
  data: HubData
  persona: SandboxPersona
}

export default function LemSpecificLayer({ data, persona }: LemSpecificLayerProps) {
  return (
    <LayerSection
      layerNumber={2}
      label="LEM Specific"
      subtitle="Domain Health — Labor, Equipment, and Materials monitoring"
    >
      <BentoGrid columns={3}>
        <SandboxCard cardId="laborSCurve" persona={persona}>
          <CardDescriptor
            value="The earliest indicator of labor productivity problems. When the Actual line diverges from Planned, it reveals sandbagging, scope creep, or crew inefficiency weeks before cost reports surface it."
            audience="Project Managers, General Superintendents, Labor Coordinators."
          >
            <LaborSCurveCard data={data.laborSCurve} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="equipmentUtilization" persona={persona}>
          <CardDescriptor
            value="Reveals wasted rental spend at a glance. Equipment parked on-site but not running is money burning — this dial quantifies the gap so you can off-rent or redeploy before month-end."
            audience="Equipment Managers, Heavy Civil PMs, Fleet Coordinators."
          >
            <EquipmentUtilizationCard data={data.equipmentUtilization} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="materialYield" persona={persona}>
          <CardDescriptor
            value="Compares what was designed vs. what was actually installed. Overages signal waste or rework; underages predict upcoming shortages that will stall the labor schedule."
            audience="Project Managers, Procurement, Estimators."
          >
            <MaterialYieldCard data={data.materialYield} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="allocationPlan" persona={persona}>
          <CardDescriptor
            value="Answers 'do I have enough people next month?' before it becomes a crisis. The gap between Requested and Assigned is a staffing risk you can act on today instead of scrambling later."
            audience="Resource Planners, Operations Directors, Workforce Managers."
          >
            <AllocationPlanCard data={data.allocationPlan} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="utilizationTrend" persona={persona}>
          <CardDescriptor
            value="Shows fleet utilization trending over months, not just a snapshot. Seasonal dips, underperforming periods, and the gap between scheduled and actual utilization all become visible patterns you can plan around."
            audience="Equipment Managers, Heavy Civil PMs, Fleet Operations."
          >
            <UtilizationTrendCard data={data.utilizationTrend} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="cycleTime" persona={persona}>
          <CardDescriptor
            value="Compares actual haul cycles per day vs. the bid estimate. When trucks are below bid, it directly impacts earthwork unit costs — catching it early lets you adjust routes, crew sizes, or haul plans."
            audience="Heavy Civil PMs, Superintendents, Estimators."
          >
            <CycleTimeCard data={data.cycleTime} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="earthMover" persona={persona}>
          <CardDescriptor
            value="Tracks cubic yards moved against the budget target. Falling behind means haul crews may need reinforcement or the sequence plan needs revision — before the entire earthwork schedule cascades."
            audience="Heavy Civil PMs, Superintendents, Equipment Managers."
          >
            <EarthMoverCard data={data.earthMover} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="milestoneTracker" persona={persona}>
          <CardDescriptor
            value="A single view of all major milestone statuses. At-risk or delayed milestones need immediate schedule intervention — this card connects the status to the root cause so PMs can act, not just worry."
            audience="Specialty Contractors, Schedulers, Project Managers."
          >
            <MilestoneTrackerCard data={data.milestones} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="capacityDemand" persona={persona}>
          <CardDescriptor
            value="Forecasts FTE demand by period against current capacity. When demand bars exceed the capacity line, it signals the need to hire or reallocate before the gap becomes a bottleneck that delays multiple projects."
            audience="Resource Planners, Operations Directors, Engineering Planners."
          >
            <CapacityDemandCard data={data.capacityDemand} />
          </CardDescriptor>
        </SandboxCard>
        <BentoCell span={2}>
          <SandboxCard cardId="commandCenterMap" persona={persona}>
            <CardDescriptor
              value="A spatial view of every asset with real-time location and status. Red markers mean idle equipment with active rental spend — giving Equipment Managers the geographic context to coordinate off-rent or transfer decisions."
              audience="Equipment Managers, Heavy Civil PMs, Fleet Operations."
            >
              <CommandCenterMapCard data={data.commandCenterPins} />
            </CardDescriptor>
          </SandboxCard>
        </BentoCell>
        <BentoCell span={2}>
          <SandboxCard cardId="wbsHeatmap" persona={persona}>
            <CardDescriptor
              value="Color-coded Performance Factor by cost code lets PMs instantly see which trade areas are underperforming. Red tiles need a True-Up; green tiles confirm the bid is holding. No spreadsheet required."
              audience="Project Managers, Specialty Contractors, Estimators."
            >
              <WbsHeatmapCard data={data.wbsCodes} />
            </CardDescriptor>
          </SandboxCard>
        </BentoCell>
      </BentoGrid>
    </LayerSection>
  )
}
