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
  // Layer 2
  | 'laborSCurve'
  | 'equipmentUtilization'
  | 'materialYield'
  | 'allocationPlan'
  | 'utilizationTrend'
  // Layer 3
  | 'zeroActivity'
  | 'expiringCerts'
  | 'missingProduction'
  | 'unapprovedTimesheets'
  // Layer 4
  | 'weatherRisk'
  | 'predecessorDelay'
  | 'criticalMaintenance'
  // Layer 5
  | 'smartBench'
  | 'bidSimulator'
  | 'historicalBenchmark'
  | 'scenarioPlanning'
  | 'fuelTrends'

/** Which personas find each card relevant. undefined = relevant to all. */
const RELEVANCE_MAP: Record<SandboxCardId, SandboxPersona[] | undefined> = {
  // Layer 1 – Evergreen: visible to all
  performanceGauge: undefined,
  budgetVsActual: undefined,
  projectedMargin: undefined,
  portfolioHeatmap: undefined,
  earnedValue: undefined,
  workforceCount: undefined,

  // Layer 2 – LEM Specific
  laborSCurve: ['specialty', 'planner'],
  equipmentUtilization: ['heavyCivil'],
  materialYield: ['heavyCivil', 'specialty'],
  allocationPlan: ['planner', 'specialty'],
  utilizationTrend: ['heavyCivil'],

  // Layer 3 – Actionable
  zeroActivity: ['heavyCivil'],
  expiringCerts: ['heavyCivil', 'specialty'],
  missingProduction: ['specialty'],
  unapprovedTimesheets: ['specialty', 'planner'],

  // Layer 4 – Variable
  weatherRisk: ['heavyCivil'],
  predecessorDelay: ['specialty', 'planner'],
  criticalMaintenance: ['heavyCivil'],

  // Layer 5 – Extra
  smartBench: ['planner'],
  bidSimulator: ['planner'],
  historicalBenchmark: ['specialty'],
  scenarioPlanning: ['planner', 'specialty'],
  fuelTrends: ['heavyCivil'],
}

/** Hero cards: get ring highlight when their persona is active */
const HERO_MAP: Partial<Record<SandboxPersona, SandboxCardId[]>> = {
  heavyCivil: ['equipmentUtilization', 'zeroActivity', 'utilizationTrend'],
  specialty: ['performanceGauge', 'laborSCurve', 'earnedValue'],
  planner: ['smartBench', 'bidSimulator', 'allocationPlan'],
}

export function isRelevant(cardId: SandboxCardId, persona: SandboxPersona): boolean {
  const personas = RELEVANCE_MAP[cardId]
  return personas === undefined || personas.includes(persona)
}

export function isHero(cardId: SandboxCardId, persona: SandboxPersona): boolean {
  return HERO_MAP[persona]?.includes(cardId) ?? false
}
