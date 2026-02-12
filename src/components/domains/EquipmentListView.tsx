import { useState } from 'react'
import { Settings, Plus, ChevronDown, LayoutGrid, MessageCircle } from 'lucide-react'
import {
  ListPageLayout,
  ListToolbar,
  TableCard,
  DataTableHeaderCell,
} from './shared'

const EQUIPMENT_TABS = [
  { id: 'registry', label: 'Registry' },
  { id: 'utilization', label: 'Utilization' },
  { id: 'rates', label: 'Rates' },
  { id: 'recycleBin', label: 'Recycle Bin' },
] as const

type EquipmentTabId = (typeof EQUIPMENT_TABS)[number]['id']

type EquipmentStatus = 'In Yard' | 'In Use' | 'Unavailable'

interface EquipmentItem {
  id: string
  equipmentId: string
  name: string
  status: EquipmentStatus
  assignee: string
  serialNo: string
  groups: string
  onsite: string
  category: string
}

const MOCK_EQUIPMENT: EquipmentItem[] = [
  { id: '1', equipmentId: '2-223', name: 'Excavator', status: 'In Yard', assignee: 'Tom Rogers', serialNo: 'CAT320001', groups: 'East Coast', onsite: 'Center A', category: 'Earthmo' },
  { id: '2', equipmentId: '2-301', name: 'Bulldozer', status: 'In Yard', assignee: 'Ben Affleck', serialNo: 'KMU0565EX002', groups: 'East Coast', onsite: 'Center A', category: 'Earthmo' },
  { id: '3', equipmentId: '11-198', name: 'Concrete Mixer', status: 'Unavailable', assignee: 'Tom Cruise', serialNo: 'MACGR003', groups: 'Mid West', onsite: 'Center B', category: 'Concrete' },
  { id: '4', equipmentId: '5-83', name: 'Mobile Crane', status: 'In Use', assignee: 'Jason Statham', serialNo: 'LBM11004CR004', groups: 'West Coast', onsite: 'Center C', category: 'Lifting' },
  { id: '5', equipmentId: '3-87451', name: 'Dump Truck', status: 'In Yard', assignee: 'Bon Jovi', serialNo: 'VOLA40G005', groups: 'East Coast', onsite: 'Center D', category: 'Hauling' },
  { id: '6', equipmentId: '11-198', name: 'Forklift', status: 'Unavailable', assignee: 'Nicholas Cage', serialNo: 'TOYFGCU250006', groups: 'West Coast', onsite: 'Center A', category: 'Material' },
  { id: '7', equipmentId: '5-83', name: 'Generator', status: 'In Use', assignee: 'Peter Drucker', serialNo: 'CUM150D007', groups: 'Mid West', onsite: 'Center A', category: 'Power' },
  { id: '8', equipmentId: '11-199', name: 'Skid Steer Loader', status: 'In Yard', assignee: 'Pete Sampras', serialNo: 'BOBS650008', groups: 'Mid West', onsite: 'Center B', category: 'Earthmo' },
  { id: '9', equipmentId: '123-234', name: 'Air Compressor', status: 'In Use', assignee: 'Benjamin Becker', serialNo: 'INGXP375009', groups: 'Mid West', onsite: 'Center D', category: 'Power' },
  { id: '10', equipmentId: '43-120', name: 'Backhoe Loader', status: 'Unavailable', assignee: 'Roger Federer', serialNo: 'JCB3CX010', groups: 'East Coast', onsite: 'Center B', category: 'Earthmo' },
]

const PER_PAGE = 20
const TOTAL_ITEMS = 20

const statusStyles: Record<EquipmentStatus, { color: string }> = {
  'In Yard': { color: 'var(--figma-status-available)' },
  'In Use': { color: 'var(--figma-status-active)' },
  Unavailable: { color: 'var(--figma-status-unavailable)' },
}

export default function EquipmentListView() {
  const [activeTab, setActiveTab] = useState<EquipmentTabId>('registry')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table')
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(TOTAL_ITEMS / PER_PAGE)
  const start = (page - 1) * PER_PAGE + 1
  const end = Math.min(page * PER_PAGE, TOTAL_ITEMS)

  return (
    <ListPageLayout
      title="Equipment"
      subtitle="Equipment registry, utilization, and rates."
      titleIcon={<Settings className="h-6 w-6 md:h-7 md:w-7" />}
      tabs={EQUIPMENT_TABS}
      activeTabId={activeTab}
      onTabChange={(id) => setActiveTab(id as EquipmentTabId)}
      tabsTrailing={
        <ChevronDown className="h-4 w-4 shrink-0" style={{ color: 'var(--figma-text-disabled)' }} aria-hidden />
      }
      headerActions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium text-white transition-colors hover:opacity-95"
            style={{ backgroundColor: 'var(--figma-primary-orange)' }}
          >
            <Plus className="h-4 w-4" />
            Create
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded border px-3 py-2 text-sm font-medium transition-colors hover:bg-black/5"
            style={{
              borderColor: 'var(--figma-bg-outline)',
              color: 'var(--figma-text-primary)',
            }}
          >
            Import
            <ChevronDown className="h-4 w-4" />
          </button>
          <div
            className="ml-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded border"
            style={{
              borderColor: 'var(--figma-bg-outline)',
              color: 'var(--figma-text-secondary)',
            }}
            title="Assist"
          >
            <MessageCircle className="h-4 w-4" />
          </div>
        </div>
      }
    >
      {activeTab === 'registry' && (
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold" style={{ color: 'var(--figma-text-primary)' }}>
            Registry
          </h2>

          <ListToolbar
            searchPlaceholder="Search"
            searchValue={search}
            onSearchChange={setSearch}
            onFilterClick={() => {}}
            rightActions={
              <>
                <button
                  type="button"
                  className="rounded border p-2 transition-colors hover:bg-black/5"
                  style={{
                    borderColor: 'var(--figma-bg-outline)',
                    color: 'var(--figma-text-primary)',
                  }}
                  aria-label="Configure columns"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <div
                  className="inline-flex rounded border p-0.5"
                  style={{ borderColor: 'var(--figma-bg-outline)' }}
                  role="tablist"
                  aria-label="View mode"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'table'}
                    onClick={() => setViewMode('table')}
                    className="rounded px-3 py-1.5 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: viewMode === 'table' ? 'var(--figma-primary-main)' : undefined,
                      color: viewMode === 'table' ? 'white' : 'var(--figma-text-secondary)',
                    }}
                  >
                    Table
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'map'}
                    onClick={() => setViewMode('map')}
                    className="rounded px-3 py-1.5 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: viewMode === 'map' ? 'var(--figma-primary-main)' : undefined,
                      color: viewMode === 'map' ? 'white' : 'var(--figma-text-secondary)',
                    }}
                  >
                    Map
                  </button>
                </div>
              </>
            }
          />

          <TableCard
            pagination={{
              start,
              end,
              total: TOTAL_ITEMS,
              page,
              totalPages,
              onPageChange: setPage,
              showPageSelect: true,
            }}
          >
            <table className="w-full min-w-[900px] table-fixed border-collapse text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--figma-bg-depth1)' }}>
                  <DataTableHeaderCell label="" showCheckbox className="w-[32px] min-w-[32px]" />
                  <DataTableHeaderCell label="Equipment ID" className="w-[11%] min-w-[100px]" />
                  <DataTableHeaderCell label="Name" className="w-[14%] min-w-[120px]" />
                  <DataTableHeaderCell label="Status" className="w-[11%] min-w-[100px]" />
                  <DataTableHeaderCell label="Assignee(s)" className="w-[13%] min-w-[110px]" />
                  <DataTableHeaderCell label="Serial No." className="w-[13%] min-w-[110px]" />
                  <DataTableHeaderCell label="Groups" className="w-[11%] min-w-[90px]" />
                  <DataTableHeaderCell label="Onsite" className="w-[10%] min-w-[80px]" />
                  <DataTableHeaderCell label="Category" className="w-[11%] min-w-[90px]" />
                </tr>
              </thead>
              <tbody>
                {MOCK_EQUIPMENT.map((row) => {
                  const statusStyle = statusStyles[row.status]
                  return (
                    <tr
                      key={row.id}
                      className="border-t transition-colors hover:bg-black/[0.02]"
                      style={{ borderColor: 'var(--figma-bg-outline)' }}
                    >
                      <td className="w-[32px] min-w-[32px] px-4 py-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border"
                          style={{ borderColor: 'var(--figma-bg-outline)' }}
                          aria-label={`Select ${row.name}`}
                        />
                      </td>
                      <td className="w-[11%] min-w-[100px] px-4 py-3">
                        <a
                          href="#"
                          className="font-medium hover:underline"
                          style={{ color: 'var(--figma-primary-main)' }}
                          onClick={(e) => e.preventDefault()}
                        >
                          {row.equipmentId}
                        </a>
                      </td>
                      <td className="w-[14%] min-w-[120px] px-4 py-3" style={{ color: 'var(--figma-text-primary)' }}>
                        {row.name}
                      </td>
                      <td className="w-[11%] min-w-[100px] px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-medium"
                          style={{ color: statusStyle.color }}
                        >
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: statusStyle.color }}
                            aria-hidden
                          />
                          {row.status}
                        </span>
                      </td>
                      <td className="w-[13%] min-w-[110px] px-4 py-3" style={{ color: 'var(--figma-text-primary)' }}>
                        {row.assignee}
                      </td>
                      <td className="w-[13%] min-w-[110px] px-4 py-3" style={{ color: 'var(--figma-text-primary)' }}>
                        {row.serialNo}
                      </td>
                      <td className="w-[11%] min-w-[90px] px-4 py-3" style={{ color: 'var(--figma-text-primary)' }}>
                        {row.groups}
                      </td>
                      <td className="w-[10%] min-w-[80px] px-4 py-3" style={{ color: 'var(--figma-text-primary)' }}>
                        {row.onsite}
                      </td>
                      <td className="w-[11%] min-w-[90px] px-4 py-3" style={{ color: 'var(--figma-text-primary)' }}>
                        {row.category}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </TableCard>
        </div>
      )}

      {activeTab !== 'registry' && (
        <div
          className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border px-6 py-12 text-center"
          style={{
            backgroundColor: 'var(--figma-bg-default)',
            borderColor: 'var(--figma-bg-outline)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--figma-text-secondary)' }}>
            {EQUIPMENT_TABS.find((t) => t.id === activeTab)?.label} — coming soon.
          </p>
        </div>
      )}
    </ListPageLayout>
  )
}
