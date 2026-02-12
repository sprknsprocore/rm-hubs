import BentoGrid, { BentoCell } from '../../layout/BentoGrid'
import PortfolioHeatmap from '../../sandbox/cards/PortfolioHeatmap'
import EarnedValueCard from '../../sandbox/cards/EarnedValueCard'
import BudgetVsActualCard from '../../sandbox/cards/BudgetVsActualCard'
import ProjectedMarginCard from '../../sandbox/cards/ProjectedMarginCard'
import BurnCurveCard from '../../sandbox/cards/BurnCurveCard'
import AllocationPlanCard from '../../sandbox/cards/AllocationPlanCard'
import ExpiringCertsCard from '../../sandbox/cards/ExpiringCertsCard'
import UnapprovedTimesheetsCard from '../../sandbox/cards/UnapprovedTimesheetsCard'
import { useHubData } from '../../../hooks/useHubData'
import type { NlFilterResult } from '../../../types/lem'

interface SpecialtyHubProps {
  nlFilter?: NlFilterResult | null
  onExpand?: (insightId: string) => void
}

export default function SpecialtyHub({ onExpand }: SpecialtyHubProps) {
  const data = useHubData()

  return (
    <BentoGrid columns={2} rows="hero-action">
      <BentoCell span={2}>
        <div data-tour="card-portfolio-heatmap" className="flex min-h-0 flex-1 flex-col">
          <PortfolioHeatmap data={data.portfolioHealth} onExpand={onExpand} />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-projected-margin" className="flex min-h-0 flex-1 flex-col">
          <ProjectedMarginCard data={data.projectedMargin} onExpand={onExpand} />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-earned-value" className="flex min-h-0 flex-1 flex-col">
          <EarnedValueCard data={data.earnedValue} onExpand={onExpand} />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-budget-vs-actual" className="flex min-h-0 flex-1 flex-col">
          <BudgetVsActualCard data={data.budgetVsActual} onExpand={onExpand} />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-unapproved-timesheets" className="flex min-h-0 flex-1 flex-col">
          <UnapprovedTimesheetsCard data={data.unapprovedTimesheets} onExpand={onExpand} />
        </div>
      </BentoCell>
      <BentoCell span={2}>
        <div data-tour="card-burn-curve" className="flex min-h-0 flex-1 flex-col">
          <BurnCurveCard data={data.burnCurve} onExpand={onExpand} />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-allocation-plan" className="flex min-h-0 flex-1 flex-col">
          <AllocationPlanCard data={data.allocationPlan} onExpand={onExpand} />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-expiring-certs" className="flex min-h-0 flex-1 flex-col">
          <ExpiringCertsCard data={data.expiringCerts} onExpand={onExpand} />
        </div>
      </BentoCell>
    </BentoGrid>
  )
}
