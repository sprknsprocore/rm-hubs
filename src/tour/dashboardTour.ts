import { driver, type Driver, type DriveStep } from 'driver.js'

let driverInstance: Driver | null = null
let onCloseCallback: (() => void) | null = null

function getDriver(): Driver {
  if (!driverInstance) {
    driverInstance = driver({
      showProgress: true,
      allowClose: true,
      overlayClickBehavior: 'close',
      onDestroyed: () => {
        onCloseCallback?.()
        onCloseCallback = null
      },
    })
  }
  return driverInstance
}

/** Card callout steps: one per card type. Only steps whose target exists in the DOM are shown. */
function buildCardSteps(): DriveStep[] {
  return [
    // Company Heavy Civil
    {
      element: '[data-tour="card-command-center"]',
      popover: {
        title: 'Equipment Map',
        description:
          'Shows where your equipment is and how long it has been sitting still. Use it to see which machines might need to be sent back or moved so you are not paying for idle gear.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '[data-tour="card-earth-mover-gauge"]',
      popover: {
        title: 'How much your excavators are working',
        description:
          'Shows whether your excavators are being used enough compared to typical jobs. Helps you spot gear that is sitting too much or being run too hard.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '[data-tour="card-material-yield-alert"]',
      popover: {
        title: 'Material waste alert',
        description:
          'Shows when you are using or wasting more material than you planned. It is here so you can catch cost overruns early and fix them.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '[data-tour="card-daily-huddle-recap"]',
      popover: {
        title: 'Daily huddle summary',
        description:
          'Quick recap of what was discussed in the daily huddle so everyone stays on the same page.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '[data-tour="card-maintenance-red-flags"]',
      popover: {
        title: 'Equipment that needs attention',
        description:
          'Lists equipment with maintenance or safety issues so you can get them fixed before they cause downtime or problems.',
        side: 'top',
        align: 'center',
      },
    },
    // Company GECO
    {
      element: '[data-tour="card-three-line-burn"]',
      popover: {
        title: 'Are we on track with labor?',
        description:
          'Compares the hours you planned to use, the hours you have used, and how similar jobs usually go. You can see right away if this job is ahead or behind and whether to adjust or notify others.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '[data-tour="card-production-health"]',
      popover: {
        title: 'Labor and schedule health',
        description:
          'Shows how labor is tracking and whether the job is likely to need more hours than planned. Explains why so you can decide what to do next.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '[data-tour="card-s-curve-forecast"]',
      popover: {
        title: 'Hours over time',
        description:
          'Shows how many hours you planned, how many you have used, and how many you expect to use by the end. Use it when you need to explain schedule changes to the general contractor or owner.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '[data-tour="card-milestone-tracker"]',
      popover: {
        title: 'Key dates and status',
        description:
          'Lists the big deadlines and whether they are on track. Keeps important dates visible so nothing slips.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '[data-tour="card-dear-gc"]',
      popover: {
        title: 'Notify the general contractor',
        description:
          'Quick way to tell the general contractor or owner about a schedule change or other update so everyone is informed.',
        side: 'top',
        align: 'center',
      },
    },
    // Company Engineering
    {
      element: '[data-tour="card-capacity-vs-demand"]',
      popover: {
        title: 'Do we have enough people?',
        description:
          'Compares how much work you have coming up with how many people you have. Shows where you might be short so you can plan hiring or reassign work.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '[data-tour="card-bid-simulator"]',
      popover: {
        title: 'What if we win more work?',
        description:
          'Lets you mark jobs as won and see how that changes your workload vs your team size. Use it to see if you need more people before committing to new work.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '[data-tour="card-smart-bench"]',
      popover: {
        title: 'Who is available to assign?',
        description:
          'Shows people who are between assignments and their skills. Use it when you need to fill a role or put someone on a new job.',
        side: 'bottom',
        align: 'center',
      },
    },
    // Project-level (all personas)
    {
      element: '[data-tour="card-material-yield-watch"]',
      popover: {
        title: 'Material use on this project',
        description:
          'Shows how much material this project is using and wasting compared to plan. Helps you keep costs under control and spot issues early.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '[data-tour="card-cycle-time"]',
      popover: {
        title: 'How many trips per day?',
        description:
          'Shows how many haul cycles you are getting per day compared to what you bid. Tells you whether trucks are moving as fast as you expected so you can fix delays.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '[data-tour="card-golden-thread"]',
      popover: {
        title: 'What happened in the field',
        description:
          'Timeline of field updates and notes so you have one place to see what actually happened on the job and when.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '[data-tour="card-wbs-heatmap"]',
      popover: {
        title: 'Which areas are on track?',
        description:
          'Shows which parts of the job are going well (green), okay (amber), or need attention (red). Click a cell to dig into that area and update hours or quantities.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '[data-tour="card-project-production-health"]',
      popover: {
        title: 'Is this project on track?',
        description:
          'Summarizes labor and progress for this project so you can see at a glance if it is healthy or needs attention.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '[data-tour="card-milestone-buffer"]',
      popover: {
        title: 'Room before key dates',
        description:
          'Shows how much slack you have before big deadlines. Helps you see which milestones are at risk so you can prioritize.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '[data-tour="card-skillset-gap"]',
      popover: {
        title: 'Missing skills on this job',
        description:
          'Shows when this project needs skills that your current team does not have. Use it to bring in the right people or train so the job can move forward.',
        side: 'bottom',
        align: 'center',
      },
    },
  ]
}

function buildSteps(): DriveStep[] {
  const nextActionsStep: DriveStep = {
    element: '[data-tour="next-actions"]',
    popover: {
      title: 'Your recommended to-dos',
      description:
        'Opens a list of suggested next steps based on what needs attention. Use it when you want to see what to do first.',
      side: 'left',
      align: 'center',
    },
  }

  return [...buildCardSteps(), nextActionsStep]
}

/**
 * Build steps, optionally filtering out steps whose target is not in the DOM
 * (e.g. resource-header only on hub domain).
 */
function getStepsForCurrentPage(): DriveStep[] {
  const steps = buildSteps()
  return steps.filter((step) => {
    if (!step.element) return true
    const selector = typeof step.element === 'string' ? step.element : null
    if (!selector) return true
    try {
      return document.querySelector(selector) != null
    } catch {
      return false
    }
  })
}

/**
 * Start the dashboard walkthrough. Optionally register a callback when the tour is closed.
 */
export function runDashboardTour(options?: { onClose?: () => void }): void {
  onCloseCallback = options?.onClose ?? null
  const d = getDriver()
  d.setSteps(getStepsForCurrentPage())
  d.drive(0)
}

/**
 * Programmatically close the dashboard walkthrough. Calls the same onClose callback as when the user closes it.
 */
export function stopDashboardTour(): void {
  const d = driverInstance
  if (d?.isActive?.()) {
    d.destroy()
  }
}
