import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { Persona } from '../../hooks/useHubData'
import type { SandboxCardId } from './personaRelevance'
import { isRelevant, isHero } from './personaRelevance'

interface SandboxCardProps {
  cardId: SandboxCardId
  persona: Persona
  children: ReactNode
  className?: string
  /** For BentoCell span behavior */
  span?: 1 | 2 | 3
  /** Card is in exception / red-alert state */
  exception?: boolean
}

export default function SandboxCard({
  cardId,
  persona,
  children,
  className = '',
  exception,
}: SandboxCardProps) {
  const relevant = isRelevant(cardId, persona)
  const hero = isHero(cardId, persona)

  return (
    <motion.div
      animate={{
        opacity: relevant ? 1 : 0.35,
        scale: relevant ? 1 : 0.98,
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`flex min-h-0 flex-1 flex-col ${!relevant ? 'pointer-events-none' : ''} ${className}`}
      style={
        hero
          ? {
              boxShadow: '0 0 0 2px var(--figma-primary-main), 0 0 16px -4px rgba(88, 119, 120, 0.25)',
              borderRadius: 'var(--figma-radius-card-lg)',
            }
          : undefined
      }
    >
      <div className={`flex min-h-0 flex-1 flex-col ${exception ? 'card-exception' : ''}`}>
        {children}
      </div>
    </motion.div>
  )
}
