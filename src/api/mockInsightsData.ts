import type { InsightDetail, InsightVisualization } from '../types/insights'

/** Registry of insight details keyed by card ID. */
const insightsMap = new Map<string, InsightDetail>()

// ─── Heavy Civil ─────────────────────────────────────────────────────────────

insightsMap.set('portfolio-heatmap', {
  id: 'portfolio-heatmap',
  title: 'Portfolio Health',
  category: 'Financial',
  quickInsight: {
    summary: '2 of 5 projects trending below CPI 1.0 — potential margin erosion across portfolio',
    detail:
      'Seattle Corridor (CPI 0.82) and Building A (CPI 0.96) are underperforming against budget. Seattle Corridor has been trending down for 3 consecutive periods, primarily driven by labor overruns on excavation cost codes. If current burn rate continues, the portfolio-level margin could drop from 8.2% to 5.8% by end of quarter.',
  },
  metrics: [
    { label: 'Projects On Track', value: '3 of 5', trend: 'flat' },
    { label: 'Avg Portfolio CPI', value: '0.98', trend: 'down' },
    { label: 'At-Risk Revenue', value: '$2.4M' },
    { label: 'Portfolio Margin', value: '8.2%', trend: 'down' },
  ],
  recommendedActions: [
    { text: 'Drill into Seattle Corridor to review cost code variances and constraint history.', ctaLabel: 'Open Seattle Corridor', priority: 'p1' },
    { text: 'Schedule a project review for Building A to address the CPI trend before it dips below 0.95.', ctaLabel: 'Schedule Review', priority: 'p2' },
    { text: 'Compare top-performing project practices against underperformers for process improvements.', ctaLabel: 'View Comparison', priority: 'p3' },
  ],
  drillDownTable: {
    title: 'Project Performance Summary',
    columns: ['Project', 'CPI', 'SPI', 'Status', 'Trend'],
    rows: [
      ['Harbor View', '1.12', '1.05', 'Green', 'Stable'],
      ['Skyline Tower', '1.04', '1.02', 'Green', 'Stable'],
      ['Metro Mall', '0.98', '1.00', 'Green', 'Flat'],
      ['Building A', '0.96', '0.94', 'Yellow', 'Declining'],
      ['Seattle Corridor', '0.82', '0.78', 'Red', 'Declining'],
    ],
  },
  reportLink: { label: 'Go to Portfolio Report' },
  visualization: { type: 'bar', bars: [
    { label: 'Harbor', value: 1.12, max: 1.0 },
    { label: 'Skyline', value: 1.04, max: 1.0 },
    { label: 'Metro', value: 0.98, max: 1.0 },
    { label: 'Bldg A', value: 0.96, max: 1.0 },
    { label: 'Seattle', value: 0.82, max: 1.0 },
  ] } satisfies InsightVisualization,
  timeframe: 'This Period',
  lastUpdated: '2026-02-12T08:30:00Z',
})

insightsMap.set('zero-activity', {
  id: 'zero-activity',
  title: 'Zero Activity Alert',
  category: 'Equipment',
  quickInsight: {
    summary: '3 assets idle >72 hours with active rentals — $1,500/day in rental leakage',
    detail:
      'Three pieces of equipment have had no engine activity, GPS movement, or Daily Log mentions for more than 72 hours while rental agreements remain active. The combined daily rental cost is $1,500. If these assets remain idle through end of week, the total wasted spend will exceed $10,500. Two of the three are at Site B where earthwork has been paused due to weather.',
  },
  metrics: [
    { label: 'Idle Assets', value: '3', trend: 'up' },
    { label: 'Daily Rental Leak', value: '$1,500/day' },
    { label: 'Days Since Alert', value: '4' },
    { label: 'Projected Weekly Loss', value: '$10,500' },
  ],
  recommendedActions: [
    { text: 'Initiate off-rent process for idle equipment at Site B where earthwork is paused.', ctaLabel: 'Off-Rent Now', priority: 'p1' },
    { text: 'Reassign the loader (LD-045) to Site A where excavation demand is high.', ctaLabel: 'Reassign Asset', priority: 'p2' },
    { text: 'Set up automated alerts for equipment idle >48 hours to catch issues earlier.', ctaLabel: 'Configure Alerts', priority: 'p3' },
  ],
  drillDownTable: {
    title: 'Idle Equipment — Last 7 Days',
    columns: ['Equipment ID', 'Type', 'Site', 'Days Idle', 'Daily Cost'],
    rows: [
      ['EXC-092', 'Excavator', 'Site A', '5', '$500/day'],
      ['LD-045', 'Loader', 'Site B', '6', '$500/day'],
      ['HT-033', 'Haul Truck', 'Site B', '7', '$500/day'],
    ],
  },
  reportLink: { label: 'Go to Equipment Report' },
  visualization: { type: 'progress', current: 0, target: 3, label: 'Idle Assets Resolved' } satisfies InsightVisualization,
  timeframe: 'Last 7 Days',
  lastUpdated: '2026-02-12T06:15:00Z',
})

insightsMap.set('command-center', {
  id: 'command-center',
  title: 'Command Center',
  category: 'Equipment',
  quickInsight: {
    summary: '5 tracked assets across 2 sites — 3 idle, 2 active',
    detail:
      'The fleet command center shows 60% of tracked equipment is currently idle. Site B has the highest concentration of idle equipment (2 assets), correlating with the weather delay affecting earthwork operations. Site A has 1 idle excavator that may be a candidate for redeployment given active excavation demand at Metro Mall.',
  },
  metrics: [
    { label: 'Active Assets', value: '2' },
    { label: 'Idle Assets', value: '3', trend: 'up' },
    { label: 'Sites Monitored', value: '2' },
    { label: 'Fleet Utilization', value: '40%', trend: 'down' },
  ],
  recommendedActions: [
    { text: 'Review idle assets at Site B and initiate off-rent or redeployment.', ctaLabel: 'Review Site B', priority: 'p1' },
    { text: 'Cross-reference GPS data with Daily Logs to verify equipment usage accuracy.', ctaLabel: 'Verify Logs', priority: 'p2' },
  ],
  reportLink: { label: 'Go to Fleet Map' },
  visualization: { type: 'donut', value: 40, label: 'Fleet utilization — 2 of 5 assets active' } satisfies InsightVisualization,
  timeframe: 'Live',
  lastUpdated: '2026-02-12T09:45:00Z',
})

insightsMap.set('equipment-utilization', {
  id: 'equipment-utilization',
  title: 'Equipment Utilization',
  category: 'Equipment',
  quickInsight: {
    summary: 'Fleet utilization at 77% — engine-on hours lag on-site hours by 560 hrs',
    detail:
      'Over the current reporting period, equipment has been on-site for 2,400 hours but engines were running for only 1,840 hours, indicating 23% idle time while equipment is physically present. This suggests scheduling gaps or wait time between tasks. Industry benchmark for heavy civil fleets is 72% utilization, so the fleet is above average but the idle gap represents an opportunity to reduce rental costs by approximately $4,200/week.',
  },
  metrics: [
    { label: 'Utilization Rate', value: '77%', trend: 'flat' },
    { label: 'Engine-On Hours', value: '1,840 hrs' },
    { label: 'On-Site Hours', value: '2,400 hrs' },
    { label: 'Industry Benchmark', value: '72%' },
  ],
  recommendedActions: [
    { text: 'Review projects with idle equipment and verify their status to help mitigate budget risk.', ctaLabel: 'View Idle Equipment', priority: 'p1' },
    { text: 'Assign equipment to other projects as needed to close the utilization gap.', ctaLabel: 'Reassign Equipment', priority: 'p2' },
    { text: 'Analyze idle patterns by time of day to optimize crew scheduling around equipment availability.', ctaLabel: 'View Patterns', priority: 'p3' },
  ],
  drillDownTable: {
    title: 'Utilization by Equipment Type',
    columns: ['Type', 'Count', 'Avg Utilization', 'Idle Hours', 'Est. Waste'],
    rows: [
      ['Excavators', '3', '82%', '120 hrs', '$1,200'],
      ['Dozers', '2', '75%', '95 hrs', '$950'],
      ['Loaders', '2', '68%', '180 hrs', '$1,800'],
      ['Cranes', '1', '91%', '22 hrs', '$440'],
      ['Haul Trucks', '4', '71%', '310 hrs', '$2,100'],
    ],
  },
  reportLink: { label: 'Go to Utilization Report' },
  visualization: { type: 'donut', value: 77, label: 'Engine-on vs on-site hours — 23% idle gap' } satisfies InsightVisualization,
  timeframe: 'This Period',
  lastUpdated: '2026-02-11T18:00:00Z',
})

insightsMap.set('utilization-trend', {
  id: 'utilization-trend',
  title: 'Utilization Rate Trend',
  category: 'Equipment',
  quickInsight: {
    summary: 'Utilization dropped 30% from peak (85% in May) to current (48% in Nov)',
    detail:
      'Fleet utilization has been on a declining trend since May, with the sharpest drop occurring between August and November. This coincides with project phase transitions and seasonal weather impacts. The actual utilization has fallen below scheduled utilization for 4 consecutive months, indicating either over-allocation of equipment or project delays reducing demand. At current trajectory, December utilization could drop below 40%.',
  },
  metrics: [
    { label: 'Current Rate', value: '48%', trend: 'down' },
    { label: 'Peak Rate (May)', value: '85%' },
    { label: 'Scheduled Rate', value: '55%' },
    { label: 'Months Below Target', value: '4' },
  ],
  recommendedActions: [
    { text: 'Right-size the fleet by returning underutilized rentals before the seasonal slowdown deepens.', ctaLabel: 'Review Rentals', priority: 'p1' },
    { text: 'Align equipment allocation with updated project schedules to match actual demand.', ctaLabel: 'Rebalance Fleet', priority: 'p2' },
  ],
  reportLink: { label: 'Go to Trend Report' },
  visualization: { type: 'sparkline', points: [85, 80, 72, 68, 62, 55, 48], label: 'Utilization rate trend — May to Nov' } satisfies InsightVisualization,
  timeframe: 'Last 6 Months',
  lastUpdated: '2026-02-11T18:00:00Z',
})

insightsMap.set('daily-huddle', {
  id: 'daily-huddle',
  title: 'Daily Huddle Recap',
  category: 'Labor',
  quickInsight: {
    summary: 'Yesterday\'s production hit 84% of goal — excavation and pipe fell short',
    detail:
      'The crew achieved 420 of 500 CY excavated (84%), 180 of 200 tons base (90%), and 310 of 350 LF pipe (89%). Excavation shortfall was due to a 2-hour crane scheduling conflict in the morning. Pipe installation was impacted by late material delivery. Base work was closest to target and crew productivity was within normal range. Compared to the 5-day rolling average, yesterday was 3% below trend.',
  },
  metrics: [
    { label: 'Overall Achievement', value: '84%', trend: 'down' },
    { label: 'CY Excavated', value: '420 / 500' },
    { label: 'Tons Base', value: '180 / 200' },
    { label: 'LF Pipe', value: '310 / 350' },
  ],
  recommendedActions: [
    { text: 'Address crane scheduling conflicts to prevent recurring excavation delays.', ctaLabel: 'Fix Scheduling', priority: 'p1' },
    { text: 'Coordinate with material suppliers to ensure morning deliveries for pipe crew.', ctaLabel: 'Update Deliveries', priority: 'p2' },
    { text: 'Review 5-day trend to determine if yesterday was an outlier or part of a pattern.', ctaLabel: 'View Trend', priority: 'p3' },
  ],
  reportLink: { label: 'Go to Daily Log' },
  visualization: { type: 'bar', bars: [
    { label: 'Excavation', value: 420, max: 500 },
    { label: 'Base', value: 180, max: 200 },
    { label: 'Pipe', value: 310, max: 350 },
  ] } satisfies InsightVisualization,
  timeframe: 'Yesterday',
  lastUpdated: '2026-02-12T05:00:00Z',
})

insightsMap.set('fuel-trends', {
  id: 'fuel-trends',
  title: 'Fuel Trends',
  category: 'Equipment',
  quickInsight: {
    summary: 'Weekly fuel spend averaging $7,956 — W3 spike of $9,010 warrants review',
    detail:
      'Over the past 5 weeks, fuel consumption has averaged 2,340 gallons/week at $3.40/gallon. Week 3 saw a 20% spike in consumption (2,650 gallons) that does not correlate with increased production output, suggesting potential idle-running or unauthorized usage. Fuel costs represent approximately 12% of the project\'s equipment budget. At current rates, monthly fuel spend will exceed the budgeted $30,000 by $1,800.',
  },
  metrics: [
    { label: 'Avg Weekly Cost', value: '$7,956' },
    { label: 'Avg Weekly Gallons', value: '2,340 gal' },
    { label: 'Cost per Gallon', value: '$3.40' },
    { label: 'Budget Variance', value: '+$1,800/mo', trend: 'up' },
  ],
  recommendedActions: [
    { text: 'Investigate the W3 fuel spike — cross-reference with equipment run-time logs for anomalies.', ctaLabel: 'Investigate Spike', priority: 'p1' },
    { text: 'Implement idle-shutdown policies to reduce unnecessary fuel burn during downtime.', ctaLabel: 'Set Idle Policy', priority: 'p2' },
  ],
  reportLink: { label: 'Go to Fuel Report' },
  visualization: { type: 'sparkline', points: [7200, 7800, 9010, 7600, 7956], label: 'Weekly fuel spend (W1–W5)' } satisfies InsightVisualization,
  timeframe: 'Last 5 Weeks',
  lastUpdated: '2026-02-11T12:00:00Z',
})

// ─── Specialty Contractor ────────────────────────────────────────────────────

insightsMap.set('projected-margin', {
  id: 'projected-margin',
  title: 'Projected Margin',
  category: 'Financial',
  quickInsight: {
    summary: 'Margin eroding from 8.2% to projected 6.4% — 1.8 point decline over 8 periods',
    detail:
      'The project margin has been steadily declining from 9.1% at start to a projected 6.4%, a 30% reduction. The primary drivers are labor overruns in concrete and electrical cost codes, combined with material price increases on steel. If the trend continues at the current rate, margin could approach break-even by project completion. The specialty contractor benchmark for this project type is 7.5% margin.',
  },
  metrics: [
    { label: 'Current Margin', value: '8.2%', trend: 'down' },
    { label: 'Projected Margin', value: '6.4%', trend: 'down' },
    { label: 'Starting Margin', value: '9.1%' },
    { label: 'Industry Benchmark', value: '7.5%' },
  ],
  recommendedActions: [
    { text: 'Review the top 3 cost codes contributing to margin erosion and develop corrective action plans.', ctaLabel: 'Review Cost Codes', priority: 'p1' },
    { text: 'Evaluate change order opportunities to recover margin on impacted scope.', ctaLabel: 'Review COs', priority: 'p2' },
    { text: 'Run scenario planning to model the impact of different corrective strategies.', ctaLabel: 'Run Scenarios', priority: 'p3' },
  ],
  reportLink: { label: 'Go to Financial Report' },
  visualization: { type: 'sparkline', points: [9.1, 8.9, 8.7, 8.5, 8.2, 7.8, 7.2, 6.4], label: 'Margin trend — eroding from 9.1% to projected 6.4%' } satisfies InsightVisualization,
  timeframe: 'Project to Date',
  lastUpdated: '2026-02-12T07:00:00Z',
})

insightsMap.set('earned-value', {
  id: 'earned-value',
  title: 'Earned Value Analysis',
  category: 'Financial',
  quickInsight: {
    summary: 'CPI 2.26, SPI 8.78 — project significantly under budget and ahead of schedule',
    detail:
      'Earned value of $79,000 against actual cost of $35,000 yields a strong CPI of 2.26. Schedule performance shows earned value far exceeding scheduled cost ($9,000), indicating the project is well ahead of the planned timeline. The estimate at completion ($126,985) is significantly below the total budget ($150,000), suggesting the project will deliver $23,014 in savings. Labor costs account for 50% of total spend, with materials at 33% and equipment at 17%.',
  },
  metrics: [
    { label: 'CPI', value: '2.26', trend: 'up' },
    { label: 'SPI', value: '8.78', trend: 'up' },
    { label: 'Cost Variance', value: '+$44,000' },
    { label: 'Est. at Completion', value: '$126,986' },
  ],
  recommendedActions: [
    { text: 'Document the practices driving strong performance to replicate on future projects.', ctaLabel: 'Capture Lessons', priority: 'p2' },
    { text: 'Review L/M/E cost breakdown to identify if any category is at risk of overrun.', ctaLabel: 'View Breakdown', priority: 'p3' },
  ],
  reportLink: { label: 'Go to EVM Report' },
  visualization: { type: 'donut', value: 100, label: 'CPI 2.26 — project significantly under budget' } satisfies InsightVisualization,
  timeframe: 'Project to Date',
  lastUpdated: '2026-02-12T07:00:00Z',
})

insightsMap.set('budget-vs-actual', {
  id: 'budget-vs-actual',
  title: 'Budget vs Actual',
  category: 'Financial',
  quickInsight: {
    summary: 'Actual spend tracking 3.6% above budget — gap widening since March',
    detail:
      'Cumulative actual spend ($862,000) has exceeded budget ($840,000) by $22,000 as of June. The overspend started in February and has been growing each period. The largest single-month variance was April where actual exceeded budget by $38,000, driven by overtime labor to meet a milestone deadline. At current trajectory, the project will be $45,000 over budget at completion unless corrective action is taken.',
  },
  metrics: [
    { label: 'Budget (to date)', value: '$840K' },
    { label: 'Actual (to date)', value: '$862K', trend: 'up' },
    { label: 'Variance', value: '+$22K (3.6%)' },
    { label: 'Projected Overrun', value: '$45K' },
  ],
  recommendedActions: [
    { text: 'Identify and address the top cost code variances driving the budget overshoot.', ctaLabel: 'Review Variances', priority: 'p1' },
    { text: 'Evaluate whether remaining scope can be accelerated to reduce overhead carry.', ctaLabel: 'Review Schedule', priority: 'p2' },
  ],
  reportLink: { label: 'Go to Budget Report' },
  visualization: { type: 'sparkline', points: [120, 240, 365, 495, 640, 862], label: 'Cumulative actual spend vs budget ($K)' } satisfies InsightVisualization,
  timeframe: 'Jan – Jun',
  lastUpdated: '2026-02-11T18:00:00Z',
})

insightsMap.set('unapproved-timesheets', {
  id: 'unapproved-timesheets',
  title: 'Unapproved Timesheets',
  category: 'Labor',
  quickInsight: {
    summary: '3 foremen with 208 unapproved hours — blocking payroll and cost allocation',
    detail:
      'Three crew foremen have timesheets pending approval totaling 208 hours across 26 workers. Dan Kowalski\'s crew (12 workers, 96 hours) has the oldest pending timesheet from Feb 9. Unapproved timesheets delay payroll processing, prevent accurate cost-to-date reporting, and can cause variance spikes when batched. The company SLA for timesheet approval is 24 hours — two of these are past SLA.',
  },
  metrics: [
    { label: 'Pending Timesheets', value: '3' },
    { label: 'Total Hours', value: '208 hrs' },
    { label: 'Workers Affected', value: '26' },
    { label: 'Past SLA', value: '2', trend: 'up' },
  ],
  recommendedActions: [
    { text: 'Approve Dan Kowalski\'s Feb 9 timesheet immediately — it\'s 3 days past SLA.', ctaLabel: 'Approve Now', priority: 'p1' },
    { text: 'Send reminder to Bill Harper and Ana Morales for Feb 10 timesheets.', ctaLabel: 'Send Reminders', priority: 'p2' },
    { text: 'Set up auto-escalation for timesheets not approved within 24 hours.', ctaLabel: 'Configure Rules', priority: 'p3' },
  ],
  drillDownTable: {
    title: 'Pending Timesheets',
    columns: ['Foreman', 'Crew Size', 'Date', 'Total Hours', 'Status'],
    rows: [
      ['Dan Kowalski', '12', 'Feb 9', '96 hrs', 'Past SLA'],
      ['Bill Harper', '8', 'Feb 10', '64 hrs', 'Past SLA'],
      ['Ana Morales', '6', 'Feb 10', '48 hrs', 'Pending'],
    ],
  },
  reportLink: { label: 'Go to Timesheets' },
  visualization: { type: 'progress', current: 0, target: 3, label: 'Timesheets Approved' } satisfies InsightVisualization,
  timeframe: 'This Week',
  lastUpdated: '2026-02-12T09:00:00Z',
})

insightsMap.set('burn-curve', {
  id: 'burn-curve',
  title: 'Labor Burn Curve',
  category: 'Labor',
  quickInsight: {
    summary: '52% work complete vs 65% hours spent — 13-point productivity lag detected',
    detail:
      'The labor burn curve shows hours being consumed faster than work is being completed. At week 4, 65% of budgeted hours have been spent but only 52% of work is done — a 13-point gap that is wider than the industry benchmark (60% at this stage). If this trend continues, the project will exhaust its labor budget at approximately 80% completion, requiring either additional budget or a significant productivity improvement.',
  },
  metrics: [
    { label: 'Hours Spent', value: '65%', trend: 'up' },
    { label: 'Work Complete', value: '52%', trend: 'flat' },
    { label: 'Benchmark', value: '60%' },
    { label: 'Productivity Gap', value: '13 pts', trend: 'up' },
  ],
  recommendedActions: [
    { text: 'Investigate the top constraint driving the productivity lag — rework, wait time, or skill gaps.', ctaLabel: 'Analyze Constraints', priority: 'p1' },
    { text: 'Compare crew productivity rates against historical benchmarks for these cost codes.', ctaLabel: 'View Benchmarks', priority: 'p2' },
    { text: 'Consider re-sequencing upcoming work to improve flow and reduce crew idle time.', ctaLabel: 'Review Sequence', priority: 'p3' },
  ],
  reportLink: { label: 'Go to Labor Report' },
  visualization: { type: 'progress', current: 52, target: 100, label: 'Work Complete vs Hours Budget' } satisfies InsightVisualization,
  timeframe: 'Project to Date',
  lastUpdated: '2026-02-12T07:00:00Z',
})

insightsMap.set('allocation-plan', {
  id: 'allocation-plan',
  title: 'Resource Allocation Plan',
  category: 'Planning',
  quickInsight: {
    summary: 'Persistent gap between assigned (avg 72) and requested (avg 89) headcount',
    detail:
      'Over the past 11 months, the average gap between assigned and requested headcount is 17 workers (19%). Allocated headcount (avg 84) falls between but still leaves an average shortfall of 5 against requests. The gap has been most acute in months with high demand (May: 18 gap, Jun: 17 gap). This chronic under-staffing is a likely contributor to the productivity lag seen in the burn curve and budget overruns.',
  },
  metrics: [
    { label: 'Avg Assigned', value: '72' },
    { label: 'Avg Allocated', value: '84' },
    { label: 'Avg Requested', value: '89' },
    { label: 'Avg Shortfall', value: '17 workers', trend: 'flat' },
  ],
  recommendedActions: [
    { text: 'Prioritize filling the largest staffing gaps for the upcoming high-demand months.', ctaLabel: 'Plan Staffing', priority: 'p1' },
    { text: 'Cross-train existing workers to increase flexibility and reduce role-specific bottlenecks.', ctaLabel: 'View Training', priority: 'p2' },
    { text: 'Review historical allocation accuracy to improve future forecasting.', ctaLabel: 'View History', priority: 'p3' },
  ],
  reportLink: { label: 'Go to Allocation Report' },
  visualization: { type: 'bar', bars: [
    { label: 'Assigned', value: 72, max: 89 },
    { label: 'Allocated', value: 84, max: 89 },
    { label: 'Requested', value: 89, max: 89 },
  ] } satisfies InsightVisualization,
  timeframe: 'Last 11 Months',
  lastUpdated: '2026-02-11T18:00:00Z',
})

insightsMap.set('expiring-certs', {
  id: 'expiring-certs',
  title: 'Expiring Certifications',
  category: 'Safety',
  quickInsight: {
    summary: '3 workers with certifications expiring within 2 weeks — compliance risk',
    detail:
      'Tony Vasquez\'s OSHA 10 expires in 8 days (Feb 19), Marcus Rivera\'s OSHA 30 in 11 days (Feb 22), and James Chen\'s Crane Operator license in 13 days (Feb 24). If these certifications lapse, the workers cannot perform their current roles, creating crew shortages and potential regulatory violations. The Crane Operator certification has a 4-6 week renewal lead time, making James Chen\'s situation the most urgent to address.',
  },
  metrics: [
    { label: 'Expiring <2 Weeks', value: '3', trend: 'up' },
    { label: 'Most Urgent', value: '8 days' },
    { label: 'Crane Ops at Risk', value: '1' },
    { label: 'OSHA Certs at Risk', value: '2' },
  ],
  recommendedActions: [
    { text: 'Initiate Crane Operator renewal for James Chen immediately — 4-6 week lead time.', ctaLabel: 'Start Renewal', priority: 'p1' },
    { text: 'Schedule OSHA recertification for Tony Vasquez and Marcus Rivera this week.', ctaLabel: 'Schedule Training', priority: 'p1' },
    { text: 'Set up 30-day advance alerts for all certifications to prevent future near-misses.', ctaLabel: 'Configure Alerts', priority: 'p3' },
  ],
  drillDownTable: {
    title: 'Certifications Expiring Soon',
    columns: ['Worker', 'Certification', 'Expiry Date', 'Days Left', 'Renewal Lead Time'],
    rows: [
      ['Tony Vasquez', 'OSHA 10', 'Feb 19, 2026', '8', '1 week'],
      ['Marcus Rivera', 'OSHA 30', 'Feb 22, 2026', '11', '2 weeks'],
      ['James Chen', 'Crane Operator', 'Feb 24, 2026', '13', '4-6 weeks'],
    ],
  },
  reportLink: { label: 'Go to Compliance Report' },
  visualization: { type: 'progress', current: 0, target: 3, label: 'Certifications Renewed' } satisfies InsightVisualization,
  timeframe: 'Next 2 Weeks',
  lastUpdated: '2026-02-12T06:00:00Z',
})

// ─── Planner ─────────────────────────────────────────────────────────────────

insightsMap.set('capacity-demand', {
  id: 'capacity-demand',
  title: 'Capacity vs Demand',
  category: 'Planning',
  quickInsight: {
    summary: 'Demand exceeds capacity in May-Jun — 15 FTE shortfall at peak',
    detail:
      'The capacity-demand forecast shows demand exceeding the current capacity line (45 FTE) from May through July, with peak demand of 60 FTE in June — a 15-person shortfall. Even against the benchmark capacity of 50 FTE, June demand creates a 10-person gap. This coincides with the overlap of the Seattle Corridor ramp-up and Skyline Tower mid-construction phase. Without intervention, projects will compete for the same workers, driving overtime costs and potential schedule delays.',
  },
  metrics: [
    { label: 'Current Capacity', value: '45 FTE' },
    { label: 'Peak Demand', value: '60 FTE (Jun)' },
    { label: 'Max Shortfall', value: '15 FTE', trend: 'up' },
    { label: 'Benchmark Capacity', value: '50 FTE' },
  ],
  recommendedActions: [
    { text: 'Initiate hiring or subcontractor engagement for 15 FTE needed by May.', ctaLabel: 'Start Hiring', priority: 'p1' },
    { text: 'Evaluate project scheduling to stagger peak demand periods where possible.', ctaLabel: 'Review Schedule', priority: 'p2' },
    { text: 'Assess bench availability and cross-project transfers to cover the gap.', ctaLabel: 'Check Bench', priority: 'p2' },
  ],
  reportLink: { label: 'Go to Workforce Plan' },
  visualization: { type: 'bar', bars: [
    { label: 'Mar', value: 38, max: 45 },
    { label: 'Apr', value: 42, max: 45 },
    { label: 'May', value: 52, max: 45 },
    { label: 'Jun', value: 60, max: 45 },
    { label: 'Jul', value: 48, max: 45 },
  ] } satisfies InsightVisualization,
  timeframe: 'Mar – Jul Forecast',
  lastUpdated: '2026-02-12T08:00:00Z',
})

insightsMap.set('workforce-count', {
  id: 'workforce-count',
  title: 'Workforce Count',
  category: 'Planning',
  quickInsight: {
    summary: 'Actual headcount (128) is 10% below plan (142) — 14-person gap',
    detail:
      'The workforce is running 14 people below the planned headcount of 142. This gap has persisted for several periods and is contributing to the labor burn curve issues and allocation shortfalls seen across projects. The shortfall is concentrated in skilled trades (electricians, pipe fitters) where market availability is tight. Overtime is being used to compensate, adding approximately $12,000/week in premium labor costs.',
  },
  metrics: [
    { label: 'Planned', value: '142' },
    { label: 'Actual', value: '128', trend: 'down' },
    { label: 'Gap', value: '14 workers' },
    { label: 'Overtime Premium', value: '$12K/week' },
  ],
  recommendedActions: [
    { text: 'Accelerate recruiting for electricians and pipe fitters — these are the critical gaps.', ctaLabel: 'View Open Reqs', priority: 'p1' },
    { text: 'Evaluate whether the planned headcount target is still accurate given project schedule changes.', ctaLabel: 'Review Plan', priority: 'p2' },
  ],
  reportLink: { label: 'Go to Workforce Report' },
  visualization: { type: 'progress', current: 128, target: 142, label: 'Actual vs Planned Headcount' } satisfies InsightVisualization,
  timeframe: 'Current',
  lastUpdated: '2026-02-12T09:00:00Z',
})

insightsMap.set('smart-bench', {
  id: 'smart-bench',
  title: 'Smart Bench',
  category: 'Planning',
  quickInsight: {
    summary: '4 bench workers available — 2 match open unfilled requests',
    detail:
      'The bench currently has 4 workers: Lane Staley (PM), Kim Nguyen (PLC Specialist), Derek Holt (Journeyman Electrician, 30% allocated), and Maria Santos (Safety Engineer). Kim Nguyen matches the open PLC Developer request for the July project ramp. Derek Holt could be fully allocated to cover the electrician shortage at Seattle Corridor. Lane Staley\'s Amazon experience makes him a strong candidate for the Building A project management gap.',
  },
  metrics: [
    { label: 'Bench Size', value: '4 workers' },
    { label: 'Fully Available', value: '3' },
    { label: 'Partial Allocation', value: '1' },
    { label: 'Matched to Reqs', value: '2' },
  ],
  recommendedActions: [
    { text: 'Deploy Kim Nguyen to the Project Red PLC Developer role starting in July.', ctaLabel: 'Assign Kim', priority: 'p1' },
    { text: 'Increase Derek Holt to full allocation on Seattle Corridor to address electrician shortage.', ctaLabel: 'Reassign Derek', priority: 'p2' },
    { text: 'Evaluate Lane Staley for the Building A PM opening based on his relevant experience.', ctaLabel: 'Review Match', priority: 'p2' },
  ],
  drillDownTable: {
    title: 'Bench Workers',
    columns: ['Name', 'Role', 'Tags', 'Status', 'Allocation'],
    rows: [
      ['Lane Staley', 'Project Manager', 'Amazon Exp, West Coast, OSHA 30', 'Available', '0%'],
      ['Kim Nguyen', 'PLC Specialist', 'PLC Dev, Siemens, Allen-Bradley', 'Available', '0%'],
      ['Derek Holt', 'Journeyman Electrician', 'OSHA 30, Data Center, High Voltage', 'Partial', '30%'],
      ['Maria Santos', 'Safety Engineer', 'OSHA 500, Confined Space, Bilingual', 'Available', '0%'],
    ],
  },
  reportLink: { label: 'Go to Bench Report' },
  visualization: { type: 'progress', current: 2, target: 4, label: 'Bench Workers Matched to Open Reqs' } satisfies InsightVisualization,
  timeframe: 'Current',
  lastUpdated: '2026-02-12T08:30:00Z',
})

insightsMap.set('bid-simulator', {
  id: 'bid-simulator',
  title: 'Bid Simulator',
  category: 'Planning',
  quickInsight: {
    summary: '3 pending bids totaling 28 FTE demand against 45 FTE baseline capacity',
    detail:
      'Three active bid opportunities are in the pipeline. If all three are won, total demand would add 28 FTE to the current portfolio load, which would push well beyond the 45 FTE capacity. The skill tag analysis shows a particular bottleneck in PLC Developers (required by Project Red) where only 1 bench worker matches. The highest confidence opportunity (Data Center Fit-Out at 75%) requires 12 FTE with specialized data center experience.',
  },
  metrics: [
    { label: 'Active Bids', value: '3' },
    { label: 'Total FTE Demand', value: '28 FTE' },
    { label: 'Capacity Baseline', value: '45 FTE' },
    { label: 'Highest Confidence', value: '75%' },
  ],
  recommendedActions: [
    { text: 'Model the capacity impact of winning the highest-confidence bid (Data Center Fit-Out) first.', ctaLabel: 'Run Simulation', priority: 'p1' },
    { text: 'Assess whether current bench can support the PLC Developer requirement for Project Red.', ctaLabel: 'Check Skills', priority: 'p2' },
    { text: 'Develop a contingent hiring plan for the scenario where 2+ bids are won simultaneously.', ctaLabel: 'Plan Hiring', priority: 'p3' },
  ],
  reportLink: { label: 'Go to Pipeline Report' },
  visualization: { type: 'bar', bars: [
    { label: 'DC Fit-Out', value: 12, max: 45 },
    { label: 'Proj Red', value: 8, max: 45 },
    { label: 'Proj Blue', value: 8, max: 45 },
  ] } satisfies InsightVisualization,
  timeframe: 'Active Pipeline',
  lastUpdated: '2026-02-11T16:00:00Z',
})

// ─── Shared / Additional ────────────────────────────────────────────────────

insightsMap.set('production-health', {
  id: 'production-health',
  title: 'Production Health',
  category: 'Labor',
  quickInsight: {
    summary: 'CPI recovering to 1.05 in W5 after dipping to 0.81 in W3',
    detail:
      'Production health has been volatile over the past 5 weeks. The W3 dip to CPI 0.81 was caused by an Area 2 Slab delay forced by the GC, which disrupted the crew sequence. The team has recovered to CPI 1.05 in W5, but the projected overrun of 320 hours from the disruption period has not been fully recovered. The variance reason "Area 2 Slab delayed by GC — forced crew to rework sequence" accounts for the majority of the overrun.',
  },
  metrics: [
    { label: 'Current CPI', value: '1.05', trend: 'up' },
    { label: 'Low Point (W3)', value: '0.81' },
    { label: 'Projected Overrun', value: '320 hrs' },
    { label: 'Top Constraint', value: 'GC Delay' },
  ],
  recommendedActions: [
    { text: 'Document the GC-caused delay with constraint history to support a potential change order.', ctaLabel: 'Log Constraint', priority: 'p1' },
    { text: 'Monitor CPI over the next 2 weeks to confirm the recovery trend is sustainable.', ctaLabel: 'Set Alert', priority: 'p2' },
    { text: 'Review the 320-hour overrun to determine if schedule acceleration can recover lost time.', ctaLabel: 'Review Overrun', priority: 'p3' },
  ],
  reportLink: { label: 'Go to Production Report' },
  visualization: { type: 'sparkline', points: [0.95, 0.88, 0.81, 0.92, 1.05], label: 'Weekly CPI trend (W1–W5)' } satisfies InsightVisualization,
  timeframe: 'Last 5 Weeks',
  lastUpdated: '2026-02-12T07:30:00Z',
})

insightsMap.set('scenario-planning', {
  id: 'scenario-planning',
  title: 'Scenario Planning',
  category: 'Financial',
  quickInsight: {
    summary: '4 risk scenarios modeled — worst case adds 21.8% to estimated cost at completion',
    detail:
      'Four cost scenarios have been modeled against the baseline EAC of $126,986. The combined worst case (all scenarios active) would increase EAC by approximately $27,683 to $154,669, which would exceed the total budget of $150,000. The highest individual impact is "Overtime Crew" at +8.5%, followed by "Subcontractor Change" at +6.0%. Material price increases (+4.2%) and weather delays (+3.1%) round out the risk profile.',
  },
  metrics: [
    { label: 'Baseline EAC', value: '$126,986' },
    { label: 'Worst Case EAC', value: '$154,669' },
    { label: 'Budget Headroom', value: '$23,014' },
    { label: 'Max Single Risk', value: '+8.5%' },
  ],
  recommendedActions: [
    { text: 'Develop mitigation plans for the two highest-impact scenarios (Overtime Crew and Sub Change).', ctaLabel: 'Plan Mitigations', priority: 'p1' },
    { text: 'Set up early warning triggers so scenarios are flagged before they fully materialize.', ctaLabel: 'Configure Alerts', priority: 'p2' },
  ],
  reportLink: { label: 'Go to Scenario Report' },
  visualization: { type: 'bar', bars: [
    { label: 'Overtime', value: 8.5, max: 21.8 },
    { label: 'Sub Chg', value: 6.0, max: 21.8 },
    { label: 'Material', value: 4.2, max: 21.8 },
    { label: 'Weather', value: 3.1, max: 21.8 },
  ] } satisfies InsightVisualization,
  timeframe: 'Forecast',
  lastUpdated: '2026-02-12T07:00:00Z',
})

/** Look up an insight by card ID. */
export function getInsightById(id: string): InsightDetail | undefined {
  return insightsMap.get(id)
}

/** Get all available insights. */
export function getAllInsights(): InsightDetail[] {
  return Array.from(insightsMap.values())
}
