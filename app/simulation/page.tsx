import { SystemSimulator } from '@/components/skybox/system-simulator'
import { PageHeader } from '@/components/skybox/primitives'

export default function SimulationPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        code="M-08"
        title="System Simulator"
        subtitle="A live sandbox of the SKYBOX mesh. Power nodes down, commission new ones, upload objects and inject traffic to watch the system adapt."
      />
      <SystemSimulator />
    </div>
  )
}
