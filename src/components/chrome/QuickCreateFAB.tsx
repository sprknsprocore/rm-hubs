import { useState, useRef, useCallback } from 'react'
import { Plus, FileText, ClipboardList, AlertCircle, Truck, Fuel, BookOpen } from 'lucide-react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import type { Persona } from '../../types/lem'

const FAB_MAGNETIC_RADIUS = 48
const FAB_MAGNETIC_STRENGTH = 0.2
const FAB_OFFSET_CAP = 14

type FABOption = { id: string; label: string; icon: React.ReactNode; onClick: () => void }

const SPECIALTY_OPTIONS: FABOption[] = [
  {
    id: 'new-timesheet',
    label: 'New timesheet',
    icon: <FileText className="h-4 w-4" />,
    onClick: () => window.history.pushState({}, '', '/timesheets/new'),
  },
  {
    id: 'log-production',
    label: 'Log production',
    icon: <ClipboardList className="h-4 w-4" />,
    onClick: () => window.history.pushState({}, '', '/production/log'),
  },
  {
    id: 'new-delay-event',
    label: 'New delay event',
    icon: <AlertCircle className="h-4 w-4" />,
    onClick: () => window.history.pushState({}, '', '/delay-events/new'),
  },
]

const HEAVY_CIVIL_OPTIONS: FABOption[] = [
  {
    id: 'request-equipment',
    label: 'Request equipment',
    icon: <Truck className="h-4 w-4" />,
    onClick: () => window.history.pushState({}, '', '/equipment/request'),
  },
  {
    id: 'log-fuel-service',
    label: 'Log fuel / service',
    icon: <Fuel className="h-4 w-4" />,
    onClick: () => window.history.pushState({}, '', '/equipment/fuel-service'),
  },
  {
    id: 'daily-log',
    label: 'Daily log',
    icon: <BookOpen className="h-4 w-4" />,
    onClick: () => window.history.pushState({}, '', '/daily-log'),
  },
]

function getOptionsForPersona(persona: Persona): FABOption[] {
  if (persona === 'specialty') return SPECIALTY_OPTIONS
  return HEAVY_CIVIL_OPTIONS
}

interface QuickCreateFABProps {
  persona: Persona
  /** When true, position FAB to the left of the Actions drawer so it doesn't overlap. */
  actionsDrawerOpen?: boolean
}

export default function QuickCreateFAB({ persona, actionsDrawerOpen = false }: QuickCreateFABProps) {
  const [open, setOpen] = useState(false)
  const options = getOptionsForPersona(persona)
  const containerRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 25 })
  const springY = useSpring(y, { stiffness: 300, damping: 25 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < FAB_MAGNETIC_RADIUS) {
        const pull = (1 - dist / FAB_MAGNETIC_RADIUS) * FAB_MAGNETIC_STRENGTH
        const ox = Math.max(-FAB_OFFSET_CAP, Math.min(FAB_OFFSET_CAP, dx * pull))
        const oy = Math.max(-FAB_OFFSET_CAP, Math.min(FAB_OFFSET_CAP, dy * pull))
        x.set(ox)
        y.set(oy)
      } else {
        x.set(0)
        y.set(0)
      }
    },
    [x, y]
  )
  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 z-40 flex flex-col items-end gap-2"
      style={{
        right: actionsDrawerOpen ? 'calc(1.5rem + var(--figma-drawer-width))' : '1.5rem',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {open && (
        <div
          className="flex flex-col gap-1 rounded-lg border py-1 shadow-lg"
          style={{
            backgroundColor: 'var(--figma-bg-default)',
            borderColor: 'var(--figma-bg-outline)',
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                opt.onClick()
                setOpen(false)
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-1"
              style={{ color: 'var(--figma-text-primary)' }}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      )}
      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2"
        style={{
          backgroundColor: 'var(--figma-primary-orange)',
          color: '#fff',
          boxShadow: '0 4px 14px rgba(255, 82, 0, 0.4)',
          x: springX,
          y: springY,
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'tween', duration: 0.2 }}
        aria-label={open ? 'Close menu' : 'Create new'}
        aria-expanded={open}
      >
        <Plus className="h-7 w-7" strokeWidth={2.5} />
      </motion.button>
    </div>
  )
}
