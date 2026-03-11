Got it! Here's the updated README with the screenshot included:

---

# NIST RMF Tracker

A comprehensive, browser-based **Risk Management Framework (RMF) compliance tracker** built with React, aligned to **NIST SP 800-53 Revision 5**.

## Overview

NIST RMF Tracker is a single-file React application designed to help security teams manage and monitor their organization's compliance posture across the full NIST 800-53 Rev 5 control catalog. It provides a centralized workspace for tracking systems, vulnerabilities, POA&Ms, security assessments, and FISMA reporting — all without requiring a backend or database.

## Screenshot

![RMF Tracker Dashboard](./screenshots/RMF_Tracker.png)

*The main dashboard provides an at-a-glance view of your organization's security posture, including total vulnerabilities, open POA&Ms, POAM coverage percentage, system status, and top affected controls.*

## Features

- **Dashboard** — At-a-glance summary of compliance status across all tracked systems
- **Systems Management** — Register and manage information systems with associated metadata and control baselines (Low / Moderate / High)
- **Controls Tracker** — Browse and update implementation status for the full NIST 800-53 Rev 5 control catalog (20 control families)
- **Vulnerability Management** — Log, track, and triage open vulnerabilities linked to specific systems
- **POA&M Management** — Create and manage Plan of Action & Milestones for remediation tracking
- **Risk Assessment Report (RAR)** — Generate per-system risk assessment summaries
- **Security Assessment Report (SAR)** — Document and export security assessment findings
- **FISMA Reporting** — Produce FISMA-aligned compliance snapshots
- **Asset Inventory** — Track hardware and software assets associated with each system

## Tech Stack

- **React** (functional components + hooks)
- **Inline CSS / Google Fonts** (Syne, DM Mono) — no external CSS framework required
- Zero backend dependencies — all state is managed in-memory

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-org/nist-rmf-tracker.git
cd nist-rmf-tracker

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or whichever port your dev server uses).

## Usage

1. Start by adding one or more **Systems** under the Systems tab.
2. Set your system as **Active** using the sidebar to scope controls, vulnerabilities, and POA&Ms to that system.
3. Work through the **Controls** tab to mark implementation statuses.
4. Log findings in **Vulnerabilities** and promote them to **POA&Ms** as needed.
5. Use the **RAR**, **SAR**, and **FISMA** tabs to generate compliance reports.

## License

MIT

---
> mkdir screenshots
> # then move/copy your image there
> ```
