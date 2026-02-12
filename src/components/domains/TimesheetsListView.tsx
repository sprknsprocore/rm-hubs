import { useState, Fragment } from 'react'
import {
  Download,
  Plus,
  ChevronDown,
  ChevronRight,
  Calendar,
  ArrowUpDown,
  MoreVertical,
  RotateCcw,
  Clock,
  Trash2,
  SlidersHorizontal,
} from 'lucide-react'
import { ListPageLayout, ListToolbar, TableCard, SortableTh } from './shared'

const TIMESHEET_TABS = [
  { id: 'details', label: 'Details' },
  { id: 'weeklySummary', label: 'Weekly Summary' },
  { id: 'equipment', label: 'Equipment' },
] as const
type TimesheetTabId = (typeof TIMESHEET_TABS)[number]['id']

const STATUS_OPTIONS = ['All', 'PENDING', 'REVIEWED', 'APPROVED', 'COMPLETED'] as const
type StatusFilter = (typeof STATUS_OPTIONS)[number]

type EntryStatus = 'PENDING' | 'REVIEWED' | 'APPROVED' | 'COMPLETED'

interface TimesheetEntry {
  id: string
  date: string
  project: string
  taskCode: string
  location: string
  start: string
  status: EntryStatus
  classification: string
  hours: number
}

interface TimesheetRow {
  id: string
  employeeName: string
  entries: TimesheetEntry[]
}

const MOCK_ROWS: TimesheetRow[] = [
  {
    id: '1',
    employeeName: 'Alisa Taylor',
    entries: [
      { id: '1a', date: '10/18/2025', project: 'Stadium Project', taskCode: '01-9583 Task Code', location: 'None', start: '8:00', status: 'PENDING', classification: 'Apprentice', hours: 8 },
      { id: '1b', date: '10/19/2025', project: '002 Marvel Stadium', taskCode: '01-9583 Task Code', location: 'None', start: '8:00', status: 'REVIEWED', classification: 'Apprentice', hours: 10.25 },
      { id: '1c', date: '10/20/2025', project: '002 Marvel Stadium', taskCode: '01-9583 Task Code', location: 'None', start: '8:00', status: 'APPROVED', classification: 'Apprentice', hours: 10.25 },
      { id: '1d', date: '10/21/2025', project: '002 Marvel Stadium', taskCode: '01-9583 Task Code', location: 'None', start: '8:00', status: 'COMPLETED', classification: 'Apprentice', hours: 12.25 },
    ],
  },
  {
    id: '2',
    employeeName: 'Emma Thompson',
    entries: [
      { id: '2a', date: '10/18/2025', project: '002 Marvel Stadium', taskCode: '01-9583 Task Code', location: 'None', start: '8:00', status: 'APPROVED', classification: 'Journeyworker', hours: 8 },
      { id: '2b', date: '10/19/2025', project: '002 Marvel Stadium', taskCode: '01-9583 Task Code', location: 'None', start: '8:00', status: 'APPROVED', classification: 'Journeyworker', hours: 8 },
      { id: '2c', date: '10/20/2025', project: '002 Marvel Stadium', taskCode: '01-9583 Task Code', location: 'None', start: '8:00', status: 'PENDING', classification: 'Journeyworker', hours: 8 },
    ],
  },
  {
    id: '3',
    employeeName: 'Oliver Bennett',
    entries: [
      { id: '3a', date: '10/18/2025', project: 'Stadium Project', taskCode: '01-9583 Task Code', location: 'None', start: '8:00', status: 'REVIEWED', classification: 'Apprentice', hours: 8 },
      { id: '3b', date: '10/19/2025', project: '002 Marvel Stadium', taskCode: '01-9583 Task Code', location: 'None', start: '8:00', status: 'REVIEWED', classification: 'Apprentice', hours: 8 },
    ],
  },
  {
    id: '4',
    employeeName: 'Liam Johnson',
    entries: [
      { id: '4a', date: '10/18/2025', project: '002 Marvel Stadium', taskCode: '01-9583 Task Code', location: 'None', start: '8:00', status: 'COMPLETED', classification: 'Foreman', hours: 10 },
      { id: '4b', date: '10/19/2025', project: '002 Marvel Stadium', taskCode: '01-9583 Task Code', location: 'None', start: '8:00', status: 'COMPLETED', classification: 'Foreman', hours: 10 },
    ],
  },
  {
    id: '5',
    employeeName: 'Sophia Carter',
    entries: [
      { id: '5a', date: '10/18/2025', project: '002 Marvel Stadium', taskCode: '01-9583 Task Code', location: 'None', start: '8:00', status: 'PENDING', classification: 'Apprentice', hours: 7.5 },
      { id: '5b', date: '10/19/2025', project: '002 Marvel Stadium', taskCode: '01-9583 Task Code', location: 'None', start: '8:00', status: 'PENDING', classification: 'Apprentice', hours: 8 },
    ],
  },
]

function EntryStatusBadge({ status }: { status: EntryStatus }) {
  const styles: Record<EntryStatus, { bg: string; border: string; text: string }> = {
    PENDING: { bg: 'var(--figma-info-light)', border: 'var(--figma-info)', text: 'var(--figma-info)' },
    REVIEWED: { bg: 'rgba(255, 82, 0, 0.12)', border: 'var(--figma-primary-orange)', text: 'var(--figma-primary-orange)' },
    APPROVED: { bg: 'var(--figma-success-light)', border: 'var(--figma-success)', text: 'var(--figma-success)' },
    COMPLETED: { bg: 'var(--figma-bg-depth2)', border: 'var(--figma-text-disabled)', text: 'var(--figma-text-secondary)' },
  }
  const s = styles[status]
  return (
    <span
      className="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: s.bg, borderColor: s.border, color: s.text }}
    >
      {status}
    </span>
  )
}

export default function TimesheetsListView() {
  const [activeTab, setActiveTab] = useState<TimesheetTabId>('details')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['1']))
  const perPage = 10

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = MOCK_ROWS.filter((row) => {
    const matchStatus =
      statusFilter === 'All' || row.entries.some((e) => e.status === statusFilter)
    const matchSearch =
      !search || row.employeeName.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <ListPageLayout
      title="Timesheets"
      subtitle="Company-level time entries. Search and filter by employee, status, or week."
      tabs={TIMESHEET_TABS}
      activeTabId={activeTab}
      onTabChange={(id) => setActiveTab(id as TimesheetTabId)}
      headerActions={
        <>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:opacity-90"
            style={{
              backgroundColor: 'var(--figma-bg-default)',
              borderColor: 'var(--figma-bg-outline)',
              color: 'var(--figma-text-secondary)',
            }}
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-95"
            style={{ backgroundColor: 'var(--figma-primary-orange)' }}
          >
            <Plus className="h-4 w-4" />
            Create
          </button>
        </>
      }
    >
      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        onFilterClick={() => {}}
        leftExtra={
          <>
            <div
              className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
              style={{
                backgroundColor: 'var(--figma-bg-default)',
                borderColor: 'var(--figma-bg-outline)',
                color: 'var(--figma-text-primary)',
              }}
            >
              <Calendar className="h-4 w-4 shrink-0" style={{ color: 'var(--figma-text-disabled)' }} />
              <span>10 / 18 / 2025 - 10 / 24 / 2025</span>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:opacity-90"
              style={{
                backgroundColor: 'var(--figma-bg-default)',
                borderColor: 'var(--figma-bg-outline)',
                color: 'var(--figma-text-secondary)',
              }}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Configure
            </button>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="rounded-md border py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--figma-bg-default)',
                borderColor: 'var(--figma-bg-outline)',
                color: 'var(--figma-text-primary)',
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  Status: {opt}
                </option>
              ))}
            </select>
          </>
        }
        rightActions={null}
      />

      <TableCard
        pagination={{
          start: (page - 1) * perPage + 1,
          end: Math.min(page * perPage, filtered.length),
          total: filtered.length,
          page,
          totalPages,
          onPageChange: setPage,
        }}
      >
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--figma-bg-depth2)', borderBottom: '1px solid var(--figma-bg-outline)' }}>
                <th className="w-10 px-2 py-3" aria-label="Select">
                  <input type="checkbox" className="rounded border-gray-300" aria-label="Select all" />
                </th>
                <th className="w-10 px-1 py-3" aria-label="Expand" />
                <th
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--figma-text-secondary)' }}
                >
                  <span className="inline-flex items-center gap-1">
                    <ArrowUpDown className="h-3.5 w-3.5 opacity-70" />
                  </span>
                </th>
                <SortableTh label="Status" />
                <SortableTh label="Classification" />
                <SortableTh label="Project" />
                <SortableTh label="Date" />
                <SortableTh label="Task Code" />
                <SortableTh label="Location" />
                <SortableTh label="Start" />
                <th className="w-12 px-2 py-3" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, i) => {
                const isExpanded = expandedIds.has(row.id)
                const isLastParent = i === pageRows.length - 1
                const hasNested = row.entries.length > 0
                const totalHours = row.entries.reduce((sum, e) => sum + e.hours, 0)
                return (
                  <Fragment key={row.id}>
                    <tr
                      className="transition-colors hover:bg-black/[0.02]"
                      style={{
                        borderBottom: hasNested && isExpanded ? undefined : (isLastParent && !isExpanded ? undefined : '1px solid var(--figma-bg-outline)'),
                      }}
                    >
                      <td className="w-10 px-2 py-3">
                        <input type="checkbox" className="rounded border-gray-300" aria-label={`Select ${row.employeeName}`} />
                      </td>
                      <td className="w-10 px-1 py-3">
                        {hasNested ? (
                          <button
                            type="button"
                            onClick={() => toggleExpanded(row.id)}
                            className="rounded p-1 transition-colors hover:bg-black/[0.06]"
                            style={{ color: 'var(--figma-text-secondary)' }}
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium" style={{ color: 'var(--figma-text-primary)' }}>
                          {row.employeeName}
                        </span>
                      </td>
                      <td className="px-4 py-3">—</td>
                      <td className="px-4 py-3">—</td>
                      <td className="px-4 py-3">—</td>
                      <td className="px-4 py-3">—</td>
                      <td className="px-4 py-3">—</td>
                      <td className="px-4 py-3">—</td>
                      <td className="px-4 py-3">—</td>
                      <td className="w-12 px-2 py-3">
                        <button type="button" className="rounded p-1 hover:bg-black/[0.06]" style={{ color: 'var(--figma-text-secondary)' }} aria-label="Row actions">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                    {isExpanded &&
                      row.entries.map((entry) => (
                        <tr
                          key={entry.id}
                          className="transition-colors hover:bg-black/[0.02]"
                          style={{
                            backgroundColor: 'var(--figma-bg-depth2)',
                            borderBottom: '1px solid var(--figma-bg-outline)',
                          }}
                        >
                          <td className="w-10 px-2 py-2">
                            <input type="checkbox" className="rounded border-gray-300" aria-label={`Select entry ${entry.id}`} />
                          </td>
                          <td className="w-10 px-1 py-2" />
                          <td className="px-4 py-2" />
                          <td className="px-4 py-2">
                            <EntryStatusBadge status={entry.status} />
                          </td>
                          <td className="px-4 py-2" style={{ color: 'var(--figma-text-secondary)' }}>
                            {entry.classification}
                          </td>
                          <td className="px-4 py-2" style={{ color: 'var(--figma-text-primary)' }}>
                            {entry.project}
                          </td>
                          <td className="px-4 py-2" style={{ color: 'var(--figma-text-secondary)' }}>
                            {entry.date}
                          </td>
                          <td className="px-4 py-2" style={{ color: 'var(--figma-text-secondary)' }}>
                            {entry.taskCode}
                          </td>
                          <td className="px-4 py-2" style={{ color: 'var(--figma-text-secondary)' }}>
                            {entry.location}
                          </td>
                          <td className="px-4 py-2" style={{ color: 'var(--figma-text-primary)' }}>
                            {entry.start}
                          </td>
                          <td className="w-12 px-2 py-2">
                            <div className="flex items-center gap-0.5">
                              <button type="button" className="rounded p-1 hover:bg-black/[0.06]" style={{ color: 'var(--figma-text-secondary)' }} aria-label="Revert">
                                <RotateCcw className="h-3.5 w-3.5" />
                              </button>
                              <button type="button" className="rounded p-1 hover:bg-black/[0.06]" style={{ color: 'var(--figma-text-secondary)' }} aria-label="History">
                                <Clock className="h-3.5 w-3.5" />
                              </button>
                              <button type="button" className="rounded p-1 hover:bg-black/[0.06]" style={{ color: 'var(--figma-error)' }} aria-label="Delete">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {isExpanded && row.entries.length > 0 && (
                      <tr style={{ backgroundColor: 'var(--figma-bg-depth2)', borderBottom: isLastParent ? undefined : '1px solid var(--figma-bg-outline)' }}>
                        <td className="w-10 px-2 py-2" />
                        <td className="w-10 px-1 py-2" />
                        <td className="px-4 py-2 font-medium" style={{ color: 'var(--figma-text-primary)' }} colSpan={8}>
                          Total Hours: {totalHours.toFixed(2)}
                        </td>
                        <td className="w-12 px-2 py-2" />
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
      </TableCard>
    </ListPageLayout>
  )
}
