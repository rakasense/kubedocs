export type DocModule = {
  href: string;
  title: string;
  description: string;
  status: 'shipped' | 'draft';
};

/**
 * Registry of every docs module in the site. New modules land here so
 * the homepage dropdown and any future index stay in sync.
 */
export const docModules: DocModule[] = [
  {
    href: '/deploying-workloads-and-controllers/',
    title: 'Deploying Workloads & the Controller Pattern',
    description:
      'A working walkthrough of how production Kubernetes workloads are defined, deployed, scaled, rolled out, rolled back, debugged, and reconciled by controllers.',
    status: 'shipped',
  },
];
