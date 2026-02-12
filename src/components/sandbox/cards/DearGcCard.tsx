import { FileText } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'

export default function DearGcCard() {
  const signal = (
    <div className="flex items-center gap-4 py-2">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: 'var(--figma-primary-main)' }}
      >
        <FileText className="h-6 w-6" />
      </div>
      <div>
        <p className="text-[14px] font-semibold" style={{ color: 'var(--figma-text-primary)' }}>
          Notify GC of Schedule Impact
        </p>
        <p className="mt-0.5 text-[12px]" style={{ color: 'var(--figma-text-secondary)' }}>
          Auto-generate a formal delay notification letter based on current project data and predecessor slip analysis.
        </p>
      </div>
    </div>
  )

  const context = (
    <span>When a predecessor delay impacts your scope, a formal GC notification protects your contractual position and starts the documented record.</span>
  )

  return (
    <ActionableInsightCard
      title="Dear GC"
      signal={signal}
      context={context}
      kickoff={{ label: 'Draft Letter', onClick: () => {} }}
      kickoffPriority="p2"
    />
  )
}
