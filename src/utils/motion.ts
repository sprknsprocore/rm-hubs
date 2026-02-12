/** Shared motion constants for LEM Hub (Stripe-level feel). */

/** Ease-out-expo – Stripe-style easing for Bento and tweened transitions. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

/** Spring for drawer / general bounce-back. */
export const SPRING_BOUNCE = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
}

/** Spring for S-Curve tooltip (1:1 follow-through). */
export const SPRING_TOOLTIP = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
}

/** Duration for light micro-interactions (keep < 300ms). */
export const DURATION_FAST = 0.28

/** Duration for Bento staggered entrance. */
export const BENTO_DURATION = 0.5
export const BENTO_STAGGER_DELAY = 0.05
