import type { ReactNode } from 'react'

interface CardDescriptorProps {
  children: ReactNode
  value: string
  audience: string
}

/**
 * Wraps a card and renders a plain-text descriptor underneath
 * explaining the card's value proposition and target audience.
 */
export default function CardDescriptor({ children, value, audience }: CardDescriptorProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {children}
      <div className="mt-2 rounded-lg px-3 py-2.5" style={{ backgroundColor: 'var(--figma-bg-depth2)' }}>
        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--figma-text-secondary)' }}>
          <span className="font-semibold" style={{ color: 'var(--figma-text-primary)' }}>Value: </span>
          {value}
        </p>
        <p className="mt-1 text-[12px] leading-relaxed" style={{ color: 'var(--figma-text-secondary)' }}>
          <span className="font-semibold" style={{ color: 'var(--figma-text-primary)' }}>For: </span>
          {audience}
        </p>
      </div>
    </div>
  )
}
