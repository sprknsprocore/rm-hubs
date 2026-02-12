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
import type { HubData, SandboxPersona } from '../../../hooks/useHubData'

interface EvergreenLayerProps {
  data: HubData
  persona: SandboxPersona
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
