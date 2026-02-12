// LEM domain types for Labor, Equipment, Materials

export type Persona = 'heavyCivil' | 'geco' | 'engineering';

// Next Best Action / Red Flags (right drawer)
export type NextBestActionPriority = 'critical' | 'high' | 'medium' | 'low';

export interface NextBestAction {
  id: string;
  label: string;
  priority?: NextBestActionPriority;
  ctaLabel?: string;
  ctaHref?: string;
  /** Daily cost in dollars; used to sort Exception Drawer by financial risk. */
  financialRiskAmount?: number;
  /** Human-readable risk label e.g. "Rental leak costing $1k/day". */
  financialRiskLabel?: string;
}

// —— Unified LEM Hub payload (single persona-aligned source of truth) ——

export interface HubMetadata {
  organization: string;
  lastUnifiedSync: string; // ISO
  availablePersonas: string[];
}

export interface GlobalAlert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  type: string;
  message: string;
  action: string;
  /** Daily cost in dollars; passed to NextBestAction for Exception Drawer sort. */
  financialRiskAmount?: number;
  /** Human-readable risk label e.g. "Rental leak costing $1k/day". */
  financialRiskLabel?: string;
}

export interface LaborSCurve {
  planned: number[];
  actual: number[];
  forecast: (number | null)[];
  insight: string;
}

/** Three-line burn: % hours spent vs % work complete vs benchmark (industry/historical). */
export interface LaborBurnCurve {
  periodIds: string[];
  hoursSpentPct: number[];
  workCompletePct: number[];
  benchmarkPct: number[];
  insight: string;
  /** True when % work complete < % hours spent (delay risk). */
  delayFlag?: boolean;
}

export interface BenchPerson {
  name: string;
  role: string;
  tags: string[];
  status: string;
  allocation: number;
}

export interface UnfilledRequest {
  role: string;
  site: string;
  count: number;
  priority: string;
  /** Required skill tags for matching bench employees (Planner). */
  requiredSkillTags?: string[];
}

export interface LaborData {
  sCurve: LaborSCurve;
  burnCurve?: LaborBurnCurve;
  bench: BenchPerson[];
  unfilledRequests: UnfilledRequest[];
  /** Top constraint / reason for variance; drives Production Health "Top Constraint" copy. */
  varianceReason?: string;
  /** Projected overrun in hours; drives Production Health "Projected Overrun" copy. */
  projectedOverrunHours?: number;
}

export interface TelematicsUnit {
  id: string;
  type: string;
  status: string;
  daysInactive: number;
  location: { lat: number; lng: number };
  health: string;
  /** Optional site name for NL filter e.g. "Site B". */
  site?: string;
}

export interface EquipmentProductivity {
  unitsMovedActual: number;
  unitsMovedBudget: number;
  trend: string;
  context?: string;
  /** Industry average utilization % for benchmark comparison. */
  industryAvgUtilizationPct?: number;
}

export interface EquipmentData {
  telematics: TelematicsUnit[];
  productivity: EquipmentProductivity;
}

export interface MaterialMilestone {
  name: string;
  status: string;
  impact?: string;
}

export interface MaterialLeadTime {
  category: string;
  avgLeadTimeWeeks: number;
  risk: string;
}

export interface MaterialData {
  milestones: MaterialMilestone[];
  leadTimes: MaterialLeadTime[];
}

export interface PendingProject {
  id: string;
  name: string;
  confidence: number;
  demandFTE: number;
  /** Skill tags required (e.g. "PLC Dev"). */
  skillTags?: string[];
}

export interface BidSimulatorData {
  pendingProjects: PendingProject[];
  capacityBaselineFTE: number;
  /** Industry or target capacity FTE for benchmark line. */
  capacityBenchmarkFTE?: number;
}

export interface UnifiedLemPayload {
  hubMetadata: HubMetadata;
  globalAlerts: GlobalAlert[];
  laborData: LaborData;
  equipmentData: EquipmentData;
  materialData: MaterialData;
  bidSimulator: BidSimulatorData;
}

// Persona A – Heavy Civil (Equipment)
export interface EquipmentPin {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  lastActivityAt: string; // ISO date; >3 days = zero activity
  status?: 'active' | 'idle' | 'maintenance';
  /** Optional site name for NL filter e.g. "Site B". */
  site?: string;
}

export interface EarthMoverMetrics {
  actualCubicYards: number;
  budgetedCubicYards: number;
  weatherRisk?: string;
  /** Industry average utilization % for benchmark comparison. */
  industryAvgUtilizationPct?: number;
}

export interface MaintenanceRedFlag {
  id: string;
  title: string;
  dueDate: string;
  type: 'maintenance' | 'expiring_cert';
  severity?: 'high' | 'medium';
}

// Persona B – GECO (Labor)
export interface LaborSeriesPoint {
  weekId: string;
  value: number; // cumulative hours
  /** Optional earned hours for EVM; Production Health uses this when present, else computes from workCompletePct. */
  earnedHours?: number;
}

export interface LaborCurves {
  planned: LaborSeriesPoint[];
  actual: LaborSeriesPoint[];
  forecast: LaborSeriesPoint[];
}

export interface Milestone {
  id: string;
  name: string;
  status: 'on_track' | 'delayed' | 'at_risk';
  predecessorDelay?: string;
  atRiskReason?: string;
}

// Persona C – Engineering Planner
export interface Opportunity {
  id: string;
  name: string;
  demand: number; // headcount or hours
  won: boolean;
  /** Skill tags required for this opportunity (e.g. "PLC Dev" for Project Red). */
  skillTags?: string[];
}

export interface CapacityDemandPoint {
  periodOrProject: string;
  demand: number;
  capacity?: number;
}

/** Future capacity by period for "Future Hiring Plan" toggle (e.g. +FTE in June). */
export interface FutureCapacityPoint {
  period: string;
  capacity: number;
}

export interface BenchEmployee {
  id: string;
  name: string;
  tags: string[];
  matchedToRequest?: string;
}

/** Material yield for Heavy Civil: actual vs budgeted waste %. */
export interface MaterialYieldAlert {
  actualWastePct: number;
  budgetedWastePct: number;
  label?: string;
}

/** Daily Huddle Recap: achieved vs goal quantities for previous day. */
export interface DailyHuddleRecap {
  achievedQuantities: Record<string, number>;
  goalQuantities: Record<string, number>;
  date: string; // ISO date
}

// Dashboard payload per persona
export interface HeavyCivilPayload {
  equipmentPins: EquipmentPin[];
  earthMover: EarthMoverMetrics;
  redFlags: MaintenanceRedFlag[];
  /** Industry avg idle % or company trend for benchmark context. */
  industryAvgIdlePct?: number;
  /** When actual waste exceeds budgeted, show Material Yield Alert. */
  materialYield?: MaterialYieldAlert;
  /** Previous day achieved vs goal for Daily Huddle Recap widget. */
  dailyHuddleRecap?: DailyHuddleRecap;
}

export interface LaborBurnCurvePayload {
  periodIds: string[];
  hoursSpentPct: number[];
  workCompletePct: number[];
  benchmarkPct: number[];
  insight: string;
  delayFlag: boolean;
}

export interface GecoPayload {
  laborCurves: LaborCurves;
  laborBurnCurve: LaborBurnCurvePayload;
  milestones: Milestone[];
  varianceReason?: string;
  projectedOverrunHours?: number;
}

export interface EngineeringPayload {
  capacityDemand: CapacityDemandPoint[];
  totalCapacity: number;
  capacityBenchmark?: number;
  /** When "Future Hiring Plan" is on, show stepped capacity (e.g. +FTE in June). */
  futureCapacityByPeriod?: FutureCapacityPoint[];
  opportunities: Opportunity[];
  benchEmployees: BenchEmployee[];
}

export type DashboardPayload =
  | { persona: 'heavyCivil'; data: HeavyCivilPayload }
  | { persona: 'geco'; data: GecoPayload }
  | { persona: 'engineering'; data: EngineeringPayload };

/** Result of NL bar query parsing for filtering/highlighting views. */
export interface NlFilterResult {
  equipmentFilter?: { type?: string; site?: string; idleOnly?: boolean };
  alertHighlightIds?: string[];
  certOrRoleFilter?: string;
}

// —— Reconciliation (True-Up) Workspace ——

export type ForecastMethod =
  | 'Production Units'
  | 'Remaining Hours'
  | 'Performance Factor';

export type ReconciliationStatus = 'In Review' | 'Submitted' | 'Approved';

export interface ConstraintHistoryItem {
  id: string;
  fieldNotes: string;
  reasonForVariance: string;
  photoUrls?: string[];
  createdAt: string; // ISO
}

export interface ReconciliationRow {
  id: string;
  costCodeOrWBS: string;
  fieldQuantity: number;
  pmValidatedQuantity: number;
  budgetedHours: number;
  forecastMethod: ForecastMethod;
  estimatedCostToComplete: number;
  remainingHours?: number;
  performanceFactor?: number;
  constraintHistory?: ConstraintHistoryItem[];
}

export interface ReconciliationWorkspaceMeta {
  projectName: string;
  accountingPeriod: string;
  status: ReconciliationStatus;
}

export interface ReconciliationData {
  meta: ReconciliationWorkspaceMeta;
  rows: ReconciliationRow[];
}

// —— Project-Level Hub (granular cockpit) ——

export interface ProjectSummary {
  id: string;
  name: string;
  status?: 'active' | 'off_track' | 'precon' | 'complete';
}

/** WBS/cost code row for heatmap: Performance Factor = earnedHours / actualHours. */
export interface WbsCode {
  id: string;
  costCodeOrWBS: string;
  earnedHours: number;
  actualHours: number;
  performanceFactor: number;
}

/** Golden Thread: single production event (field log). */
export interface FieldLog {
  id: string;
  date: string; // ISO
  quantityClaimed?: number;
  manHoursLogged?: number;
  fieldNoteSnippet: string;
  varianceReason?: string; // e.g. Weather, RFI, Delay
  photoUrls?: string[];
}

/** Material usage by code for planned vs actual comparison. */
export interface MaterialUsageItem {
  id: string;
  costCodeOrWBS: string;
  plannedQuantity: number;
  actualQuantity: number;
  unit: string; // e.g. "LF", "CY"
}

/** Project-scoped red flag; same shape as NextBestAction for drawer. */
export interface ProjectRedFlag {
  id: string;
  label: string;
  priority?: NextBestActionPriority;
  ctaLabel?: string;
  financialRiskAmount?: number;
  financialRiskLabel?: string;
}

export interface ProjectKpis {
  cpi: number;
  spi: number;
  materialYieldPct: number;
}

/** Heavy Civil: haul truck cycle time vs bid (project context). */
export interface ProjectCycleTime {
  actualCyclesPerDay: number;
  bidCyclesPerDay: number;
  context?: string;
}

/** Technical Planner: days until predecessor completes so next phase can start. */
export interface MilestoneBufferItem {
  milestoneName: string;
  predecessorName: string;
  daysUntil: number;
}

/** Technical Planner: role demand vs assigned for a period. */
export interface SkillsetGapItem {
  role: string;
  required: number;
  assigned: number;
  period: string;
}

/** Project-level reason for variance (e.g. "Awaiting Material") from field notes; surfaces when CPI < 1. */
export interface ProjectData {
  projectId: string;
  projectName: string;
  kpis: ProjectKpis;
  /** When CPI < 1, show this reason (from field notes / constraint history). */
  varianceReason?: string;
  wbsCodes: WbsCode[];
  fieldLogs: FieldLog[];
  materialUsage: MaterialUsageItem[];
  redFlags: ProjectRedFlag[];
  reconciliationRows: ReconciliationRow[];
  /** Persona A (Heavy Civil): cycle time vs bid. */
  cycleTime?: ProjectCycleTime;
  /** Persona C (Planner): days until next predecessor. */
  milestoneBuffer?: MilestoneBufferItem[];
  /** Persona C (Planner): skillset demand vs assigned. */
  skillsetGap?: SkillsetGapItem[];
}
