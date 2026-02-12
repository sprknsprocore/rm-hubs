import type { ReconciliationRow } from '../../types/lem'

interface ConstraintHistorySidebarProps {
  selectedRow: ReconciliationRow | null
}

export default function ConstraintHistorySidebar({ selectedRow }: ConstraintHistorySidebarProps) {
  const width = 280

  return (
    <aside
      className="flex shrink-0 flex-col border-l overflow-y-auto"
      style={{
        width,
        backgroundColor: 'var(--figma-bg-default)',
        borderColor: 'var(--figma-bg-outline)',
      }}
      aria-label="Constraint History"
    >
      <div
        className="shrink-0 border-b px-4 py-3"
        style={{
          borderColor: 'var(--figma-bg-outline)',
        }}
      >
        <h2
          className="text-sm font-semibold"
          style={{ color: 'var(--figma-text-primary)' }}
        >
          Constraint History
        </h2>
        {selectedRow && (
          <p
            className="mt-0.5 text-xs"
            style={{ color: 'var(--figma-text-secondary)' }}
          >
            {selectedRow.costCodeOrWBS}
          </p>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {!selectedRow ? (
          <p
            className="text-sm"
            style={{ color: 'var(--figma-text-disabled)' }}
          >
            Select a row to view constraint history.
          </p>
        ) : !selectedRow.constraintHistory?.length ? (
          <p
            className="text-sm"
            style={{ color: 'var(--figma-text-secondary)' }}
          >
            No constraint history for this code.
          </p>
        ) : (
          <ul className="space-y-4">
            {selectedRow.constraintHistory.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border p-3"
                style={{
                  backgroundColor: 'var(--figma-bg-depth2)',
                  borderColor: 'var(--figma-bg-outline)',
                }}
              >
                <p
                  className="mb-2 text-sm font-medium"
                  style={{ color: 'var(--figma-text-primary)' }}
                >
                  Reason for variance
                </p>
                <p
                  className="mb-2 text-sm"
                  style={{ color: 'var(--figma-text-secondary)' }}
                >
                  {item.reasonForVariance}
                </p>
                <p
                  className="mb-1 text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--figma-text-disabled)' }}
                >
                  Field notes
                </p>
                <p
                  className="text-sm"
                  style={{ color: 'var(--figma-text-primary)' }}
                >
                  {item.fieldNotes}
                </p>
                {item.photoUrls?.length ? (
                  <div className="mt-2">
                    <p
                      className="mb-1 text-xs font-medium uppercase tracking-wider"
                      style={{ color: 'var(--figma-text-disabled)' }}
                    >
                      Photos
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.photoUrls.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs underline"
                          style={{ color: 'var(--figma-primary-main)' }}
                        >
                          Photo {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
                <p
                  className="mt-2 text-xs"
                  style={{ color: 'var(--figma-text-disabled)' }}
                >
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
