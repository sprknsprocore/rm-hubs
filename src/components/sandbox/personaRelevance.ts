import type { SandboxPersona } from '../../hooks/useHubData'

/** Card IDs used across the sandbox */
export type SandboxCardId =
  // Layer 1
  | 'performanceGauge'
  | 'budgetVsActual'
  | 'projectedMargin'
  | 'portfolioHeatmap'
  | 'earnedValue'
  | 'workforceCount'
  | 'dailyHuddle'
  | 'burnCurve'
  | 'productionHealth'
  // Layer 2
  | 'laborSCurve'
  | 'equipmentUtilization'
  | 'materialYield'
  | 'allocationPlan'
  | 'utilizationTrend'
  | 'commandCenterMap'
  | 'earthMover'
  | 'milestoneTracker'
  | 'capacityDemand'
  | 'cycleTime'
  | 'wbsHeatmap'
  // Layer 3
  | 'zeroActivity'
  | 'expiringCerts'
  | 'missingProduction'
  | 'unapprovedTimesheets'
  | 'dearGc'
  | 'skillsetGap'
  // Layer 4
  | 'weatherRisk'
  | 'predecessorDelay'
  | 'criticalMaintenance'
  | 'milestoneBuffer'
  // Layer 5
  | 'smartBench'
  | 'bidSimulator'
  | 'historicalBenchmark'
  | 'scenarioPlanning'
  | 'fuelTrends'
  | 'goldenThreadTimeline'

/** Which personas find each card relevant. undefined = relevant to all. */
const RELEVANCE_MAP: Record<SandboxCardId, SandboxPersona[] | undefined> = {
  // Layer 1 – Evergreen: visible to all
  performanceGauge: undefined,
  budgetVsActual: undefined,
  projectedMargin: undefined,
  portfolioHeatmap: undefined,
  earnedValue: undefined,
  workforceCount: undefined,
  dailyHuddle: ['heavyCivil', 'specialty'],
  burnCurve: ['specialty', 'planner'],
  productionHealth: undefined,

  // Layer 2 – LEM Specific
  laborSCurve: ['specialty', 'planner'],
  equipmentUtilization: ['heavyCivil'],
  materialYield: ['heavyCivil', 'specialty'],
  allocationPlan: ['planner', 'specialty'],
  utilizationTrend: ['heavyCivil'],
  commandCenterMap: ['heavyCivil'],
  earthMover: ['heavyCivil'],
  milestoneTracker: ['specialty', 'planner'],
  capacityDemand: ['planner'],
  cycleTime: ['heavyCivil'],
  wbsHeatmap: ['specialty', 'planner'],

  // Layer 3 – Actionable
  zeroActivity: ['heavyCivil'],
  expiringCerts: ['heavyCivil', 'specialty'],
  missingProduction: ['specialty'],
  unapprovedTimesheets: ['specialty', 'planner'],
  dearGc: ['specialty'],
  skillsetGap: ['planner', 'specialty'],

  // Layer 4 – Variable
  weatherRisk: ['heavyCivil'],
  predecessorDelay: ['specialty', 'planner'],
  criticalMaintenance: ['heavyCivil'],
  milestoneBuffer: ['specialty', 'planner'],

  // Layer 5 – Extra
  smartBench: ['planner'],
  bidSimulator: ['planner'],
  historicalBenchmark: ['specialty'],
  scenarioPlanning: ['planner', 'specialty'],
  fuelTrends: ['heavyCivil'],
  goldenThreadTimeline: ['heavyCivil', 'specialty'],
}

/** Hero cards: get ring highlight when their persona is active */
const HERO_MAP: Partial<Record<SandboxPersona, SandboxCardId[]>> = {
  heavyCivil: ['equipmentUtilization', 'zeroActivity', 'utilizationTrend', 'commandCenterMap', 'earthMover'],
  specialty: ['performanceGauge', 'laborSCurve', 'earnedValue', 'productionHealth', 'burnCurve'],
  planner: ['smartBench', 'bidSimulator', 'allocationPlan', 'capacityDemand', 'wbsHeatmap'],
}

export function isRelevant(cardId: SandboxCardId, persona: SandboxPersona): boolean {
  const personas = RELEVANCE_MAP[cardId]
  return personas === undefined || personas.includes(persona)
}

export function isHero(cardId: SandboxCardId, persona: SandboxPersona): boolean {
  return HERO_MAP[persona]?.includes(cardId) ?? false
}
