import BentoGrid, { BentoCell } from '../../layout/BentoGrid'
import PortfolioHeatmap from '../../sandbox/cards/PortfolioHeatmap'
import CapacityDemandCard from '../../sandbox/cards/CapacityDemandCard'
import BidSimulatorToggle from '../../sandbox/cards/BidSimulatorToggle'
import SmartBenchSearch from '../../sandbox/cards/SmartBenchSearch'
import AllocationPlanCard from '../../sandbox/cards/AllocationPlanCard'
import WorkforceCountCard from '../../sandbox/cards/WorkforceCountCard'
import { useHubData } from '../../../hooks/useHubData'
import type { NlFilterResult } from '../../../types/lem'

interface PlannerHubProps {
  nlFilter?: NlFilterResult | null
  onExpand?: (insightId: string) => void
}

export default function PlannerHub({ onExpand }: PlannerHubProps) {
  const data = useHubData()

  return (
    <BentoGrid columns={2} rows="hero-action">
      <BentoCell span={2}>
        <div data-tour="card-capacity-demand" className="flex min-h-0 flex-1 flex-col">
          <CapacityDemandCard data={data.capacityDemand} onExpand={onExpand} />
        </div>
      </BentoCell>
      <BentoCell span={2}>
        <div data-tour="card-portfolio-heatmap" className="flex min-h-0 flex-1 flex-col">
          <PortfolioHeatmap data={data.portfolioHealth} onExpand={onExpand} />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-allocation-plan" className="flex min-h-0 flex-1 flex-col">
          <AllocationPlanCard data={data.allocationPlan} onExpand={onExpand} />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-workforce-count" className="flex min-h-0 flex-1 flex-col">
          <WorkforceCountCard data={data.workforceCount} onExpand={onExpand} />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-smart-bench" className="flex min-h-0 flex-1 flex-col">
          <SmartBenchSearch data={data.smartBench} onExpand={onExpand} />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-bid-simulator" className="flex min-h-0 flex-1 flex-col">
          <BidSimulatorToggle data={data.bidSimulator} onExpand={onExpand} />
        </div>
      </BentoCell>
    </BentoGrid>
  )
}
