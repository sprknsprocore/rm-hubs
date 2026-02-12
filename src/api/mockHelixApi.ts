export interface PortfolioSummaryKpi {
  label: string
  value: string
  alert?: boolean
}

export const portfolioSummaryKpis: PortfolioSummaryKpi[] = [
  { label: 'Revised Budget', value: '$2.45bn' },
  { label: 'Budget Changes', value: '$230k' },
  { label: 'Projected Costs', value: '$1.38bn' },
  { label: '% Projected/Forecast', value: '56.7%' },
  { label: 'Estimated Cost at Completion', value: '$2.46bn' },
  { label: '% Forecast', value: '43.91%' },
  { label: 'Projected Over Under', value: '$-6.73M', alert: true },
  { label: '% Forecast/Budget', value: '100.27%', alert: true },
]

export interface ActionItem {
  id: string
  title: string
  meta?: string
  thumbnail?: string
  time: string
  icon?: 'alert' | 'doc'
}

export const myActionItems: ActionItem[] = [
 {
   id: '1',
   title: 'PCO #359 needs review',
   meta: 'You are following this file.',
   time: '1 d',
   icon: 'alert',
 },
 {
   id: '2',
   title: 'James Clark sent you a DM About CO #764 that you requested.',
   time: 'Dec 19',
   icon: 'doc',
 },
 {
   id: '3',
   title: 'Signature required on CO #243',
   meta: 'Signature needed by December 25, 2024.',
   time: 'Dec 19',
   icon: 'doc',
 },
 {
   id: '4',
   title: 'Signature required on CO #119',
   meta: 'Signature needed by December 25, 2024.',
   time: 'Dec 19',
   icon: 'doc',
 },
]

export interface PortfolioProject {
  id: string
  name: string
  address: string
  company: string
  role: string
  pm: string
  status: 'active' | 'off_track' | 'precon' | 'complete'
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: '1',
    name: 'Seattle Corridor Railway',
    address: '303 S Jackson St, Seattle WA',
    company: 'Golden Key construction',
    role: 'General Contractor',
    pm: 'Kevin McCallister',
    status: 'off_track',
  },
]

export const portfolioFilters = [
  { label: 'Active', count: null },
  { label: 'Precon', count: 11 },
  { label: 'Complete', count: 3 },
]

export const financialAllocated = 11.91
export const financialTotal = 32_000_000
export const financialBreakdown = [{ name: '101 - No Simple Highway', pct: 11.96 }]
