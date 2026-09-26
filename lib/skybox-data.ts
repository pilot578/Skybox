export type NodeStatus = 'healthy' | 'degraded' | 'offline' | 'syncing'

export type StorageNodeData = {
  id: string
  zone: string
  status: NodeStatus
  health: number
  cpu: number
  memory: number
  storageUsed: number
  capacityTb: number
  network: number
  latency: number
  objects: number
  replicas: number
  io: number
}

export const NODES: StorageNodeData[] = [
  { id: 'N01', zone: 'EU-W1', status: 'healthy', health: 99.9, cpu: 42, memory: 58, storageUsed: 71, capacityTb: 0.5, network: 812, latency: 11, objects: 4210, replicas: 12630, io: 84 },
  { id: 'N02', zone: 'EU-W1', status: 'healthy', health: 99.8, cpu: 51, memory: 62, storageUsed: 73, capacityTb: 0.5, network: 764, latency: 12, objects: 4388, replicas: 13164, io: 91 },
  { id: 'N03', zone: 'EU-C2', status: 'healthy', health: 99.9, cpu: 36, memory: 49, storageUsed: 70, capacityTb: 0.4, network: 690, latency: 14, objects: 3902, replicas: 11706, io: 72 },
  { id: 'N04', zone: 'EU-C2', status: 'healthy', health: 99.7, cpu: 48, memory: 55, storageUsed: 68, capacityTb: 0.4, network: 702, latency: 13, objects: 3861, replicas: 11583, io: 77 },
  { id: 'N05', zone: 'US-E1', status: 'syncing', health: 98.6, cpu: 64, memory: 71, storageUsed: 64, capacityTb: 0.4, network: 921, latency: 22, objects: 3544, replicas: 10632, io: 118 },
  { id: 'N06', zone: 'US-E1', status: 'healthy', health: 99.9, cpu: 39, memory: 52, storageUsed: 66, capacityTb: 0.4, network: 655, latency: 19, objects: 3720, replicas: 11160, io: 69 },
  { id: 'N07', zone: 'US-W2', status: 'healthy', health: 99.9, cpu: 33, memory: 47, storageUsed: 62, capacityTb: 0.4, network: 610, latency: 24, objects: 3410, replicas: 10230, io: 64 },
  { id: 'N08', zone: 'US-W2', status: 'healthy', health: 99.8, cpu: 45, memory: 60, storageUsed: 65, capacityTb: 0.4, network: 640, latency: 23, objects: 3655, replicas: 10965, io: 70 },
  { id: 'N09', zone: 'AP-S1', status: 'degraded', health: 96.2, cpu: 78, memory: 82, storageUsed: 79, capacityTb: 0.4, network: 488, latency: 38, objects: 4102, replicas: 12306, io: 55 },
  { id: 'N10', zone: 'AP-S1', status: 'healthy', health: 99.6, cpu: 41, memory: 53, storageUsed: 63, capacityTb: 0.4, network: 590, latency: 31, objects: 3588, replicas: 10764, io: 66 },
  { id: 'N11', zone: 'AP-N1', status: 'healthy', health: 99.9, cpu: 29, memory: 44, storageUsed: 58, capacityTb: 0.4, network: 570, latency: 29, objects: 3277, replicas: 9831, io: 61 },
  { id: 'N12', zone: 'AP-N1', status: 'healthy', health: 99.9, cpu: 35, memory: 46, storageUsed: 60, capacityTb: 0.4, network: 602, latency: 28, objects: 3394, replicas: 10182, io: 63 },
]

export type ObjectData = {
  id: string
  name: string
  size: string
  type: 'document' | 'image' | 'archive' | 'dataset' | 'video' | 'log'
  replicas: string[]
  verified: boolean
  hash: string
}

export const OBJECTS: ObjectData[] = [
  { id: 'OBJ-8291', name: 'report.pdf', size: '24 MB', type: 'document', replicas: ['N01', 'N04', 'N07'], verified: true, hash: '8f92a1c4e7' },
  { id: 'OBJ-8292', name: 'satellite-tile-0042.tif', size: '312 MB', type: 'image', replicas: ['N02', 'N06', 'N11'], verified: true, hash: 'a13e90bb2f' },
  { id: 'OBJ-8293', name: 'backup-2026-09.tar.gz', size: '1.8 GB', type: 'archive', replicas: ['N03', 'N08', 'N12'], verified: true, hash: '44d0c17a9e' },
  { id: 'OBJ-8294', name: 'telemetry.parquet', size: '640 MB', type: 'dataset', replicas: ['N05', 'N09', 'N01'], verified: false, hash: 'c9f3e2a0d1' },
  { id: 'OBJ-8295', name: 'launch-sequence.mp4', size: '2.4 GB', type: 'video', replicas: ['N07', 'N10', 'N02'], verified: true, hash: '0b7e55f13c' },
  { id: 'OBJ-8296', name: 'audit.log', size: '82 MB', type: 'log', replicas: ['N04', 'N11', 'N06'], verified: true, hash: 'e2a8b04f77' },
  { id: 'OBJ-8297', name: 'model-weights.bin', size: '4.1 GB', type: 'dataset', replicas: ['N12', 'N03', 'N09'], verified: true, hash: '7d19ac3e60' },
  { id: 'OBJ-8298', name: 'contract-v3.docx', size: '3 MB', type: 'document', replicas: ['N08', 'N01', 'N05'], verified: true, hash: '5aa2e9c781' },
  { id: 'OBJ-8299', name: 'orbit-render.png', size: '18 MB', type: 'image', replicas: ['N06', 'N10', 'N03'], verified: true, hash: 'f0c3b18e24' },
  { id: 'OBJ-8300', name: 'ledger-q3.csv', size: '156 MB', type: 'dataset', replicas: ['N11', 'N02', 'N08'], verified: true, hash: '93be07d4a2' },
  { id: 'OBJ-8301', name: 'kernel-trace.log', size: '410 MB', type: 'log', replicas: ['N09', 'N12', 'N04'], verified: true, hash: '2c6f4a91be' },
  { id: 'OBJ-8302', name: 'firmware-7.2.zip', size: '96 MB', type: 'archive', replicas: ['N10', 'N05', 'N07'], verified: true, hash: 'b84d2e06fa' },
]

export const SYSTEM = {
  health: 99.98,
  activeNodes: 12,
  objects: 48291,
  storageTb: 4.8,
  replication: 3,
  incidents: 0,
}

export const NAV_ITEMS = [
  { href: '/', label: 'Overview', module: 'COMMAND CORE', code: 'M-00' },
  { href: '/storage', label: 'Storage', module: 'STORAGE MAP', code: 'M-01' },
  { href: '/nodes', label: 'Nodes', module: 'NODE OBSERVATORY', code: 'M-02' },
  { href: '/objects', label: 'Objects', module: 'OBJECT EXPLORER', code: 'M-03' },
  { href: '/replication', label: 'Replication', module: 'REPLICATION ENGINE', code: 'M-04' },
  { href: '/recovery', label: 'Recovery', module: 'SELF-HEALING ENGINE', code: 'M-05' },
  { href: '/integrity', label: 'Integrity', module: 'INTEGRITY SCANNER', code: 'M-06' },
  { href: '/rebalance', label: 'Rebalance', module: 'BALANCE MACHINE', code: 'M-07' },
  { href: '/simulation', label: 'Simulation', module: 'SYSTEM SIMULATOR', code: 'M-08' },
] as const

export function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}
