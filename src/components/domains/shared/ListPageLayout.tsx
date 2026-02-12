import { type ReactNode } from 'react'

export interface ListPageTab {
  id: string
  label: string
}

interface ListPageLayoutProps {
  title: string
  subtitle?: string
  /** Optional: icon shown to the left of the title (e.g. gear for Equipment) */
  titleIcon?: ReactNode
  tabs?: readonly ListPageTab[]
  activeTabId?: string
  onTabChange?: (id: string) => void
  /** Optional: right-side actions (e.g. Create, Export) when tabs are present */
  headerActions?: ReactNode
  /** Optional: element after tabs (e.g. More dropdown chevron) */
  tabsTrailing?: ReactNode
  /** Optional: settings/gear button next to title */
  titleAction?: ReactNode
  /** When true (no tabs), wrap title+subtitle in full-bleed white bar for unified look with tabbed pages */
  headerBar?: boolean
  children: ReactNode
}

export default function ListPageLayout({
  title,
  subtitle,
  titleIcon,
  tabs,
  activeTabId,
  onTabChange,
  headerActions,
  tabsTrailing,
  titleAction,
  headerBar = false,
  children,
}: ListPageLayoutProps) {
  const whiteBarStyle = {
    borderColor: 'var(--figma-bg-outline)',
    backgroundColor: 'var(--figma-bg-default)',
  }
  const headerPaddingClass = 'px-4 pt-4 md:px-6 md:pt-5'
  const headerBarClass = `flex w-full flex-col border-b -mt-4 pt-4 md:-mt-5 md:pt-5 pb-0 ${headerPaddingClass}`

  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      {/* Tabbed header: full width from sidebar to browser edge; content padded */}
      {tabs ? (
        <div
          className={headerBarClass}
          style={whiteBarStyle}
        >
          {/* Row 1: title, optional subtitle, titleAction, headerActions */}
          <div className="flex flex-wrap items-start justify-between gap-3 pb-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {titleIcon && (
                  <span style={{ color: 'var(--figma-text-secondary)' }} aria-hidden>
                    {titleIcon}
                  </span>
                )}
                <h1
                  className="text-xl font-semibold md:text-2xl"
                  style={{ color: 'var(--figma-text-primary)' }}
                >
                  {title}
                </h1>
                {titleAction}
              </div>
              {subtitle && (
                <p className="text-sm" style={{ color: 'var(--figma-text-secondary)' }}>
                  {subtitle}
                </p>
              )}
            </div>
            {headerActions != null && (
              <div className="flex items-center gap-2">{headerActions}</div>
            )}
          </div>
          {/* Row 2: tabs (Timesheets-style underline) + trailing */}
          <div
            className={`flex flex-wrap items-center gap-6 pb-0 pt-0 ${headerPaddingClass}`}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange?.(tab.id)}
                className="border-b-2 pb-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{
                  borderColor: activeTabId === tab.id ? 'var(--figma-primary-orange)' : 'transparent',
                  color: activeTabId === tab.id ? 'var(--figma-text-primary)' : 'var(--figma-text-secondary)',
                }}
              >
                {tab.label}
              </button>
            ))}
            {tabsTrailing}
          </div>
        </div>
      ) : headerBar ? (
        <div
          className={`flex w-full flex-col border-b -mt-4 pt-4 md:-mt-5 md:pt-5 pb-4 ${headerPaddingClass}`}
          style={whiteBarStyle}
        >
          <h1
            className="text-xl font-semibold md:text-2xl"
            style={{ color: 'var(--figma-text-primary)' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm" style={{ color: 'var(--figma-text-secondary)' }}>
              {subtitle}
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <h1
            className="text-xl font-semibold md:text-2xl"
            style={{ color: 'var(--figma-text-primary)' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm" style={{ color: 'var(--figma-text-secondary)' }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="px-4 md:px-6">
        {children}
      </div>
    </div>
  )
}
