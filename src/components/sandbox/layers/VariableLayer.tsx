import { motion, AnimatePresence } from 'framer-motion'
import SandboxCard from '../SandboxCard'
import CardDescriptor from '../CardDescriptor'
import LayerSection from '../LayerSection'
import WeatherRiskCard from '../cards/WeatherRiskCard'
import PredecessorDelayCard from '../cards/PredecessorDelayCard'
import CriticalMaintenanceCard from '../cards/CriticalMaintenanceCard'
import type { HubData, SandboxPersona } from '../../../hooks/useHubData'
import { EASE_OUT_EXPO } from '../../../utils/motion'

interface VariableLayerProps {
  data: HubData
  persona: SandboxPersona
}

/** Small toggle switch for demo controls */
function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[12px]" style={{ color: 'var(--figma-text-secondary)' }}>
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1"
        style={{
          backgroundColor: checked ? 'var(--figma-primary-main)' : 'var(--figma-bg-outline)',
        }}
      >
        <span
          className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: checked ? 'translateX(18px)' : 'translateX(3px)' }}
        />
      </button>
    </label>
  )
}

const cardVariants = {
  initial: { opacity: 0, y: 16, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.96 },
}

const cardTransition = {
  duration: 0.4,
  ease: EASE_OUT_EXPO as unknown as number[],
}

export default function VariableLayer({ data, persona }: VariableLayerProps) {
  const { triggers } = data

  const activeCards = [
    triggers.isRaining && 'weather',
    triggers.isMilestoneSlipping && 'predecessor',
    triggers.hasFaultCodes && 'maintenance',
  ].filter(Boolean)

  const controls = (
    <>
      <Toggle label="Rain" checked={triggers.isRaining} onChange={triggers.setIsRaining} />
      <Toggle label="Milestone Slip" checked={triggers.isMilestoneSlipping} onChange={triggers.setIsMilestoneSlipping} />
      <Toggle label="Fault Codes" checked={triggers.hasFaultCodes} onChange={triggers.setHasFaultCodes} />
    </>
  )

  return (
    <LayerSection
      layerNumber={4}
      label="Variable"
      subtitle="Event-Driven Intelligence — cards appear only when triggered"
      controls={controls}
    >
      {activeCards.length === 0 && (
        <div
          className="flex items-center justify-center rounded-xl border-2 border-dashed px-6 py-12"
          style={{ borderColor: 'var(--figma-bg-outline)', color: 'var(--figma-text-tertiary)' }}
        >
          <p className="text-sm">No active events. Toggle a trigger above to see cards appear.</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-[var(--bento-gap)]">
        <AnimatePresence mode="popLayout">
          {triggers.isRaining && (
            <motion.div
              key="weather"
              layout
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={cardTransition}
            >
              <SandboxCard cardId="weatherRisk" persona={persona}>
                <CardDescriptor
                  value="Proactively surfaces weather risks before they strand crews and equipment. A 48-hour precipitation warning lets you shift indoor work forward instead of losing two days of production to standing water."
                  audience="Heavy Civil PMs, Superintendents, Schedulers."
                >
                  <WeatherRiskCard data={data.weatherRisk} />
                </CardDescriptor>
              </SandboxCard>
            </motion.div>
          )}
          {triggers.isMilestoneSlipping && (
            <motion.div
              key="predecessor"
              layout
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={cardTransition}
            >
              <SandboxCard cardId="predecessorDelay" persona={persona}>
                <CardDescriptor
                  value="When a predecessor task slips, every downstream trade is at risk. This card connects the delay to the impacted milestone so PMs can escalate to the GC immediately — not discover the cascade at the next OAC meeting."
                  audience="Specialty Contractors, Schedulers, Project Managers."
                >
                  <PredecessorDelayCard data={data.predecessorDelay} />
                </CardDescriptor>
              </SandboxCard>
            </motion.div>
          )}
          {triggers.hasFaultCodes && (
            <motion.div
              key="maintenance"
              layout
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={cardTransition}
            >
              <SandboxCard cardId="criticalMaintenance" persona={persona} exception>
                <CardDescriptor
                  value="Telematics fault codes mean a machine is about to fail. This card turns raw diagnostic data into a dispatch action — preventing a $50k repair that starts as a $500 fix if caught early."
                  audience="Equipment Managers, Fleet Maintenance, Heavy Civil PMs."
                >
                  <CriticalMaintenanceCard data={data.equipmentFaultCodes} />
                </CardDescriptor>
              </SandboxCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayerSection>
  )
}
