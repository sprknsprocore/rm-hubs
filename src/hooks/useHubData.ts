import { useMemo, useState, useCallback } from 'react'
import { getUnifiedLemPayload } from '../api/mockLemApi'

// ── Sandbox-specific types ──────────────────────────────────────────

export type SandboxPersona = 'heavyCivil' | 'specialty' | 'planner'

export interface PerformanceFactorData {
  budgetedHours: number
  percentComplete: number
  actualHours: number
  pf: number // (budgetedHours * %Comp) / actualHours
}

export interface BudgetVsActualPoint {
  month: string
  budgeted: number
  actual: number
}

export interface ProjectedMarginData {
  currentMarginPct: number
  projectedMarginPct: number
  sparkline: number[]
  trend: 'up' | 'down' | 'flat'
}

export interface PortfolioProject {
  id: string
  name: string
  cpi: number
  status: 'green' | 'yellow' | 'red'
}

export interface EquipmentUtilizationData {
  engineOnHours: number
  onSiteHours: number
  utilizationPct: number
}

export interface MaterialYieldItem {
  costCode: string
  designTakeoff: number
  actualInstall: number
  unit: string
}

export interface ZeroActivityAlert {
  id: string
  assetId: string
  assetType: string
  site: string
  daysIdle: number
  dailyCost: number
}

export interface ExpiringCert {
  id: string
  workerName: string
  certType: string
  expiryDate: string
  daysUntilExpiry: number
}

export interface MissingProductionItem {
  id: string
  costCode: string
  hoursLogged: number
  unitsReported: number
}

export interface UnapprovedTimesheet {
  id: string
  foremanName: string
  crewSize: number
  date: string
  totalHours: number
}

export interface WeatherRiskData {
  site: string
  precipitationPct: number
  forecast: string
  estimatedDelayDays: number
}

export interface PredecessorDelayData {
  taskName: string
  predecessorName: string
  delayDays: number
  impactedTrade: string
}

export interface FaultCodeData {
  id: string
  equipmentId: string
  equipmentType: string
  code: string
  severity: 'critical' | 'warning'
  description: string
}

export interface BenchWorker {
  id: string
  name: string
  role: string
  tags: string[]
  status: 'Available' | 'Partial'
  allocation: number
}

export interface BidOpportunity {
  id: string
  name: string
  demandFTE: number
  confidence: number
  won: boolean
  skillTags: string[]
}

export interface HistoricalBenchmarkData {
  costCode: string
  currentRate: number
  companyBest: number
  unit: string
}

export interface FuelTrendPoint {
  week: string
  gallons: number
  cost: number
}

// ── New card types ──────────────────────────────────────────────────

export interface EarnedValueData {
  actualCost: number
  scheduledCost: number
  toDateCost: number
  earnedValue: number
  estAtCompletion: number
  totalBudget: number
  cpi: number
  spi: number
  costVariance: number
  scheduleVariance: number
  billingStatus: 'under_budget' | 'over_budget' | 'cost_in_excess'
  /** Monthly time-series for chart with L/M/E breakdown */
  timeSeries: EarnedValueTimePoint[]
}

export interface EarnedValueTimePoint {
  month: string
  actual: number
  scheduled: number
  budgeted: number
  labor: number
  materials: number
  equipment: number
}

export interface AllocationPlanPoint {
  month: string
  assigned: number
  allocated: number
  requested: number
}

export interface UtilizationTrendPoint {
  month: string
  actual: number
  scheduled: number
}

export interface ScenarioPlanningData {
  baseline: {
    actualCost: number
    scheduledCost: number
    toDateCost: number
    estAtCompletion: number
    totalBudget: number
  }
  scenarios: CostScenario[]
}

export interface CostScenario {
  id: string
  label: string
  description: string
  costImpactPct: number
  active: boolean
}

// ── Variable layer triggers ─────────────────────────────────────────

export interface VariableTriggers {
  isRaining: boolean
  isMilestoneSlipping: boolean
  hasFaultCodes: boolean
  setIsRaining: (v: boolean) => void
  setIsMilestoneSlipping: (v: boolean) => void
  setHasFaultCodes: (v: boolean) => void
}

// ── Full hub data shape ─────────────────────────────────────────────

export interface HubData {
  // Layer 1: Evergreen
  performanceFactor: PerformanceFactorData
  budgetVsActual: BudgetVsActualPoint[]
  projectedMargin: ProjectedMarginData
  workforceCount: { planned: number; actual: number }
  portfolioHealth: PortfolioProject[]
  earnedValue: EarnedValueData

  // Layer 2: LEM Specific
  laborSCurve: {
    planned: { weekId: string; value: number }[]
    actual: { weekId: string; value: number }[]
    forecast: { weekId: string; value: number }[]
  }
  equipmentUtilization: EquipmentUtilizationData
  materialYield: MaterialYieldItem[]
  allocationPlan: AllocationPlanPoint[]
  utilizationTrend: UtilizationTrendPoint[]

  // Layer 3: Actionable
  zeroActivityAlerts: ZeroActivityAlert[]
  expiringCerts: ExpiringCert[]
  missingProduction: MissingProductionItem[]
  unapprovedTimesheets: UnapprovedTimesheet[]

  // Layer 4: Variable
  weatherRisk: WeatherRiskData
  predecessorDelay: PredecessorDelayData
  equipmentFaultCodes: FaultCodeData[]

  // Layer 5: Extra
  smartBench: BenchWorker[]
  bidSimulator: {
    opportunities: BidOpportunity[]
    capacityBaselineFTE: number
  }
  fuelTrends: FuelTrendPoint[]
  historicalBenchmark: HistoricalBenchmarkData[]
  scenarioPlanning: ScenarioPlanningData

  // Variable triggers
  triggers: VariableTriggers
}

// ── Hook ────────────────────────────────────────────────────────────

export function useHubData(): HubData {
  const unified = useMemo(() => getUnifiedLemPayload(), [])

  // Variable layer toggles (state)
  const [isRaining, setIsRaining] = useState(true)
  const [isMilestoneSlipping, setIsMilestoneSlipping] = useState(true)
  const [hasFaultCodes, setHasFaultCodes] = useState(true)

  const triggers: VariableTriggers = {
    isRaining,
    isMilestoneSlipping,
    hasFaultCodes,
    setIsRaining: useCallback((v: boolean) => setIsRaining(v), []),
    setIsMilestoneSlipping: useCallback((v: boolean) => setIsMilestoneSlipping(v), []),
    setHasFaultCodes: useCallback((v: boolean) => setHasFaultCodes(v), []),
  }

  return useMemo(() => {
    // ── Layer 1: Evergreen ──
    const budgetedHours = 4800
    const percentComplete = 0.62
    const actualHours = 3120
    const pf = (budgetedHours * percentComplete) / actualHours

    const performanceFactor: PerformanceFactorData = {
      budgetedHours,
      percentComplete,
      actualHours,
      pf,
    }

    const budgetVsActual: BudgetVsActualPoint[] = [
      { month: 'Jan', budgeted: 120000, actual: 115000 },
      { month: 'Feb', budgeted: 240000, actual: 248000 },
      { month: 'Mar', budgeted: 380000, actual: 395000 },
      { month: 'Apr', budgeted: 520000, actual: 558000 },
      { month: 'May', budgeted: 680000, actual: 710000 },
      { month: 'Jun', budgeted: 840000, actual: 862000 },
    ]

    const projectedMargin: ProjectedMarginData = {
      currentMarginPct: 8.2,
      projectedMarginPct: 6.4,
      sparkline: [9.1, 8.8, 8.5, 8.2, 7.8, 7.2, 6.8, 6.4],
      trend: 'down',
    }

    const workforceCount = { planned: 142, actual: 128 }

    const portfolioHealth: PortfolioProject[] = [
      { id: 'building-a', name: 'Building A', cpi: 0.96, status: 'yellow' },
      { id: 'seattle-corridor', name: 'Seattle Corridor', cpi: 0.82, status: 'red' },
      { id: 'skyline', name: 'Skyline Tower', cpi: 1.04, status: 'green' },
      { id: 'metro-mall', name: 'Metro Mall', cpi: 0.98, status: 'green' },
      { id: 'harbor-view', name: 'Harbor View', cpi: 1.12, status: 'green' },
    ]

    // ── Layer 2: LEM Specific ──
    const laborSCurve = {
      planned: unified.laborData.sCurve.planned.map((v, i) => ({ weekId: `W${i}`, value: v })),
      actual: unified.laborData.sCurve.actual.map((v, i) => ({ weekId: `W${i}`, value: v })),
      forecast: unified.laborData.sCurve.forecast.map((v, i) => ({ weekId: `W${i}`, value: v ?? 0 })),
    }

    const equipmentUtilization: EquipmentUtilizationData = {
      engineOnHours: 1840,
      onSiteHours: 2400,
      utilizationPct: Math.round((1840 / 2400) * 100),
    }

    const materialYield: MaterialYieldItem[] = [
      { costCode: 'Concrete', designTakeoff: 1200, actualInstall: 1320, unit: 'CY' },
      { costCode: 'Structural Steel', designTakeoff: 450, actualInstall: 445, unit: 'LF' },
      { costCode: 'Conduit', designTakeoff: 3200, actualInstall: 2980, unit: 'LF' },
      { costCode: 'Drywall', designTakeoff: 8500, actualInstall: 8200, unit: 'SF' },
    ]

    // ── Layer 3: Actionable ──
    const zeroActivityAlerts: ZeroActivityAlert[] = unified.equipmentData.telematics
      .filter((t) => t.daysInactive >= 3)
      .map((t) => ({
        id: t.id,
        assetId: t.id,
        assetType: t.type,
        site: t.site ?? 'Unknown',
        daysIdle: t.daysInactive,
        dailyCost: 500,
      }))

    const expiringCerts: ExpiringCert[] = [
      { id: 'ec1', workerName: 'Marcus Rivera', certType: 'OSHA 30', expiryDate: '2026-02-22', daysUntilExpiry: 11 },
      { id: 'ec2', workerName: 'James Chen', certType: 'Crane Operator', expiryDate: '2026-02-24', daysUntilExpiry: 13 },
      { id: 'ec3', workerName: 'Tony Vasquez', certType: 'OSHA 10', expiryDate: '2026-02-19', daysUntilExpiry: 8 },
    ]

    const missingProduction: MissingProductionItem[] = [
      { id: 'mp1', costCode: '03 30 00 - Cast-in-Place', hoursLogged: 24, unitsReported: 0 },
      { id: 'mp2', costCode: '09 91 00 - Painting', hoursLogged: 16, unitsReported: 0 },
    ]

    const unapprovedTimesheets: UnapprovedTimesheet[] = [
      { id: 'ut1', foremanName: 'Bill Harper', crewSize: 8, date: '2026-02-10', totalHours: 64 },
      { id: 'ut2', foremanName: 'Ana Morales', crewSize: 6, date: '2026-02-10', totalHours: 48 },
      { id: 'ut3', foremanName: 'Dan Kowalski', crewSize: 12, date: '2026-02-09', totalHours: 96 },
    ]

    // ── Layer 4: Variable ──
    const weatherRisk: WeatherRiskData = {
      site: 'Site B',
      precipitationPct: 72,
      forecast: 'Heavy rain predicted Wed-Thu. Ground saturation likely.',
      estimatedDelayDays: 2,
    }

    const predecessorDelay: PredecessorDelayData = {
      taskName: 'Electrical Rough-in',
      predecessorName: 'Slab Pour',
      delayDays: 4,
      impactedTrade: 'Electrical',
    }

    const equipmentFaultCodes: FaultCodeData[] = [
      {
        id: 'fc1',
        equipmentId: 'EXC-092',
        equipmentType: 'Excavator',
        code: 'P0420',
        severity: 'critical',
        description: 'Hydraulic pressure below threshold',
      },
      {
        id: 'fc2',
        equipmentId: 'DZ-101',
        equipmentType: 'Dozer',
        code: 'E1205',
        severity: 'warning',
        description: 'Engine coolant temperature high',
      },
    ]

    // ── Layer 5: Extra ──
    const smartBench: BenchWorker[] = [
      { id: 'sb1', name: 'Lane Staley', role: 'Project Manager', tags: ['Amazon Exp', 'West Coast', 'OSHA 30'], status: 'Available', allocation: 0 },
      { id: 'sb2', name: 'Kim Nguyen', role: 'PLC Specialist', tags: ['PLC Dev', 'Siemens', 'Allen-Bradley'], status: 'Available', allocation: 0 },
      { id: 'sb3', name: 'Derek Holt', role: 'Journeyman Electrician', tags: ['OSHA 30', 'Data Center', 'High Voltage'], status: 'Partial', allocation: 0.3 },
      { id: 'sb4', name: 'Maria Santos', role: 'Safety Engineer', tags: ['OSHA 500', 'Confined Space', 'Bilingual'], status: 'Available', allocation: 0 },
    ]

    const bidSimulator = {
      opportunities: unified.bidSimulator.pendingProjects.map((p) => ({
        id: p.id,
        name: p.name,
        demandFTE: p.demandFTE,
        confidence: p.confidence,
        won: false,
        skillTags: p.skillTags ?? [],
      })),
      capacityBaselineFTE: unified.bidSimulator.capacityBaselineFTE,
    }

    const fuelTrends: FuelTrendPoint[] = [
      { week: 'W1', gallons: 2400, cost: 8160 },
      { week: 'W2', gallons: 2200, cost: 7480 },
      { week: 'W3', gallons: 2650, cost: 9010 },
      { week: 'W4', gallons: 2100, cost: 7140 },
      { week: 'W5', gallons: 2350, cost: 7990 },
    ]

    const historicalBenchmark: HistoricalBenchmarkData[] = [
      { costCode: '03 30 00 - Concrete', currentRate: 3.2, companyBest: 4.1, unit: 'CY/hr' },
      { costCode: '05 50 00 - Metal Fab', currentRate: 5.8, companyBest: 6.2, unit: 'LF/hr' },
      { costCode: '09 91 00 - Painting', currentRate: 120, companyBest: 145, unit: 'SF/hr' },
    ]

    // ── Earned Value Management ──
    const earnedValue: EarnedValueData = {
      actualCost: 35000,
      scheduledCost: 9000,
      toDateCost: 35000,
      earnedValue: 79000,
      estAtCompletion: 126985.5,
      totalBudget: 150000,
      cpi: 79000 / 35000,           // ~2.26 (earned / actual)
      spi: 79000 / 9000,            // ~8.78 (earned / scheduled) — ahead
      costVariance: 79000 - 35000,  // 44,000 positive = under budget
      scheduleVariance: 79000 - 9000, // 70,000 positive = ahead of schedule
      billingStatus: 'under_budget',
      timeSeries: [
        { month: '01/24', actual: 4200, scheduled: 3800, budgeted: 4000, labor: 2100, materials: 1400, equipment: 700 },
        { month: '02/24', actual: 5100, scheduled: 4500, budgeted: 4800, labor: 2550, materials: 1700, equipment: 850 },
        { month: '03/24', actual: 4800, scheduled: 5200, budgeted: 5000, labor: 2400, materials: 1600, equipment: 800 },
        { month: '04/24', actual: 7200, scheduled: 5800, budgeted: 6000, labor: 3600, materials: 2400, equipment: 1200 },
        { month: '05/24', actual: 5500, scheduled: 6200, budgeted: 6500, labor: 2750, materials: 1830, equipment: 920 },
        { month: '06/24', actual: 6100, scheduled: 6800, budgeted: 7000, labor: 3050, materials: 2030, equipment: 1020 },
        { month: '07/24', actual: 6800, scheduled: 7200, budgeted: 7500, labor: 3400, materials: 2270, equipment: 1130 },
        { month: '08/24', actual: 7400, scheduled: 7800, budgeted: 8000, labor: 3700, materials: 2470, equipment: 1230 },
        { month: '09/24', actual: 6500, scheduled: 7000, budgeted: 7200, labor: 3250, materials: 2170, equipment: 1080 },
        { month: '10/24', actual: 5800, scheduled: 6200, budgeted: 6500, labor: 2900, materials: 1930, equipment: 970 },
      ],
    }

    // ── Allocation Plan ──
    const allocationPlan: AllocationPlanPoint[] = [
      { month: '01/24', assigned: 68, allocated: 82, requested: 90 },
      { month: '02/24', assigned: 72, allocated: 85, requested: 92 },
      { month: '03/24', assigned: 75, allocated: 88, requested: 90 },
      { month: '04/24', assigned: 70, allocated: 84, requested: 88 },
      { month: '05/24', assigned: 73, allocated: 86, requested: 91 },
      { month: '06/24', assigned: 76, allocated: 88, requested: 93 },
      { month: '07/24', assigned: 74, allocated: 85, requested: 90 },
      { month: '08/24', assigned: 71, allocated: 82, requested: 88 },
      { month: '09/24', assigned: 69, allocated: 80, requested: 86 },
      { month: '10/24', assigned: 72, allocated: 84, requested: 90 },
      { month: '11/24', assigned: 68, allocated: 78, requested: 85 },
    ]

    // ── Equipment Utilization Rate Trend ──
    const utilizationTrend: UtilizationTrendPoint[] = [
      { month: '01/24', actual: 62, scheduled: 65 },
      { month: '02/24', actual: 58, scheduled: 65 },
      { month: '03/24', actual: 55, scheduled: 60 },
      { month: '04/24', actual: 78, scheduled: 70 },
      { month: '05/24', actual: 85, scheduled: 72 },
      { month: '06/24', actual: 72, scheduled: 68 },
      { month: '07/24', actual: 68, scheduled: 65 },
      { month: '08/24', actual: 74, scheduled: 70 },
      { month: '09/24', actual: 65, scheduled: 62 },
      { month: '10/24', actual: 55, scheduled: 58 },
      { month: '11/24', actual: 48, scheduled: 55 },
    ]

    // ── Scenario Planning ──
    const scenarioPlanning: ScenarioPlanningData = {
      baseline: {
        actualCost: 35000,
        scheduledCost: 9000,
        toDateCost: 35000,
        estAtCompletion: 126985.5,
        totalBudget: 150000,
      },
      scenarios: [
        { id: 'sc1', label: 'Material +10%', description: 'Material prices increase 10% from current', costImpactPct: 4.2, active: false },
        { id: 'sc2', label: 'Overtime Crew', description: 'Add 20% overtime to accelerate schedule', costImpactPct: 8.5, active: false },
        { id: 'sc3', label: 'Weather Delay', description: '2-week weather delay on excavation', costImpactPct: 3.1, active: false },
        { id: 'sc4', label: 'Subcontractor Change', description: 'Switch to higher-cost sub for electrical', costImpactPct: 6.0, active: false },
      ],
    }

    return {
      performanceFactor,
      budgetVsActual,
      projectedMargin,
      workforceCount,
      portfolioHealth,
      earnedValue,
      laborSCurve,
      equipmentUtilization,
      materialYield,
      allocationPlan,
      utilizationTrend,
      zeroActivityAlerts,
      expiringCerts,
      missingProduction,
      unapprovedTimesheets,
      weatherRisk,
      predecessorDelay,
      equipmentFaultCodes,
      smartBench,
      bidSimulator,
      fuelTrends,
      historicalBenchmark,
      scenarioPlanning,
      triggers,
    }
  }, [unified, triggers])
}
