import { useMemo } from 'react'
import { motion } from 'framer-motion'
import BentoGrid, { BentoCell } from '../../layout/BentoGrid'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import ThreeLineBurnCurve from './ThreeLineBurnCurve'
import ProductionHealthCard from './ProductionHealthCard'
import SCurveForecast from './SCurveForecast'
import MilestoneTracker from './MilestoneTracker'
import DearGCButton from './DearGCButton'
import { getDashboardPayload } from '../../../api/mockLemApi'
import type { NlFilterResult } from '../../../types/lem'

interface GecoHubProps {
  nlFilter?: NlFilterResult | null
}

export default function GecoHub({ nlFilter: _nlFilter }: GecoHubProps) {
  const payload = useMemo(() => getDashboardPayload('geco'), [])

  if (payload.persona !== 'geco') return null

  const { laborCurves, laborBurnCurve, milestones, varianceReason, projectedOverrunHours } = payload.data

  const burnSignal = <ThreeLineBurnCurve data={laborBurnCurve} />
  const burnContext = laborBurnCurve.delayFlag
    ? `${laborBurnCurve.insight} Benchmark: industry completion curve.`
    : `Benchmark: industry completion curve. ${laborBurnCurve.insight}`

  return (
    <BentoGrid columns={3} rows="hero-secondary">
      <BentoCell span={3}>
        <div data-tour="card-three-line-burn" className="flex min-h-0 flex-1 flex-col">
          <ActionableInsightCard
            title="Three-Line Burn Curve"
            signal={burnSignal}
            context={burnContext}
            kickoff={{ label: 'Create delay notice', onClick: () => window.history.pushState({}, '', '/workflow/delay-notice') }}
            kickoffPriority="p1"
          />
        </div>
      </BentoCell>
      <BentoCell span={2}>
        <motion.div layoutId="reconciliation-workspace" className="flex h-full min-h-0 flex-col" data-tour="card-production-health">
          <ProductionHealthCard
            laborCurves={laborCurves}
            laborBurnCurve={laborBurnCurve}
            varianceReason={varianceReason}
            projectedOverrunHours={projectedOverrunHours}
          />
        </motion.div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-s-curve-forecast" className="flex min-h-0 flex-1 flex-col">
          <ActionableInsightCard
            title="S-Curve Forecast"
            signal={<SCurveForecast data={laborCurves} />}
            context="Planned vs actual vs forecast hours."
            kickoff={{ label: 'Notify GC of Schedule Impact', onClick: () => window.history.pushState({}, '', '/workflow/dear-gc') }}
            kickoffPriority="p2"
          />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-milestone-tracker" className="flex min-h-0 flex-1 flex-col">
          <MilestoneTracker milestones={milestones} />
        </div>
      </BentoCell>
      <BentoCell span={2}>
        <div data-tour="card-dear-gc" className="flex min-h-0 flex-1 flex-col">
          <DearGCButton />
        </div>
      </BentoCell>
    </BentoGrid>
  )
}
