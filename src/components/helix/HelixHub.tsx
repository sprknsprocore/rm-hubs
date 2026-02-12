import '../../styles/helix.css'
import HelixLeftNav from './HelixLeftNav'
import HelixTopRail from './HelixTopRail'
import HelixRightRail from './HelixRightRail'
import PortfolioSummaryCard from './PortfolioSummaryCard'
import MyActionItemsCard from './MyActionItemsCard'
import PortfolioCard from './PortfolioCard'
import FinancialStatusCard from './FinancialStatusCard'

export default function HelixHub() {
  return (
    <div className="helix-root flex min-h-screen" style={{ backgroundColor: 'var(--helix-bg-page)' }}>
      <HelixLeftNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <HelixTopRail />
        <main className="flex-1 md:p-6" style={{ padding: 'var(--helix-grid-gap)' }}>
          <div className="@container mx-auto" style={{ maxWidth: 'var(--helix-content-max)' }}>
          <div
            className="grid @min-[640px]:grid-cols-2"
            style={{
              gap: 'var(--helix-grid-gap)',
            }}
          >
            <div className="min-h-[300px]">
              <PortfolioSummaryCard />
            </div>
            <div className="min-h-[300px]">
              <MyActionItemsCard />
            </div>
            <div className="min-h-[300px]">
              <PortfolioCard />
            </div>
            <div className="min-h-[300px]">
              <FinancialStatusCard />
            </div>
          </div>
          </div>
        </main>
      </div>
      <HelixRightRail />
    </div>
  )
}
