import BentoGrid, { BentoCell } from '../../layout/BentoGrid'
import SandboxCard from '../SandboxCard'
import CardDescriptor from '../CardDescriptor'
import LayerSection from '../LayerSection'
import PerformanceGauge from '../cards/PerformanceGauge'
import BudgetVsActualCard from '../cards/BudgetVsActualCard'
import ProjectedMarginCard from '../cards/ProjectedMarginCard'
import PortfolioHeatmap from '../cards/PortfolioHeatmap'
import EarnedValueCard from '../cards/EarnedValueCard'
import WorkforceCountCard from '../cards/WorkforceCountCard'
import DailyHuddleRecapCard from '../cards/DailyHuddleRecapCard'
import BurnCurveCard from '../cards/BurnCurveCard'
import ProductionHealthCard from '../cards/ProductionHealthCard'
import type { HubData, Persona } from '../../../hooks/useHubData'

interface EvergreenLayerProps {
  data: HubData
  persona: Persona
}

export default function EvergreenLayer({ data, persona }: EvergreenLayerProps) {
  return (
    <LayerSection
      layerNumber={1}
      label="Evergreen"
      subtitle="The Perpetual Pulse — core vitals that answer: are we on track?"
    >
      <BentoGrid columns={2}>
        <BentoCell span={2}>
          <SandboxCard cardId="earnedValue" persona={persona}>
            <CardDescriptor
              value="The single source of truth for project financial health. Combines cost, schedule, and scope into CPI/SPI metrics so PMs can answer 'are we over budget AND behind schedule?' in one glance."
              audience="Project Managers, Project Executives, Controllers — anyone accountable for financial outcomes."
            >
              <EarnedValueCard data={data.earnedValue} />
            </CardDescriptor>
          </SandboxCard>
        </BentoCell>
        <SandboxCard cardId="performanceGauge" persona={persona}>
          <CardDescriptor
            value="Answers the daily question: are we installing faster or slower than we bid? A PF above 1.0 means the crew is outperforming the estimate; below 1.0 signals productivity drag before it hits the bottom line."
            audience="Project Managers, Foremen, Estimators — production-focused roles."
          >
            <PerformanceGauge data={data.performanceFactor} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="workforceCount" persona={persona}>
          <CardDescriptor
            value="Instant visibility into whether you have enough boots on the ground. Staffing shortfalls are the #1 cause of schedule slip — this card catches them the day they happen, not at month-end."
            audience="Project Managers, Superintendents, Resource Planners."
          >
            <WorkforceCountCard data={data.workforceCount} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="budgetVsActual" persona={persona}>
          <CardDescriptor
            value="Tracks financial burn over time. When the actual line crosses above budgeted, it's an early warning that cost control is slipping — weeks before the P&L catches it."
            audience="Project Managers, Controllers, Finance Teams."
          >
            <BudgetVsActualCard data={data.budgetVsActual} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="projectedMargin" persona={persona}>
          <CardDescriptor
            value="Shows where the margin is heading, not where it was. A downward trend triggers proactive cost reviews instead of reactive damage control at project close-out."
            audience="Project Executives, Division Managers, Estimators."
          >
            <ProjectedMarginCard data={data.projectedMargin} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="dailyHuddle" persona={persona}>
          <CardDescriptor
            value="A quick morning check on yesterday's field output vs. daily targets. Green means the crew hit the mark; red means today's standup needs to address the shortfall before it compounds."
            audience="Superintendents, Foremen, Heavy Civil PMs — anyone running the daily standup."
          >
            <DailyHuddleRecapCard data={data.dailyHuddle} />
          </CardDescriptor>
        </SandboxCard>
        <BentoCell span={2}>
          <SandboxCard cardId="burnCurve" persona={persona}>
            <CardDescriptor
              value="The three-line burn curve is the clearest early-warning system for productivity lag. When % hours spent diverges from % work complete, it means the project is burning budget faster than it's earning value."
              audience="Project Managers, Specialty Contractors, Schedulers — anyone tracking labor productivity."
            >
              <BurnCurveCard data={data.burnCurve} />
            </CardDescriptor>
          </SandboxCard>
        </BentoCell>
        <BentoCell span={2}>
          <SandboxCard cardId="productionHealth" persona={persona}>
            <CardDescriptor
              value="Combines earned vs. actual hours per period with a CPI trend line. When the CPI line dips below 1.0, it pinpoints which periods drove the overrun — so PMs can reconcile the forecast before it's too late."
              audience="Project Managers, General Superintendents, Controllers."
            >
              <ProductionHealthCard data={data.productionHealth} />
            </CardDescriptor>
          </SandboxCard>
        </BentoCell>
        <BentoCell span={2}>
          <SandboxCard cardId="portfolioHeatmap" persona={persona}>
            <CardDescriptor
              value="Executive-level snapshot of every active project's CPI in one view. Red projects get immediate attention; green projects confirm trust. Eliminates the need to open 10 dashboards to find the one fire."
              audience="VPs of Operations, Portfolio Managers, Executive Leadership."
            >
              <PortfolioHeatmap data={data.portfolioHealth} />
            </CardDescriptor>
          </SandboxCard>
        </BentoCell>
      </BentoGrid>
    </LayerSection>
  )
}
