import { Wrench } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { FaultCodeData } from '../../../hooks/useHubData'

interface CriticalMaintenanceCardProps {
  data: FaultCodeData[]
}

export default function CriticalMaintenanceCard({ data }: CriticalMaintenanceCardProps) {
  const criticalCount = data.filter((d) => d.severity === 'critical').length

  const signal = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: 'var(--figma-error-light)', color: 'var(--figma-error)' }}
        >
          <Wrench className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-bold" style={{ color: 'var(--figma-error)' }}>
            {criticalCount} Critical Fault{criticalCount !== 1 ? 's' : ''}
          </p>
          <p className="text-[12px]" style={{ color: 'var(--figma-text-secondary)' }}>
            Telematics alert — immediate service required
          </p>
        </div>
      </div>
      <ul className="space-y-2">
        {data.map((fault) => (
          <li
            key={fault.id}
            className="rounded-lg border px-3 py-2.5"
            style={{
              borderColor: fault.severity === 'critical' ? 'var(--figma-error)' : 'var(--figma-bg-outline)',
              backgroundColor: fault.severity === 'critical' ? 'var(--figma-error-light)' : 'var(--figma-bg-depth2)',
              borderLeftWidth: 3,
              borderLeftColor: fault.severity === 'critical' ? 'var(--figma-error)' : 'var(--figma-chart-exception)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold" style={{ color: 'var(--figma-text-primary)' }}>
                {fault.equipmentId} — {fault.equipmentType}
              </span>
              <span
                className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase"
                style={{
                  backgroundColor: fault.severity === 'critical' ? 'var(--figma-error)' : 'var(--figma-chart-exception)',
                  color: '#fff',
                }}
              >
                {fault.severity}
              </span>
            </div>
            <p className="mt-1 text-[12px]" style={{ color: 'var(--figma-text-secondary)' }}>
              Code {fault.code}: {fault.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )

  const context = (
    <span>
      Critical engine or hydraulic fault codes received via telematics. Equipment must be serviced before resuming operations.
    </span>
  )

  return (
    <ActionableInsightCard
      title="Critical Maintenance Alert"
      signal={signal}
      context={context}
      kickoff={{ label: 'Dispatch Service', onClick: () => {} }}
      kickoffPriority="p1"
      className="border-l-[3px]"
    />
  )
}
