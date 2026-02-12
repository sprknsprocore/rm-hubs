import type { ReactNode } from 'react'

interface LayerSectionProps {
  layerNumber: number
  label: string
  subtitle: string
  children: ReactNode
  /** Optional right-side controls (e.g., toggle switches for Variable layer) */
  controls?: ReactNode
}

const LAYER_COLORS: Record<number, string> = {
  1: 'var(--figma-chart-1)',
  2: 'var(--figma-primary-main)',
  3: 'var(--figma-chart-exception)',
  4: 'var(--figma-info)',
  5: 'var(--figma-chart-muted)',
}

export default function LayerSection({
  layerNumber,
  label,
  subtitle,
  children,
  controls,
}: LayerSectionProps) {
  const accentColor = LAYER_COLORS[layerNumber] ?? 'var(--figma-chart-1)'

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-6 min-w-[24px] items-center justify-center rounded-md px-1.5 text-[11px] font-bold tabular-nums text-white"
            style={{ backgroundColor: accentColor }}
          >
            {layerNumber}
          </span>
          <div>
            <h2
              className="text-[15px] font-semibold tracking-tight"
              style={{ color: 'var(--figma-text-primary)' }}
            >
              {label}
            </h2>
            <p
              className="text-[12px]"
              style={{ color: 'var(--figma-text-secondary)' }}
            >
              {subtitle}
            </p>
          </div>
        </div>
        {controls && <div className="flex items-center gap-3">{controls}</div>}
      </div>
      {children}
    </section>
  )
}
