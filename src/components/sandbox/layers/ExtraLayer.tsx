import BentoGrid from '../../layout/BentoGrid'
import SandboxCard from '../SandboxCard'
import CardDescriptor from '../CardDescriptor'
import LayerSection from '../LayerSection'
import SmartBenchSearch from '../cards/SmartBenchSearch'
import BidSimulatorToggle from '../cards/BidSimulatorToggle'
import HistoricalBenchmarkCard from '../cards/HistoricalBenchmarkCard'
import ScenarioPlanningCard from '../cards/ScenarioPlanningCard'
import FuelTrendsCard from '../cards/FuelTrendsCard'
import GoldenThreadTimelineCard from '../cards/GoldenThreadTimelineCard'
import type { HubData, Persona } from '../../../hooks/useHubData'

interface ExtraLayerProps {
  data: HubData
  persona: Persona
}

export default function ExtraLayer({ data, persona }: ExtraLayerProps) {
  return (
    <LayerSection
      layerNumber={5}
      label="Extra"
      subtitle="Detailed planning and drill-down tools."
    >
      <BentoGrid columns={3}>
        <SandboxCard cardId="smartBench" persona={persona}>
          <CardDescriptor
            value="When a project needs a PLC specialist next Tuesday, you shouldn't be calling around. This searchable bench lets planners find the right skill match in seconds and dispatch directly — turning a 3-day staffing scramble into a 3-minute action."
            audience="Resource Planners, Operations Directors, Workforce Managers."
          >
            <SmartBenchSearch data={data.smartBench} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="bidSimulator" persona={persona}>
          <CardDescriptor
            value="Models the capacity impact of winning new work before you commit. Toggle pending bids to see if your workforce can absorb the demand — preventing the 'won it but can't staff it' problem that erodes margins."
            audience="Business Development, Operations VPs, Resource Planners."
          >
            <BidSimulatorToggle data={data.bidSimulator} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="scenarioPlanning" persona={persona}>
          <CardDescriptor
            value="Lets PMs stress-test their budget against real-world risks before they happen. Toggle material price increases, overtime, or delays and see the EAC shift in real-time — so you can build contingency into the forecast, not explain overruns after the fact."
            audience="Project Managers, Estimators, Controllers, Division Managers."
          >
            <ScenarioPlanningCard data={data.scenarioPlanning} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="historicalBenchmark" persona={persona}>
          <CardDescriptor
            value="Compares your current crews against the company's proven best. If concrete placement is at 78% of the historical best, it tells the PM exactly how much improvement is possible — and gives estimators better data for the next bid."
            audience="Project Managers, Estimators, Continuous Improvement Teams."
          >
            <HistoricalBenchmarkCard data={data.historicalBenchmark} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="fuelTrends" persona={persona}>
          <CardDescriptor
            value="Fuel is one of the largest variable costs in heavy civil. Tracking consumption by week reveals anomalies — a spike might mean equipment is idling excessively, or a drop might confirm a fleet right-sizing decision worked."
            audience="Equipment Managers, Fleet Operations, Cost Engineers."
          >
            <FuelTrendsCard data={data.fuelTrends} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="goldenThreadTimeline" persona={persona}>
          <CardDescriptor
            value="The chronological field log trail that connects daily quantities, hours, and variance reasons — the 'golden thread' from field to finance. Variance entries highlighted in red become the starting point for reconciliation."
            audience="Project Managers, Field Engineers, Controllers."
          >
            <GoldenThreadTimelineCard data={data.fieldLogs} />
          </CardDescriptor>
        </SandboxCard>
      </BentoGrid>
    </LayerSection>
  )
}
