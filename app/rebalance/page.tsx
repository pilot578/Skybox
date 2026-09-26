import { RebalanceSystem } from '@/components/skybox/rebalance-system'
import { PageHeader } from '@/components/skybox/primitives'

export default function RebalancePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        code="M-07"
        title="Rebalancing System"
        subtitle="A mechanical balance beam tracks load skew across storage units. Run a rebalance to migrate blocks from hot nodes into cooler ones."
      />
      <RebalanceSystem />
    </div>
  )
}
