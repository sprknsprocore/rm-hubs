import type {
  Persona,
  NextBestAction,
  NextBestActionPriority,
  HeavyCivilPayload,
  SpecialtyPayload,
  PlannerPayload,
  UnifiedLemPayload,
  GlobalAlert,
  EquipmentPin,
  LaborCurves,
  LaborSeriesPoint,
  Milestone,
  Opportunity,
  BenchEmployee,
  MaintenanceRedFlag,
  LaborBurnCurvePayload,
  ReconciliationData,
  ReconciliationRow,
  DailyHuddleRecap,
  ProjectSummary,
  ProjectData,
  WbsCode,
  FieldLog,
  MaterialUsageItem,
  ProjectRedFlag,
} from '../types/lem'

// Single source of truth: unified LEM payload
export function getUnifiedLemPayload(): UnifiedLemPayload {
  return {
    hubMetadata: {
      organization: 'Diversified Automation / GECO',
      lastUnifiedSync: '2026-02-09T10:00:00Z',
      availablePersonas: ['Heavy Civil Ops', 'Enterprise Specialty', 'Engineering Planner'],
    },
    globalAlerts: [
      {
        id: 'risk_001',
        severity: 'high',
        type: 'Rental',
        message: '3 units idle >72 hrs on site. Rental leakage.',
        action: 'Request demobilization',
        financialRiskAmount: 1500,
        financialRiskLabel: 'Rental leak costing $1.5k/day',
      },
      {
        id: 'risk_002',
        severity: 'high',
        type: 'Weather',
        message: 'Site B: rain delay predicted. Excavator utilization at risk.',
        action: 'Shift schedule',
      },
      {
        id: 'risk_003',
        severity: 'medium',
        type: 'Compliance',
        message: '3 operators with expiring OSHA certs, Texas.',
        action: 'Assign training',
      },
      {
        id: 'risk_004',
        severity: 'low',
        type: 'Capacity',
        message: 'Bench above target. Consider reassignment.',
        action: 'View hiring plan',
      },
    ],
    laborData: {
      sCurve: {
        planned: [100, 250, 400, 600, 850],
        actual: [95, 210, 320, 520],
        forecast: [null, null, null, 500, 750],
        insight: '4 weeks behind labor spend; 50% structure complete.',
      },
      burnCurve: {
        periodIds: ['W0', 'W1', 'W2', 'W3', 'W4'],
        hoursSpentPct: [15, 35, 55, 72, 88],
        workCompletePct: [12, 28, 48, 60, 72],
        benchmarkPct: [18, 38, 58, 75, 92],
        insight: 'Delay risk: 72% work complete < 88% hours spent in W2–W4.',
        delayFlag: true,
      },
      varianceReason: 'Area 2 Slab delayed by GC.',
      projectedOverrunHours: 120,
      bench: [
        {
          name: 'Lane Staley',
          role: 'Project Manager',
          tags: ['Amazon Exp', 'West Coast'],
          status: 'Available',
          allocation: 0.0,
        },
      ],
      unfilledRequests: [
        { role: 'Journeyman', site: 'Site A', count: 5, priority: 'High' },
      ],
    },
    equipmentData: {
      telematics: [
        {
          id: 'EXC-092',
          type: 'Excavator',
          status: 'Idle',
          daysInactive: 5,
          location: { lat: 47.6062, lng: -122.3321 },
          health: 'Red',
          site: 'Site A',
        },
        {
          id: 'LD-045',
          type: 'Loader',
          status: 'Idle',
          daysInactive: 6,
          location: { lat: 47.605, lng: -122.330 },
          health: 'Yellow',
          site: 'Site B',
        },
        {
          id: 'HT-033',
          type: 'Haul Truck',
          status: 'Idle',
          daysInactive: 7,
          location: { lat: 47.609, lng: -122.338 },
          health: 'Yellow',
          site: 'Site B',
        },
      ],
      productivity: {
        unitsMovedActual: 12500,
        unitsMovedBudget: 15000,
        trend: 'Down',
        context: 'Site B mud conditions.',
        industryAvgUtilizationPct: 82,
      },
    },
    materialData: {
      milestones: [
        { name: 'Slab Pour', status: 'Delayed', impact: 'Electrical Rough-in' },
        { name: 'Roof Dry-in', status: 'On-Track', impact: 'Interior Finishes' },
      ],
      leadTimes: [
        { category: 'Switchgear', avgLeadTimeWeeks: 52, risk: 'Critical' },
      ],
    },
    bidSimulator: {
      pendingProjects: [
        { id: 'p_red', name: 'Project Red', confidence: 0.8, demandFTE: 12, skillTags: ['PLC Dev'] },
        { id: 'p_blue', name: 'Project Blue', confidence: 0.4, demandFTE: 8, skillTags: [] },
      ],
      capacityBaselineFTE: 45,
      capacityBenchmarkFTE: 50,
    },
  }
}

// Heavy Civil–specific mock: material yield and daily huddle (not in unified shape)
const HEAVY_CIVIL_MATERIAL_YIELD = {
  actualWastePct: 10,
  budgetedWastePct: 5,
  label: 'Check subgrade before next pour',
}
const HEAVY_CIVIL_DAILY_HUDDLE: DailyHuddleRecap = {
  date: new Date(Date.now() - 864e5).toISOString().slice(0, 10),
  achievedQuantities: { 'CY Excavated': 420, 'Tons Base': 180 },
  goalQuantities: { 'CY Excavated': 500, 'Tons Base': 200 },
}

// Map globalAlerts → Next Best Action drawer format (priority includes 'low')
export function globalAlertsToNextBestActions(alerts: GlobalAlert[]): NextBestAction[] {
  return alerts.map((a) => ({
    id: a.id,
    label: a.message,
    priority: a.severity as NextBestActionPriority,
    ctaLabel: a.action,
    financialRiskAmount: a.financialRiskAmount,
    financialRiskLabel: a.financialRiskLabel,
  }))
}

export function getNextBestActions(): NextBestAction[] {
  const unified = getUnifiedLemPayload()
  return globalAlertsToNextBestActions(unified.globalAlerts)
}

// Adapters: unified → persona-specific payloads

function telematicsToEquipmentPins(
  telematics: UnifiedLemPayload['equipmentData']['telematics']
): EquipmentPin[] {
  return telematics.map((t) => ({
    id: t.id,
    name: t.id,
    type: t.type,
    lat: t.location.lat,
    lng: t.location.lng,
    lastActivityAt: new Date(
      Date.now() - t.daysInactive * 24 * 60 * 60 * 1000
    ).toISOString(),
    status: t.status.toLowerCase() as 'active' | 'idle' | 'maintenance',
    site: t.site,
  }))
}

function sCurveToLaborCurves(
  sCurve: UnifiedLemPayload['laborData']['sCurve']
): LaborCurves {
  const toPoints = (vals: (number | null)[]): LaborSeriesPoint[] =>
    vals.map((v, i) => ({ weekId: `W${i}`, value: v ?? 0 }))
  return {
    planned: toPoints(sCurve.planned),
    actual: toPoints(sCurve.actual),
    forecast: toPoints(sCurve.forecast),
  }
}

function materialStatusToLemStatus(s: string): 'on_track' | 'delayed' | 'at_risk' {
  if (s === 'On-Track') return 'on_track'
  if (s === 'Delayed') return 'delayed'
  return 'at_risk'
}

function materialMilestonesToMilestones(
  milestones: UnifiedLemPayload['materialData']['milestones']
): Milestone[] {
  return milestones.map((m, i) => ({
    id: `m${i}`,
    name: m.name,
    status: materialStatusToLemStatus(m.status),
    atRiskReason: m.impact,
  }))
}

function globalAlertsToRedFlags(alerts: GlobalAlert[]): MaintenanceRedFlag[] {
  return alerts
    .filter((a) => a.type === 'Compliance')
    .map((a) => ({
      id: a.id,
      title: a.message,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      type: 'expiring_cert' as const,
      severity: a.severity as 'high' | 'medium',
    }))
}

function benchToBenchEmployees(
  bench: UnifiedLemPayload['laborData']['bench']
): BenchEmployee[] {
  return bench.map((b, i) => ({
    id: `b${i}`,
    name: b.name,
    tags: b.tags,
    matchedToRequest: undefined,
  }))
}

function pendingProjectsToOpportunities(
  projects: UnifiedLemPayload['bidSimulator']['pendingProjects']
): Opportunity[] {
  return projects.map((p) => ({
    id: p.id,
    name: p.name,
    demand: p.demandFTE,
    won: false,
    skillTags: p.skillTags,
  }))
}

function burnCurveToPayload(
  burn: NonNullable<UnifiedLemPayload['laborData']['burnCurve']>
): LaborBurnCurvePayload {
  return {
    periodIds: burn.periodIds,
    hoursSpentPct: burn.hoursSpentPct,
    workCompletePct: burn.workCompletePct,
    benchmarkPct: burn.benchmarkPct,
    insight: burn.insight,
    delayFlag: burn.delayFlag ?? false,
  }
}

export function getPersonaPayloadFromUnified(
  unified: UnifiedLemPayload,
  persona: Persona
): HeavyCivilPayload | SpecialtyPayload | PlannerPayload {
  if (persona === 'heavyCivil') {
    const telematics = unified.equipmentData.telematics
    const idleCount = telematics.filter((t) => t.daysInactive >= 3).length
    const total = telematics.length
    const industryAvgIdlePct = total > 0 ? Math.round((idleCount / total) * 100) + 5 : undefined
    return {
      equipmentPins: telematicsToEquipmentPins(telematics),
      earthMover: {
        actualCubicYards: unified.equipmentData.productivity.unitsMovedActual,
        budgetedCubicYards: unified.equipmentData.productivity.unitsMovedBudget,
        weatherRisk: unified.equipmentData.productivity.context,
        industryAvgUtilizationPct: unified.equipmentData.productivity.industryAvgUtilizationPct,
      },
      redFlags: globalAlertsToRedFlags(unified.globalAlerts),
      industryAvgIdlePct,
      materialYield: HEAVY_CIVIL_MATERIAL_YIELD,
      dailyHuddleRecap: HEAVY_CIVIL_DAILY_HUDDLE,
    }
  }
  if (persona === 'specialty') {
    const labor = unified.laborData
    return {
      laborCurves: sCurveToLaborCurves(labor.sCurve),
      laborBurnCurve: labor.burnCurve
        ? burnCurveToPayload(labor.burnCurve)
        : {
            periodIds: ['W0', 'W1', 'W2', 'W3', 'W4'],
            hoursSpentPct: [15, 35, 55, 72, 88],
            workCompletePct: [12, 28, 48, 62, 78],
            benchmarkPct: [18, 38, 58, 75, 92],
            insight: 'Delay risk: 72% work complete < 88% hours spent.',
            delayFlag: true,
          },
      milestones: materialMilestonesToMilestones(unified.materialData.milestones),
      varianceReason: labor.varianceReason,
      projectedOverrunHours: labor.projectedOverrunHours,
    }
  }
  return {
    capacityDemand: unified.bidSimulator.pendingProjects.map((p) => ({
      periodOrProject: p.name,
      demand: p.demandFTE,
    })),
    totalCapacity: unified.bidSimulator.capacityBaselineFTE,
    capacityBenchmark: unified.bidSimulator.capacityBenchmarkFTE,
    futureCapacityByPeriod: [
      { period: 'May', capacity: 45 },
      { period: 'June', capacity: 55 },
      { period: 'July', capacity: 55 },
    ],
    opportunities: pendingProjectsToOpportunities(unified.bidSimulator.pendingProjects),
    benchEmployees: benchToBenchEmployees(unified.laborData.bench),
  }
}

export function getDashboardPayload(persona: Persona) {
  const unified = getUnifiedLemPayload()
  const data = getPersonaPayloadFromUnified(unified, persona)
  return { persona, data } as
    | { persona: 'heavyCivil'; data: HeavyCivilPayload }
    | { persona: 'specialty'; data: SpecialtyPayload }
    | { persona: 'planner'; data: PlannerPayload }
}

// —— Reconciliation (True-Up) mock data ——

export function getReconciliationData(): ReconciliationData {
  const rows: ReconciliationRow[] = [
    {
      id: 'r1',
      costCodeOrWBS: '01 41 00 - Structural Metal',
      fieldQuantity: 100,
      pmValidatedQuantity: 98,
      budgetedHours: 320,
      forecastMethod: 'Production Units',
      estimatedCostToComplete: 310,
      remainingHours: 22,
      performanceFactor: 0.98,
      constraintHistory: [
        {
          id: 'c1',
          fieldNotes: 'Area 2 delayed; slab not poured per 3/15 RFI.',
          reasonForVariance: 'Area 2 - Slab not poured',
          photoUrls: [],
          createdAt: '2026-02-08T14:00:00Z',
        },
      ],
    },
    {
      id: 'r2',
      costCodeOrWBS: '03 30 00 - Cast-in-Place Concrete',
      fieldQuantity: 250,
      pmValidatedQuantity: 210,
      budgetedHours: 480,
      forecastMethod: 'Remaining Hours',
      estimatedCostToComplete: 520,
      remainingHours: 85,
      performanceFactor: 0.92,
      constraintHistory: [
        {
          id: 'c2',
          fieldNotes: 'Weather delay 2/1–2/3; crew stood down.',
          reasonForVariance: 'Weather delay',
          createdAt: '2026-02-05T09:00:00Z',
        },
      ],
    },
    {
      id: 'r3',
      costCodeOrWBS: '05 50 00 - Metal Fabrications',
      fieldQuantity: 45,
      pmValidatedQuantity: 45,
      budgetedHours: 120,
      forecastMethod: 'Performance Factor',
      estimatedCostToComplete: 118,
      remainingHours: 8,
      performanceFactor: 1.0,
    },
    {
      id: 'r4',
      costCodeOrWBS: '08 41 00 - Entrances & Storefronts',
      fieldQuantity: 80,
      pmValidatedQuantity: 65,
      budgetedHours: 200,
      forecastMethod: 'Production Units',
      estimatedCostToComplete: 220,
      remainingHours: 42,
      performanceFactor: 0.92,
    },
    {
      id: 'r5',
      costCodeOrWBS: '09 91 00 - Painting',
      fieldQuantity: 0,
      pmValidatedQuantity: 0,
      budgetedHours: 90,
      forecastMethod: 'Remaining Hours',
      estimatedCostToComplete: 90,
      remainingHours: 90,
      performanceFactor: 1.0,
    },
  ]
  return {
    meta: {
      projectName: 'Diversified Automation - Building A',
      accountingPeriod: 'May 2025',
      status: 'In Review',
    },
    rows,
  }
}

// —— Project-Level Hub API ——

export interface CompanyOption {
  id: string
  name: string
}

const COMPANY_LIST: CompanyOption[] = [
  { id: 'miller-design', name: 'Miller Design' },
  { id: 'vortex', name: 'Vortex Business Center' },
]

const PROJECT_LIST: ProjectSummary[] = [
  { id: 'building-a', name: 'Diversified Automation - Building A', status: 'active' },
  { id: 'seattle-corridor', name: 'Seattle Corridor Railway', status: 'off_track' },
  { id: 'skyline', name: 'Skyline Tower Project', status: 'active' },
  { id: 'metro-mall', name: 'Metro Mall Renovation', status: 'active' },
  { id: 'harbor-view', name: 'Harbor View Condos', status: 'precon' },
]

export function getCompanyList(): CompanyOption[] {
  return COMPANY_LIST
}

export function getProjectList(): ProjectSummary[] {
  return PROJECT_LIST
}

/** Build WbsCode[] from reconciliation rows (performance factor = earned/actual). */
function reconciliationRowsToWbsCodes(rows: ReconciliationRow[]): WbsCode[] {
  return rows.map((r) => {
    const pf = r.performanceFactor ?? 1
    const actualHours = r.remainingHours != null ? r.budgetedHours - r.remainingHours : r.budgetedHours * 0.6
    const earnedHours = actualHours * pf
    return {
      id: r.id,
      costCodeOrWBS: r.costCodeOrWBS,
      earnedHours: Math.round(earnedHours * 10) / 10,
      actualHours: Math.round(actualHours * 10) / 10,
      performanceFactor: Math.round(pf * 100) / 100,
    }
  })
}

const DEFAULT_FIELD_LOGS: FieldLog[] = [
  { id: 'fl1', date: '2026-02-09T17:00:00Z', quantityClaimed: 42, manHoursLogged: 32, fieldNoteSnippet: 'Area 4 pour complete. Cure started.', varianceReason: undefined },
  { id: 'fl2', date: '2026-02-08T16:30:00Z', quantityClaimed: 0, manHoursLogged: 24, fieldNoteSnippet: 'Rain delay at Area 4. Crew stood down 2/8.', varianceReason: 'Weather' },
  { id: 'fl3', date: '2026-02-07T17:00:00Z', quantityClaimed: 38, manHoursLogged: 28, fieldNoteSnippet: 'Structural metal erected B2. RFI 412 closed.', varianceReason: 'RFI' },
  { id: 'fl4', date: '2026-02-06T16:00:00Z', quantityClaimed: 55, manHoursLogged: 40, fieldNoteSnippet: 'Concrete placement on schedule.', photoUrls: [] },
  { id: 'fl5', date: '2026-02-05T15:00:00Z', quantityClaimed: 0, manHoursLogged: 16, fieldNoteSnippet: 'GC delay - slab not released. See constraint.', varianceReason: 'Delay' },
]

const DEFAULT_MATERIAL_USAGE: MaterialUsageItem[] = [
  { id: 'mu1', costCodeOrWBS: '03 30 00 - Cast-in-Place Concrete', plannedQuantity: 1200, actualQuantity: 1320, unit: 'CY' },
  { id: 'mu2', costCodeOrWBS: 'Gravel / Subgrade', plannedQuantity: 5000, actualQuantity: 5500, unit: 'Tons' },
  { id: 'mu3', costCodeOrWBS: '01 41 00 - Structural Metal', plannedQuantity: 450, actualQuantity: 445, unit: 'LF' },
  { id: 'mu4', costCodeOrWBS: '08 41 00 - Entrances & Storefronts', plannedQuantity: 200, actualQuantity: 198, unit: 'LF' },
]

function getDefaultProjectRedFlags(_projectName: string): ProjectRedFlag[] {
  return [
    { id: 'prf1', label: 'Unapproved timesheet for Crew A', priority: 'high', ctaLabel: 'Review timesheet' },
    { id: 'prf2', label: 'Low fuel alert on Excavator 02', priority: 'medium', ctaLabel: 'Check equipment' },
  ]
}

export function getProjectData(projectId: string): ProjectData {
  const recon = getReconciliationData()
  const isBuildingA = projectId === 'building-a'
  const projectName = isBuildingA ? recon.meta.projectName : (PROJECT_LIST.find((p) => p.id === projectId)?.name ?? 'Unknown Project')
  const rows = isBuildingA ? recon.rows : recon.rows.map((r, i) => ({ ...r, id: `proj-${projectId}-${i}` }))
  const wbsCodes = reconciliationRowsToWbsCodes(rows)
  const fieldLogs = isBuildingA ? DEFAULT_FIELD_LOGS : DEFAULT_FIELD_LOGS.map((f) => ({ ...f, id: `${projectId}-${f.id}` }))
  const materialUsage = isBuildingA ? DEFAULT_MATERIAL_USAGE : DEFAULT_MATERIAL_USAGE.map((m) => ({ ...m, id: `${projectId}-${m.id}` }))
  const redFlags = getDefaultProjectRedFlags(projectName)
  const varianceReason =
    rows[0]?.constraintHistory?.[0]?.reasonForVariance ??
    fieldLogs.find((f) => f.varianceReason)?.varianceReason ??
    'Awaiting material'

  const projectData: ProjectData = {
    projectId,
    projectName,
    kpis: {
      cpi: 0.96,
      spi: 0.92,
      materialYieldPct: 90,
    },
    varianceReason,
    wbsCodes,
    fieldLogs,
    materialUsage,
    redFlags,
    reconciliationRows: rows,
    cycleTime: {
      actualCyclesPerDay: 18,
      bidCyclesPerDay: 22,
      context: 'Site B mud conditions; haul distance +45%',
    },
    milestoneBuffer: [
      { milestoneName: 'Electrical Rough-in', predecessorName: 'Slab Pour', daysUntil: 4 },
      { milestoneName: 'Interior Finishes', predecessorName: 'Roof Dry-in', daysUntil: 12 },
    ],
    skillsetGap: [
      { role: 'PLC Developers', required: 2, assigned: 1, period: 'July' },
    ],
  }
  return projectData
}

/** Get reconciliation data for a project (for True-Up drawer). */
export function getReconciliationDataByProject(projectId: string): ReconciliationData {
  const projectData = getProjectData(projectId)
  return {
    meta: {
      projectName: projectData.projectName,
      accountingPeriod: 'May 2025',
      status: 'In Review',
    },
    rows: projectData.reconciliationRows,
  }
}
