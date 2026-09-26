import { NodeObservatory } from '@/components/skybox/node-observatory'
import { PageHeader, Readout } from '@/components/skybox/primitives'

export default function NodesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        code="M-02"
        title="Node Observatory"
        subtitle="Every storage node as a precision module. Hover a module to energize its links; click to open full telemetry."
      >
        <div className="flex flex-wrap gap-5">
          <Readout label="Online" value="12 / 12" />
          <Readout label="Degraded" value="1" />
          <Readout label="Avg Latency" value="22ms" />
        </div>
      </PageHeader>
      <NodeObservatory />
    </div>
  )
}
