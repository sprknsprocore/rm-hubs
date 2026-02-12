import BentoGrid from '../../layout/BentoGrid'
import SandboxCard from '../SandboxCard'
import CardDescriptor from '../CardDescriptor'
import LayerSection from '../LayerSection'
import ZeroActivityCard from '../cards/ZeroActivityCard'
import ExpiringCertsCard from '../cards/ExpiringCertsCard'
import MissingProductionCard from '../cards/MissingProductionCard'
import UnapprovedTimesheetsCard from '../cards/UnapprovedTimesheetsCard'
import DearGcCard from '../cards/DearGcCard'
import SkillsetGapCard from '../cards/SkillsetGapCard'
import type { HubData, Persona } from '../../../hooks/useHubData'

interface ActionableLayerProps {
  data: HubData
  persona: Persona
}

export default function ActionableLayer({ data, persona }: ActionableLayerProps) {
  return (
    <LayerSection
      layerNumber={3}
      label="Actionable Insights"
      subtitle="Exceptions and alerts that need attention today."
    >
      <BentoGrid columns={2}>
        <SandboxCard cardId="zeroActivity" persona={persona} exception>
          <CardDescriptor
            value="Every day idle equipment sits on-site is cash burning. This card quantifies the daily rental leakage in dollars and surfaces the specific assets so you can off-rent with one click instead of discovering the cost at invoice time."
            audience="Equipment Managers, Heavy Civil PMs, Cost Engineers."
          >
            <ZeroActivityCard data={data.zeroActivityAlerts} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="expiringCerts" persona={persona} exception>
          <CardDescriptor
            value="A single expired OSHA cert can shut down an entire site. This card gives you a 14-day runway to schedule training and avoid compliance shutdowns that cost far more than the training itself."
            audience="Safety Managers, Project Managers, HR/Compliance."
          >
            <ExpiringCertsCard data={data.expiringCerts} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="missingProduction" persona={persona}>
          <CardDescriptor
            value="Hours logged without production units make Performance Factor calculations impossible. This card identifies the exact cost codes so foremen can backfill quantities the same day — keeping the EVM math honest."
            audience="Project Managers, Field Engineers, Foremen."
          >
            <MissingProductionCard data={data.missingProduction} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="unapprovedTimesheets" persona={persona} exception>
          <CardDescriptor
            value="Unapproved timesheets delay payroll, distort cost reports, and block accurate forecasting. This card lists every pending approval so PMs can clear the queue in minutes, not discover the backlog at period close."
            audience="Project Managers, Payroll Coordinators, Controllers."
          >
            <UnapprovedTimesheetsCard data={data.unapprovedTimesheets} />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="dearGc" persona={persona}>
          <CardDescriptor
            value="When a predecessor delay impacts your scope, a formal GC notification protects your contractual position and starts the documented record. This card auto-drafts the letter from project data."
            audience="Specialty Contractors, Project Managers, Contract Administrators."
          >
            <DearGcCard />
          </CardDescriptor>
        </SandboxCard>
        <SandboxCard cardId="skillsetGap" persona={persona} exception>
          <CardDescriptor
            value="Highlights roles where assigned headcount falls short of project requirements. Gaps need immediate Smart Bench or external sourcing action — waiting means starting a trade short-handed."
            audience="Resource Planners, Operations Directors, Engineering Planners."
          >
            <SkillsetGapCard data={data.skillsetGap} />
          </CardDescriptor>
        </SandboxCard>
      </BentoGrid>
    </LayerSection>
  )
}
