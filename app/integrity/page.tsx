import { IntegrityScanner } from '@/components/skybox/integrity-scanner'
import { PageHeader, Readout } from '@/components/skybox/primitives'

export default function IntegrityPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        code="M-06"
        title="Integrity Scanner"
        subtitle="A rotating verification beam sweeps every sector of the object store, recomputing SHA-256 checksums and flagging drift for repair."
      >
        <div className="flex flex-wrap gap-5">
          <Readout label="Sweep" value="6.0s" />
          <Readout label="Algorithm" value="SHA-256" />
        </div>
      </PageHeader>
      <IntegrityScanner />
    </div>
  )
}
