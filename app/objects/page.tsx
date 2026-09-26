import { ObjectExplorer } from '@/components/skybox/object-explorer'
import { PageHeader, Readout } from '@/components/skybox/primitives'

export default function ObjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        code="M-03"
        title="Object Explorer"
        subtitle="Objects as physical data modules. Hover a block to reveal its replica path across the node mesh."
      >
        <div className="flex flex-wrap gap-5">
          <Readout label="Objects" value="48,291" />
          <Readout label="Verified" value="99.99%" />
          <Readout label="Avg Size" value="102 MB" />
        </div>
      </PageHeader>
      <ObjectExplorer />
    </div>
  )
}
