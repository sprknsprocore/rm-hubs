import { useState } from 'react'
import { Settings, Plus, ChevronDown } from 'lucide-react'
import {
  ListPageLayout,
  ListToolbar,
  TableCard,
  DataTableHeaderCell,
} from './shared'

const MATERIALS_TABS = [
  { id: 'orders', label: 'Orders' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'shipments', label: 'Shipments' },
  { id: 'receipts', label: 'Receipts' },
  { id: 'defects', label: 'Defects' },
  { id: 'more', label: 'More' },
] as const

type MaterialsTabId = (typeof MATERIALS_TABS)[number]['id']

interface InventoryItem {
  id: string
  item: string
  description: string
  unitOfMeasure: string
  qtyRequired: number
  qtyOrdered: number
  qtyReceived: number
  qtyIssued: number
}

const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', item: 'Duplex Receptacles', description: '15A, 125V, NEMA 5-15R outlets', unitOfMeasure: 'ea', qtyRequired: 75, qtyOrdered: 75, qtyReceived: 75, qtyIssued: 0 },
  { id: '2', item: 'BV-T9FB92158', description: '1" Full Port Ball Valve Stainless Steel', unitOfMeasure: 'ea', qtyRequired: 12, qtyOrdered: 12, qtyReceived: 12, qtyIssued: 0 },
  { id: '3', item: 'Circuit Breakers (20A)', description: 'Single pole, 20A', unitOfMeasure: 'ea', qtyRequired: 24, qtyOrdered: 24, qtyReceived: 24, qtyIssued: 0 },
  { id: '4', item: 'Main Breaker Panel', description: '200A, 42 circuit', unitOfMeasure: 'ea', qtyRequired: 2, qtyOrdered: 2, qtyReceived: 2, qtyIssued: 0 },
  { id: '5', item: 'Cat6 Cable', description: 'Plenum rated, 1000 ft box', unitOfMeasure: 'feet', qtyRequired: 5000, qtyOrdered: 5000, qtyReceived: 5000, qtyIssued: 0 },
  { id: '6', item: 'Steel Columns (HSS 10x10...)', description: 'A500 Grade B', unitOfMeasure: 'tons', qtyRequired: 45, qtyOrdered: 45, qtyReceived: 40, qtyIssued: 0 },
  { id: '7', item: 'Carbon Steel Pipe (6-inch)', description: 'Schedule 40, A53', unitOfMeasure: 'linear feet', qtyRequired: 1200, qtyOrdered: 1200, qtyReceived: 800, qtyIssued: 0 },
  { id: '8', item: 'Flanges (ANSI 150, 6-inch)', description: 'Weld neck, 150#', unitOfMeasure: 'ea', qtyRequired: 48, qtyOrdered: 48, qtyReceived: 48, qtyIssued: 0 },
  { id: '9', item: 'Gate Valves (6-inch)', description: 'Class 150, flanged', unitOfMeasure: 'ea', qtyRequired: 12, qtyOrdered: 12, qtyReceived: 12, qtyIssued: 0 },
  { id: '10', item: 'Galvanized Sheet Metal Duct', description: '24 ga, 24" x 12"', unitOfMeasure: 'linear feet', qtyRequired: 800, qtyOrdered: 800, qtyReceived: 600, qtyIssued: 0 },
  { id: '11', item: 'Flexible Duct', description: 'R-6, 12" diameter', unitOfMeasure: 'linear feet', qtyRequired: 100, qtyOrdered: 100, qtyReceived: 0, qtyIssued: 100 },
  { id: '12', item: 'Insulated Metal Panels', description: '4" foam, 24 ga', unitOfMeasure: 'sq ft', qtyRequired: 5000, qtyOrdered: 5000, qtyReceived: 2500, qtyIssued: 0 },
  { id: '13', item: 'Duplex Receptacles', description: '20A, 125V, NEMA 5-20R', unitOfMeasure: 'ea', qtyRequired: 36, qtyOrdered: 36, qtyReceived: 36, qtyIssued: 0 },
  { id: '14', item: 'Single Pole Switches', description: '20A, 120V', unitOfMeasure: 'ea', qtyRequired: 48, qtyOrdered: 48, qtyReceived: 48, qtyIssued: 0 },
]

const PER_PAGE = 100
const TOTAL_ITEMS = 1376

export default function MaterialsListView() {
  const [activeTab, setActiveTab] = useState<MaterialsTabId>('inventory')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'items' | 'locations'>('items')
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(TOTAL_ITEMS / PER_PAGE)
  const start = (page - 1) * PER_PAGE + 1
  const end = Math.min(page * PER_PAGE, TOTAL_ITEMS)

  return (
    <ListPageLayout
      title="Materials"
      subtitle="Orders, inventory, shipments, receipts, and defects."
      tabs={MATERIALS_TABS}
      activeTabId={activeTab}
      onTabChange={(id) => setActiveTab(id as MaterialsTabId)}
      titleAction={
        <button
          type="button"
          className="rounded p-1 transition-colors hover:bg-black/5"
          style={{ color: 'var(--figma-text-secondary)' }}
          aria-label="Materials settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      }
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
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded border px-3 py-2 text-sm font-medium transition-colors hover:bg-black/5"
            style={{
              borderColor: 'var(--figma-bg-outline)',
              color: 'var(--figma-text-primary)',
            }}
          >
            Export
          </button>
          <button
            type="button"
            className="rounded border px-3 py-2 text-sm font-medium transition-colors hover:bg-black/5"
            style={{
              borderColor: 'var(--figma-bg-outline)',
              color: 'var(--figma-text-primary)',
            }}
          >
            Import
          </button>
        </div>
      }
    >
      {activeTab === 'inventory' && (
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold" style={{ color: 'var(--figma-text-primary)' }}>
            Inventory
          </h2>

          <ListToolbar
            searchValue={search}
            onSearchChange={setSearch}
            onFilterClick={() => {}}
            rightActions={
              <>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded border px-3 py-2 text-sm font-medium transition-colors hover:bg-black/5"
                  style={{
                    borderColor: 'var(--figma-bg-outline)',
                    color: 'var(--figma-text-primary)',
                  }}
                >
                  <Settings className="h-4 w-4" />
                  Configure
                </button>
                <div
                  className="inline-flex rounded border p-0.5"
                  style={{ borderColor: 'var(--figma-bg-outline)' }}
                  role="tablist"
                  aria-label="View by items or locations"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'items'}
                    onClick={() => setViewMode('items')}
                    className="rounded px-3 py-1.5 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: viewMode === 'items' ? 'var(--figma-primary-main)' : undefined,
                      color: viewMode === 'items' ? 'white' : 'var(--figma-text-secondary)',
                    }}
                  >
                    Items
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'locations'}
                    onClick={() => setViewMode('locations')}
                    className="rounded px-3 py-1.5 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: viewMode === 'locations' ? 'var(--figma-primary-main)' : undefined,
                      color: viewMode === 'locations' ? 'white' : 'var(--figma-text-secondary)',
                    }}
                  >
                    Locations
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
                  <DataTableHeaderCell label="Item" showCheckbox className="w-[18%] min-w-[140px]" />
                  <DataTableHeaderCell label="Desc" className="w-[28%] min-w-[200px]" />
                  <DataTableHeaderCell label="UOM" className="w-[12%] min-w-[100px]" />
                  <DataTableHeaderCell label="Qty Req" className="w-[10%] min-w-[80px]" align="right" />
                  <DataTableHeaderCell label="Qty Ord" className="w-[10%] min-w-[80px]" align="right" />
                  <DataTableHeaderCell label="Qty Rec" className="w-[10%] min-w-[80px]" align="right" />
                  <DataTableHeaderCell label="Qty Iss" className="w-[12%] min-w-[80px]" align="right" />
                </tr>
              </thead>
              <tbody>
                {MOCK_INVENTORY.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t transition-colors hover:bg-black/[0.02]"
                    style={{ borderColor: 'var(--figma-bg-outline)' }}
                  >
                    <td className="w-[18%] min-w-[140px] px-4 py-3">
                      <div className="flex min-w-0 items-center gap-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 shrink-0 rounded border"
                          style={{ borderColor: 'var(--figma-bg-outline)' }}
                          aria-label={`Select ${row.item}`}
                        />
                        <a
                          href="#"
                          className="min-w-0 truncate font-medium hover:underline"
                          style={{ color: 'var(--figma-primary-main)' }}
                          onClick={(e) => e.preventDefault()}
                        >
                          {row.item}
                        </a>
                      </div>
                    </td>
                    <td className="w-[28%] min-w-[200px] px-4 py-3" style={{ color: 'var(--figma-text-secondary)' }}>
                      <span className="line-clamp-2">{row.description}</span>
                    </td>
                    <td className="w-[12%] min-w-[100px] px-4 py-3" style={{ color: 'var(--figma-text-primary)' }}>
                      {row.unitOfMeasure}
                    </td>
                    <td className="w-[10%] min-w-[80px] px-4 py-3 text-right tabular-nums" style={{ color: 'var(--figma-text-primary)' }}>
                      {row.qtyRequired.toLocaleString()}
                    </td>
                    <td className="w-[10%] min-w-[80px] px-4 py-3 text-right tabular-nums" style={{ color: 'var(--figma-text-primary)' }}>
                      {row.qtyOrdered.toLocaleString()}
                    </td>
                    <td className="w-[10%] min-w-[80px] px-4 py-3 text-right tabular-nums" style={{ color: 'var(--figma-text-primary)' }}>
                      {row.qtyReceived.toLocaleString()}
                    </td>
                    <td className="w-[12%] min-w-[80px] px-4 py-3 text-right tabular-nums" style={{ color: 'var(--figma-text-primary)' }}>
                      {row.qtyIssued.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </div>
      )}

      {activeTab !== 'inventory' && (
        <div
          className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border px-6 py-12 text-center"
          style={{
            backgroundColor: 'var(--figma-bg-default)',
            borderColor: 'var(--figma-bg-outline)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--figma-text-secondary)' }}>
            {MATERIALS_TABS.find((t) => t.id === activeTab)?.label} — coming soon.
          </p>
        </div>
      )}
    </ListPageLayout>
  )
}
