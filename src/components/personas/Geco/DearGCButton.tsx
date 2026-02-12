import { FileText } from 'lucide-react'
import ActionableInsightCard from '../../cards/ActionableInsightCard'

export default function DearGCButton() {
  const handleClick = () => {
    window.history.pushState({}, '', '/workflow/dear-gc')
    // Placeholder: in a real app would open modal or navigate to letter generator
    alert('Draft notification of schedule impact… (placeholder)')
  }

  const signal = (
    <div className="flex items-center gap-2" style={{ color: 'var(--figma-text-primary)' }}>
      <FileText className="h-10 w-10" style={{ color: 'var(--figma-primary-main)' }} />
      <span className="font-medium">Notify GC of schedule impact</span>
    </div>
  )

  const context = 'Formal notice for predecessor delays and at-risk milestones.'

  return (
    <ActionableInsightCard
      title="Dear GC"
      signal={signal}
      context={context}
      kickoff={{ label: 'Draft letter', onClick: handleClick }}
      kickoffPriority="p2"
    />
  )
}
