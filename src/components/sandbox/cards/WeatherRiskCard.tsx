import { CloudRain } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { WeatherRiskData } from '../../../hooks/useHubData'

interface WeatherRiskCardProps {
  data: WeatherRiskData
}

export default function WeatherRiskCard({ data }: WeatherRiskCardProps) {
  const signal = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: 'var(--figma-info-light)', color: 'var(--figma-info)' }}
        >
          <CloudRain className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-bold" style={{ color: 'var(--figma-info)' }}>
            {data.precipitationPct}% Precipitation
          </p>
          <p className="text-[12px]" style={{ color: 'var(--figma-text-secondary)' }}>
            {data.site} — 48hr forecast
          </p>
        </div>
      </div>
      <div
        className="rounded-lg px-3 py-2.5"
        style={{ backgroundColor: 'var(--figma-info-light)', borderLeft: '3px solid var(--figma-info)' }}
      >
        <p className="text-[13px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
          {data.forecast}
        </p>
        <p className="mt-1 text-[12px]" style={{ color: 'var(--figma-text-secondary)' }}>
          Estimated delay: {data.estimatedDelayDays} days for excavation work
        </p>
      </div>
    </div>
  )

  const context = (
    <span>
      Precipitation forecast exceeds 50% threshold. Consider shifting non-weather-dependent tasks forward.
    </span>
  )

  return (
    <ActionableInsightCard
      title="Weather Impact Predictor"
      signal={signal}
      context={context}
      kickoff={{ label: 'Shift Schedule', onClick: () => {} }}
      kickoffPriority="p1"
    />
  )
}
