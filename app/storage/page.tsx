import { StorageMap } from '@/components/skybox/storage-map'
import { PageHeader, Readout } from '@/components/skybox/primitives'

export default function StoragePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        code="M-01"
        title="Storage Map"
        subtitle="Storage units bolted to the SKYBOX core. Hover a unit to open its casing and read capacity, I/O and latency telemetry."
      >
        <div className="flex flex-wrap gap-5">
          <Readout label="Total" value="4.8 TB" />
          <Readout label="Used" value="3.26 TB" />
          <Readout label="Free" value="1.54 TB" />
        </div>
      </PageHeader>
      <StorageMap />
    </div>
  )
}
