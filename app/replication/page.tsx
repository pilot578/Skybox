import { ReplicationEngine } from '@/components/skybox/replication-engine'
import { MechanicalGauge } from '@/components/skybox/mechanical'
import { PageHeader, Panel, Readout, StatusIndicator, TechnicalLabel } from '@/components/skybox/primitives'

export default function ReplicationPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        code="M-04"
        title="Replication Engine"
        subtitle="Every object entering SKYBOX is mechanically split into three replicas and routed along independent paths. Hover a path to isolate it."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <Panel title="Engine" code="RPL-ENG-01" className="p-5">
          <ReplicationEngine />
        </Panel>
        <div className="flex flex-col gap-4">
          <Panel title="Replication Factor" code="RF">
            <div className="flex justify-center">
              <MechanicalGauge label="Factor" value={3} max={3} display="3" sub="TARGET 3" size={150} />
            </div>
          </Panel>
          <Panel title="Healthy Replicas" code="HR">
            <div className="flex items-center justify-between">
              <span className="font-mono text-3xl tabular-nums text-[#2f64b5]">3 / 3</span>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <StatusIndicator key={i} />
                ))}
              </div>
            </div>
          </Panel>
          <Panel title="Consistency" code="CNS">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xl uppercase tracking-[0.2em] text-[#2f64b5]">Verified</span>
              <TechnicalLabel>SHA-256</TechnicalLabel>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3">
              <Readout label="Write Quorum" value="2 / 3" />
              <Readout label="Lag" value="4ms" />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
