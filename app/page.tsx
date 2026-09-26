import { OrbitSystem } from '@/components/skybox/orbit-system'
import { MechanicalGauge } from '@/components/skybox/mechanical'
import { PageHeader, Panel, Readout, StatusIndicator, TechnicalLabel } from '@/components/skybox/primitives'
import { SYSTEM } from '@/lib/skybox-data'

const LEFT = [
  { label: 'System Health', value: SYSTEM.health, display: `${SYSTEM.health}%`, sub: 'HEALTH-01' },
  { label: 'Active Nodes', value: SYSTEM.activeNodes, max: 12, display: String(SYSTEM.activeNodes), sub: '12 / 12 ONLINE' },
  { label: 'Objects', value: 78, display: SYSTEM.objects.toLocaleString(), sub: 'OBJ-INDEX' },
]
const RIGHT = [
  { label: 'Storage', value: 4.8, max: 6, display: `${SYSTEM.storageTb} TB`, sub: '80% OF 6 TB' },
  { label: 'Replication', value: 3, max: 3, display: `${SYSTEM.replication}×`, sub: 'FACTOR' },
  { label: 'Recovery', value: 0, display: '0', sub: 'INCIDENTS' },
]

const EVENTS = [
  { t: '14:02:11', msg: 'REPLICA-03 verified on N07', code: 'SHA-256' },
  { t: '14:01:54', msg: 'N05 sync window opened', code: 'SYNC' },
  { t: '14:01:20', msg: 'Rebalance cycle complete · Δ 2.1%', code: 'RBL-12' },
  { t: '14:00:47', msg: 'Integrity sweep 100% · 0 corrupt', code: 'INT-88' },
]

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        code="M-00"
        title="Command Core"
        subtitle="Live mechanical view of the SKYBOX distributed object store. Twelve nodes orbit the core while data particles replicate across the mesh."
      >
        <div className="flex flex-wrap items-center gap-5">
          <Readout label="Latency" value="12ms" />
          <Readout label="I/O" value="84MB/s" />
          <Readout label="Uptime" value="412d 06h" />
        </div>
      </PageHeader>

      <section className="grid items-center gap-6 lg:grid-cols-[220px_1fr_220px]">
        <div className="order-2 grid grid-cols-3 gap-3 lg:order-1 lg:grid-cols-1">
          {LEFT.map((g) => (
            <Panel key={g.label} className="flex justify-center p-3">
              <MechanicalGauge {...g} size={140} />
            </Panel>
          ))}
        </div>

        <div className="relative order-1 flex justify-center lg:order-2">
          <TechnicalLabel className="absolute left-0 top-0">X 000 · Y 000</TechnicalLabel>
          <TechnicalLabel className="absolute right-0 top-0">ORBIT-R 218</TechnicalLabel>
          <TechnicalLabel className="absolute bottom-0 left-0">NODE MESH · 12</TechnicalLabel>
          <TechnicalLabel className="absolute bottom-0 right-0">REV 0.5 RPM</TechnicalLabel>
          <OrbitSystem />
        </div>

        <div className="order-3 grid grid-cols-3 gap-3 lg:grid-cols-1">
          {RIGHT.map((g) => (
            <Panel key={g.label} className="flex justify-center p-3">
              <MechanicalGauge {...g} size={140} />
            </Panel>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Panel title="Event Stream" code="LOG-01" className="md:col-span-2">
          <ul className="flex flex-col divide-y divide-line">
            {EVENTS.map((e) => (
              <li key={e.t} className="flex items-center gap-4 py-2 font-mono text-xs">
                <span className="tabular-nums text-muted-foreground">{e.t}</span>
                <StatusIndicator />
                <span className="flex-1 text-foreground">{e.msg}</span>
                <TechnicalLabel>{e.code}</TechnicalLabel>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Zones" code="GEO-04">
          <ul className="flex flex-col gap-3">
            {['EU-W1', 'EU-C2', 'US-E1', 'US-W2', 'AP-S1', 'AP-N1'].map((z, i) => (
              <li key={z} className="flex items-center justify-between font-mono text-xs">
                <span className="text-foreground">{z}</span>
                <span className="flex gap-1">
                  {[0, 1].map((k) => (
                    <span key={k} className={`h-2 w-5 rounded-sm ${i === 4 && k === 0 ? 'bg-[#f6d9a8]' : 'bg-blush'}`} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </section>
    </div>
  )
}
