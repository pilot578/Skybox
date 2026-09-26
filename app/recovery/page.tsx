import { RecoveryEngine } from '@/components/skybox/recovery-engine'
import { PageHeader } from '@/components/skybox/primitives'

export default function RecoveryPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        code="M-05"
        title="Self-Healing Engine"
        subtitle="Trigger a node failure and watch SKYBOX disconnect, reroute, commission a replacement and stream healthy replicas back to full redundancy."
      />
      <RecoveryEngine />
    </div>
  )
}
