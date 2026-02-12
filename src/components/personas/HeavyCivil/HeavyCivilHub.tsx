import BentoGrid, { BentoCell } from '../../layout/BentoGrid'
import PortfolioHeatmap from '../../sandbox/cards/PortfolioHeatmap'
import CommandCenterMapCard from '../../sandbox/cards/CommandCenterMapCard'
import EquipmentUtilizationCard from '../../sandbox/cards/EquipmentUtilizationCard'
import UtilizationTrendCard from '../../sandbox/cards/UtilizationTrendCard'
import ZeroActivityCard from '../../sandbox/cards/ZeroActivityCard'
import FuelTrendsCard from '../../sandbox/cards/FuelTrendsCard'
import DailyHuddleRecapCard from '../../sandbox/cards/DailyHuddleRecapCard'
import { useHubData } from '../../../hooks/useHubData'
import type { NlFilterResult } from '../../../types/lem'

interface HeavyCivilHubProps {
  nlFilter?: NlFilterResult | null
}

export default function HeavyCivilHub(_props: HeavyCivilHubProps) {
  const data = useHubData()

  return (
    <BentoGrid columns={2} rows="hero-action">
      <BentoCell span={2}>
        <div data-tour="card-portfolio-heatmap" className="flex min-h-0 flex-1 flex-col">
          <PortfolioHeatmap data={data.portfolioHealth} />
        </div>
      </BentoCell>
      <BentoCell span={2}>
        <div data-tour="card-command-center" className="flex min-h-0 flex-1 flex-col">
          <CommandCenterMapCard data={data.commandCenterPins} />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-equipment-utilization" className="flex min-h-0 flex-1 flex-col">
          <EquipmentUtilizationCard data={data.equipmentUtilization} />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-utilization-trend" className="flex min-h-0 flex-1 flex-col">
          <UtilizationTrendCard data={data.utilizationTrend} />
        </div>
      </BentoCell>
      <BentoCell span={2}>
        <div data-tour="card-zero-activity" className="flex min-h-0 flex-1 flex-col">
          <ZeroActivityCard data={data.zeroActivityAlerts} />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-fuel-trends" className="flex min-h-0 flex-1 flex-col">
          <FuelTrendsCard data={data.fuelTrends} />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-daily-huddle" className="flex min-h-0 flex-1 flex-col">
          <DailyHuddleRecapCard data={data.dailyHuddle} />
        </div>
      </BentoCell>
    </BentoGrid>
  )
}
