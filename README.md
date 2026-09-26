
# ☁️ SKYBOX — Distributed Object Storage System

### Fault-Tolerant • Replication • Data Integrity • Self-Healing

SKYBOX is a distributed object storage system dashboard designed to visualize and monitor storage nodes, object replication, data integrity, fault recovery, and storage rebalancing.

The platform provides an interactive interface for exploring how a fault-tolerant storage system can manage data across multiple nodes, detect failures, and maintain data reliability.

## 🚀 Features

- **Command Core Dashboard** — Monitor system health, active nodes, storage capacity, and replication status.
- **Storage Map** — Visualize storage distribution across multiple nodes and zones.
- **Node Observatory** — Explore node health, resource utilization, and connectivity status.
- **Object Explorer** — Browse stored objects, replica locations, and integrity status.
- **Replication Engine** — Visualize replica distribution and replication policies.
- **Self-Healing Recovery** — Explore recovery workflows for failed or unavailable nodes.
- **Integrity Scanner** — Monitor object verification and data integrity status.
- **Rebalancing System** — Visualize data redistribution across storage nodes.
- **System Simulator** — Explore simulated storage events and failure scenarios.

## 🛠️ Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **UI Library:** React
- **Styling:** Tailwind CSS
- **Animations:** Motion
- **Icons:** Lucide React
- **Package Manager:** pnpm

## 📦 Installation

### Prerequisites

Make sure you have the following installed:

- Node.js
- pnpm

### 1. Clone the repository

```bash
git clone https://github.com/pilot578/Skybox.git
```

### 2. Navigate to the project directory

```bash
cd Skybox
```

### 3. Install dependencies

```bash
pnpm install
```

### 4. Start the development server

```bash
pnpm dev
```

### 5. Open in your browser

Visit:

http://localhost:3000

## 📂 Project Structure

```text
Skybox/
├── app/
│   ├── integrity/
│   ├── nodes/
│   ├── objects/
│   ├── rebalance/
│   ├── recovery/
│   ├── replication/
│   ├── simulation/
│   ├── storage/
│   ├── page.tsx
│   └── layout.tsx
├── components/
│   ├── skybox/
│   └── ui/
├── lib/
│   ├── skybox-data.ts
│   └── utils.ts
├── public/
├── package.json
└── README.md
```

## 🎯 Project Objective

The goal of SKYBOX is to demonstrate the architecture and operational concepts of a fault-tolerant distributed object storage system, including replication, node monitoring, integrity verification, failure recovery, and data rebalancing.

## 📌 Current Status

SKYBOX currently provides a visual dashboard with sample storage and node data. The interface is designed to demonstrate distributed storage concepts; a production-ready distributed storage backend is not included in the current version.

## 👩‍💻 Author

**Yashika**

GitHub: [@pilot578](https://github.com/pilot578)

---

⭐ If you find this project interesting, consider giving it a star!
