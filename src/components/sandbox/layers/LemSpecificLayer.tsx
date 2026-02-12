import BentoGrid from '../../layout/BentoGrid'
import SandboxCard from '../SandboxCard'
import CardDescriptor from '../CardDescriptor'
import LayerSection from '../LayerSection'
import LaborSCurveCard from '../cards/LaborSCurveCard'
import EquipmentUtilizationCard from '../cards/EquipmentUtilizationCard'
import MaterialYieldCard from '../cards/MaterialYieldCard'
import AllocationPlanCard from '../cards/AllocationPlanCard'
import UtilizationTrendCard from '../cards/UtilizationTrendCard'
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
      </BentoGrid>
    </LayerSection>
  )
}
