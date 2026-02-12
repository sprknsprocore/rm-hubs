import { useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import BentoGrid, { BentoCell } from '../../layout/BentoGrid'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import CapacityDemandHistogram, {
  type CapacityDemandBar,
} from './CapacityDemandHistogram'
import BidSimulator from './BidSimulator'
import SmartBenchCard from './SmartBenchCard'
import { getDashboardPayload } from '../../../api/mockLemApi'
import type { Opportunity, NlFilterResult } from '../../../types/lem'

interface EngineeringHubProps {
  nlFilter?: NlFilterResult | null
}

/** Returns first opportunity name that has required skills not covered on bench. */
function getSkillGapContext(opportunities: Opportunity[], benchTagLists: string[][]): string | null {
  for (const opp of opportunities) {
    const required = opp.skillTags ?? []
    if (required.length === 0) continue
    const benchHasAll = required.every((tag) =>
      benchTagLists.some((personTags) => personTags.some((t) => t === tag || t.includes(tag) || tag.includes(t)))
    )
    if (!benchHasAll) {
      const missing = required.filter((tag) =>
        !benchTagLists.some((personTags) => personTags.some((t) => t === tag || t.includes(tag) || tag.includes(t)))
      )
      return `${opp.name}: headcount available but missing ${missing.join(', ')} on bench.`
    }
  }
  return null
}

export default function EngineeringHub({ nlFilter: _nlFilter }: EngineeringHubProps) {
  const navigate = useNavigate()
  const payload = useMemo(() => getDashboardPayload('engineering'), [])

  const [opportunities, setOpportunities] = useState<Opportunity[]>(
    payload.persona === 'engineering' ? payload.data.opportunities : []
  )

  const handleToggle = useCallback((id: string, won: boolean) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, won } : o))
    )
  }, [])

  if (payload.persona !== 'engineering') return null

  const { capacityDemand, totalCapacity, capacityBenchmark, futureCapacityByPeriod, benchEmployees } = payload.data
  const baseDemand = capacityDemand.reduce((s, p) => s + p.demand, 0)

  const chartData: CapacityDemandBar[] = useMemo(() => {
    const base = capacityDemand.map((p) => ({
      name: p.periodOrProject,
      demand: p.demand,
    }))
    const wonDemand = opportunities.filter((o) => o.won).reduce((s, o) => s + o.demand, 0)
    if (wonDemand > 0) {
      base.push({ name: 'New (won)', demand: wonDemand })
    }
    return base
  }, [capacityDemand, opportunities])

  const histogramSignal = (
    <CapacityDemandHistogram
      chartData={chartData}
      capacityLine={totalCapacity}
      capacityBenchmark={capacityBenchmark}
      futureCapacityByPeriod={futureCapacityByPeriod}
    />
  )
  const totalDemand = chartData.reduce((s, d) => s + d.demand, 0)
  const gap = totalDemand - totalCapacity
  const benchTags = benchEmployees.map((e) => e.tags)
  const skillGap = getSkillGapContext(opportunities, benchTags)
  const contextParts = [`Demand ${totalDemand} · Capacity ${totalCapacity}${capacityBenchmark != null ? ` · Benchmark ${capacityBenchmark} FTE` : ''}${gap > 0 ? ` · Gap +${gap}` : ''}`]
  if (skillGap) contextParts.push(skillGap)
  const context = contextParts.join(' ')

  return (
    <BentoGrid columns={2} rows="hero-secondary">
      <BentoCell span={2}>
        <div data-tour="card-capacity-vs-demand" className="flex min-h-0 flex-1 flex-col">
          <ActionableInsightCard
            title="Capacity vs Demand"
            signal={histogramSignal}
            context={context}
            kickoff={{ label: 'View hiring plan', onClick: () => navigate('/workflow/hiring-plan') }}
            kickoffPriority="p2"
          />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-bid-simulator" className="flex min-h-0 flex-1 flex-col">
          <ActionableInsightCard
            title="Bid Simulator"
            signal={<BidSimulator opportunities={opportunities} onToggle={handleToggle} totalCapacity={totalCapacity} baseDemand={baseDemand} />}
            context="Toggle Win to see demand curve jump vs capacity line."
            kickoff={{ label: 'View Hiring Plan', onClick: () => navigate('/workflow/hiring-plan') }}
            kickoffPriority="p2"
          />
        </div>
      </BentoCell>
      <BentoCell>
        <div data-tour="card-smart-bench" className="flex min-h-0 flex-1 flex-col">
          <SmartBenchCard employees={benchEmployees} />
        </div>
      </BentoCell>
    </BentoGrid>
  )
}
