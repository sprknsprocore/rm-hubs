import { Clock } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { UnapprovedTimesheet } from '../../../hooks/useHubData'

interface UnapprovedTimesheetsCardProps {
  data: UnapprovedTimesheet[]
}

export default function UnapprovedTimesheetsCard({ data }: UnapprovedTimesheetsCardProps) {
  const totalHours = data.reduce((s, d) => s + d.totalHours, 0)

  const signal = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'var(--figma-chart-exception-light)', color: 'var(--figma-chart-exception)' }}
        >
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--figma-chart-exception)' }}>
            {data.length} Pending
          </p>
          <p className="text-[12px]" style={{ color: 'var(--figma-text-secondary)' }}>
            {totalHours} total hours awaiting approval
          </p>
        </div>
      </div>
      <ul className="space-y-2">
        {data.map((ts) => (
          <li
            key={ts.id}
            className="flex items-center justify-between rounded-lg border px-3 py-2.5"
            style={{
              borderColor: 'var(--figma-bg-outline)',
              backgroundColor: 'var(--figma-bg-depth2)',
            }}
          >
            <div>
              <span className="text-[13px] font-medium" style={{ color: 'var(--figma-text-primary)' }}>
                {ts.foremanName}
              </span>
              <p className="text-[11px]" style={{ color: 'var(--figma-text-secondary)' }}>
                Crew of {ts.crewSize} · {ts.date}
              </p>
            </div>
            <span className="text-[12px] font-semibold tabular-nums" style={{ color: 'var(--figma-text-primary)' }}>
              {ts.totalHours} hrs
            </span>
          </li>
        ))}
      </ul>
    </div>
  )

  const context = (
    <span>Foreman timesheets pending PM approval. Delays financial visibility and cost reporting accuracy.</span>
  )

  return (
    <ActionableInsightCard
      title="Unapproved Timesheet Blockers"
      signal={signal}
      context={context}
      kickoff={{ label: 'Approve Time', onClick: () => {} }}
      kickoffPriority="p1"
    />
  )
}
