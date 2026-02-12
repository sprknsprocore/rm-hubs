import { ShieldAlert } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { ExpiringCert } from '../../../hooks/useHubData'

interface ExpiringCertsCardProps {
  data: ExpiringCert[]
}

export default function ExpiringCertsCard({ data }: ExpiringCertsCardProps) {
  const signal = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'var(--figma-chart-exception-light)', color: 'var(--figma-chart-exception)' }}
        >
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--figma-chart-exception)' }}>
            {data.length} Expiring
          </p>
          <p className="text-[12px]" style={{ color: 'var(--figma-text-secondary)' }}>
            Certifications due within 14 days
          </p>
        </div>
      </div>
      <ul className="space-y-2">
        {data.map((cert) => (
          <li
            key={cert.id}
            className="flex items-center justify-between rounded-lg border px-3 py-2.5"
            style={{
              borderColor: 'var(--figma-bg-outline)',
              backgroundColor: 'var(--figma-bg-depth2)',
            }}
          >
            <div>
              <span className="text-[13px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
                {cert.workerName}
              </span>
              <p className="text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
                {cert.certType}
              </p>
            </div>
            <span
              className="rounded-md px-2 py-1 text-[11px] font-semibold tabular-nums"
              style={{
                backgroundColor: cert.daysUntilExpiry <= 10 ? 'var(--figma-error-light)' : 'var(--figma-chart-exception-light)',
                color: cert.daysUntilExpiry <= 10 ? 'var(--figma-error)' : 'var(--figma-chart-exception)',
              }}
            >
              {cert.daysUntilExpiry}d
            </span>
          </li>
        ))}
      </ul>
    </div>
  )

  const context = (
    <span>Workers with OSHA or trade certifications expiring within 14 days. Non-compliance risks project shutdowns.</span>
  )

  return (
    <ActionableInsightCard
      title="Expiring Certifications"
      signal={signal}
      context={context}
      kickoff={{ label: 'Assign Training', onClick: () => {} }}
      kickoffPriority="p1"
    />
  )
}
