// Insights Sidebar types – contextual deep-dive for dashboard cards

export type InsightCategory = 'Equipment' | 'Labor' | 'Materials' | 'Planning' | 'Financial' | 'Safety'

export interface InsightMetric {
  label: string
  value: string
  trend?: 'up' | 'down' | 'flat'
}

export interface InsightAction {
  text: string
  ctaLabel: string
  priority: 'p1' | 'p2' | 'p3'
}

export interface InsightDrillDownTable {
  title: string
  columns: string[]
  rows: string[][]
}

// Mini-visualization discriminated union for the sidebar
export type InsightVisualization =
  | { type: 'donut'; value: number; label: string }
  | { type: 'sparkline'; points: number[]; label: string }
  | { type: 'bar'; bars: { label: string; value: number; max: number }[] }
  | { type: 'progress'; current: number; target: number; label: string }

export interface InsightDetail {
  id: string
  title: string
  category: InsightCategory
  quickInsight: {
    summary: string
    detail: string
  }
  metrics: InsightMetric[]
  recommendedActions: InsightAction[]
  drillDownTable?: InsightDrillDownTable
  reportLink?: { label: string }
  visualization?: InsightVisualization
  /** Display label for data timeframe, e.g. "Last 7 Days" */
  timeframe?: string
  /** ISO timestamp of when insight data was last refreshed */
  lastUpdated?: string
}
