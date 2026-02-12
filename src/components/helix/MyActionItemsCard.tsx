import { MoreVertical, AlertCircle, FileText } from 'lucide-react'
import { myActionItems } from '../../api/mockHelixApi'

export default function MyActionItemsCard() {
  return (
    <article
      className="flex flex-col"
      style={{
        backgroundColor: 'var(--helix-bg-card)',
        border: '1px solid var(--helix-border-card)',
        borderRadius: 'var(--helix-radius-card)',
      }}
    >
      <div
        className="flex items-center justify-between border-b"
        style={{
          borderColor: 'var(--helix-border-divider)',
          padding: 'var(--helix-space-card)',
        }}
      >
        <h2
          className="text-sm font-semibold"
          style={{ color: 'var(--helix-text-primary)' }}
        >
          My Action Items 22
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm"
            style={{ color: 'var(--helix-text-secondary)' }}
          >
            View All
          </button>
          <button
            type="button"
            className="rounded p-1"
            style={{ color: 'var(--helix-text-muted)' }}
            aria-label="More"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
      <ul className="flex-1 divide-y" style={{ borderColor: 'var(--helix-border-divider)' }}>
        {myActionItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="flex w-full items-start gap-3 px-5 py-3 text-left"
              style={{ color: 'var(--helix-text-primary)' }}
            >
              <span className="mt-0.5 shrink-0">
                {item.icon === 'alert' ? (
                  <AlertCircle className="h-4 w-4" style={{ color: 'var(--helix-primary)' }} />
                ) : (
                  <FileText className="h-4 w-4" style={{ color: 'var(--helix-text-muted)' }} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                {item.meta && (
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--helix-text-muted)' }}>
                    {item.meta}
                  </p>
                )}
              </div>
              <span className="shrink-0 text-xs" style={{ color: 'var(--helix-text-muted)' }}>
                {item.time}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </article>
  )
}
