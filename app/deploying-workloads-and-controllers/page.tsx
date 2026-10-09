import type { Metadata } from 'next';
import { DeckShell } from './_components/DeckShell';
import { slides } from './_slides';
import './deck.css';

export const metadata: Metadata = {
  title: 'Deploying Workloads & the Controller Pattern · Kubedocs',
  description:
    'A working walkthrough of how production Kubernetes workloads are defined, deployed, scaled, rolled out, rolled back, debugged, and reconciled by controllers.',
};

export default function DeployingWorkloadsPage() {
  return <DeckShell slides={slides} />;
}