import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import BentoGrid, { BentoCell } from '../../layout/BentoGrid'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import CommandCenterMap from './CommandCenterMap'
import EarthMoverGauge from './EarthMoverGauge'
import MaintenanceRedFlagsRow from './MaintenanceRedFlagsRow'
import MaterialYieldAlert from './MaterialYieldAlert'
import DailyHuddleRecap from './DailyHuddleRecap'
import { getDashboardPayload } from '../../../api/mockLemApi'
import type { NlFilterResult } from '../../../types/lem'

interface HeavyCivilHubProps {
  nlFilter?: NlFilterResult | null
}

export default function HeavyCivilHub({ nlFilter }: HeavyCivilHubProps) {
  const navigate = useNavigate()
  const payload = useMemo(
    () => getDashboardPayload('heavyCivil'),
    []
  )

  if (payload.persona !== 'heavyCivil') return null

  const { equipmentPins, earthMover, redFlags, materialYield, dailyHuddleRecap } = payload.data
  const zeroActivityCount = equipmentPins.filter(
    (p) => (Date.now() - new Date(p.lastActivityAt).getTime()) / (24 * 60 * 60 * 1000) > 3
  ).length
  const mapSignal = <CommandCenterMap pins={equipmentPins} nlFilter={nlFilter?.equipmentFilter} zeroActivityCount={zeroActivityCount} />
  const mapContext =
    zeroActivityCount > 0
      ? `${equipmentPins.length} units on the map. ${zeroActivityCount} have had no activity in over 3 days—you may be paying for equipment that is not earning. Use the button below to request sending them back or reassigning.`
      : `${equipmentPins.length} units on the map. Red markers mean no activity in over 3 days. Use the button below when you want to send idle equipment back or reassign.`

  return (
    <BentoGrid columns={2} rows="hero-action">
      <BentoCell>
        <div data-tour="card-command-center" className="flex min-h-0 flex-1 flex-col">
          <ActionableInsightCard
            title="Equipment Map"
            signal={mapSignal}
            context={mapContext}
            kickoff={{ label: 'Send back or reassign idle equipment', onClick: () => navigate('/workflow/off-rent-idle?source=command-center') }}
            kickoffPriority="p2"
          />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-earth-mover-gauge" className="flex min-h-0 flex-1 flex-col">
          <EarthMoverGauge data={earthMover} />
        </div>
      </BentoCell>
      {materialYield && materialYield.actualWastePct > materialYield.budgetedWastePct && (
        <BentoCell span={2}>
          <div data-tour="card-material-yield-alert" className="flex min-h-0 flex-1 flex-col">
            <MaterialYieldAlert materialYield={materialYield} />
          </div>
        </BentoCell>
      )}
      {dailyHuddleRecap && (
        <BentoCell span={2}>
          <div data-tour="card-daily-huddle-recap" className="flex min-h-0 flex-1 flex-col">
            <DailyHuddleRecap recap={dailyHuddleRecap} />
          </div>
        </BentoCell>
      )}
      <BentoCell span={2}>
        <div data-tour="card-maintenance-red-flags" className="flex min-h-0 flex-1 flex-col">
          <MaintenanceRedFlagsRow items={redFlags} />
        </div>
      </BentoCell>
    </BentoGrid>
  )
}
