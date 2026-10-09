import type { ReactNode } from 'react';
import { K, S, N, C, Punc, Box, Arrow, Panel, Cmd, CmdInline, Flow, Callout, TitleTag, Title, Lede, MetaRow, MetaChip, ZoomStage } from '../_components/primitives';
import styles from '../deck.module.css';
import type { DeckSlide } from '../_components/DeckShell';

/* ============================================================
 * Slide registry — every slide lives in this array. The order
 * here is the order they appear on the page.
 * ============================================================ */

const TOTAL = 22;

/* Local helpers used by individual slides */

function Code({ children }: { children: ReactNode }) {
  return <pre className={`${styles.code} mono`}>{children}</pre>;
}

function CodeSm({ children }: { children: ReactNode }) {
  return <pre className={`${styles.codeSm} mono`}>{children}</pre>;
}

function Grid2({ children, grow, className, style }: { children: ReactNode; grow?: boolean; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={[styles.grid2, grow ? styles.grow : '', className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  );
}

function Grid3({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className ?? styles.grid3}>{children}</div>;
}

function Grid3x({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className ?? styles.grid3x}>{children}</div>;
}

function Grid4({ children, grow }: { children: ReactNode; grow?: boolean }) {
  return <div className={[styles.grid4, grow ? styles.grow : ''].filter(Boolean).join(' ')}>{children}</div>;
}

function VFlow({ children }: { children: ReactNode }) {
  return (
    <div className={styles.flow} style={{ flexDirection: 'column', gap: 8, alignItems: 'stretch' }}>
      {children}
    </div>
  );
}

function VFlowTight({ children }: { children: ReactNode }) {
  return (
    <div className={styles.flow} style={{ flexDirection: 'column', gap: 6, alignItems: 'stretch' }}>
      {children}
    </div>
  );
}

function BoxInset({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={[styles.boxInset ?? styles.box, className].filter(Boolean).join(' ')} style={style}>{children}</div>;
}

function PanelInset({ children }: { children: ReactNode }) {
  return <div className={styles.panelInset}>{children}</div>;
}

function VBox({ children, accent }: { children: ReactNode; accent?: boolean | 'accent' | 'accent-2' | 'warn' | 'danger' }) {
  const isAccent = accent === true || accent === 'accent' || accent === undefined;
  return (
    <div className={styles.box} style={isAccent ? { borderColor: 'var(--accent)', color: 'var(--accent)', boxShadow: '0 0 24px -8px var(--accent)' } : undefined}>
      {children}
    </div>
  );
}

function DownArrow() {
  return <div className={styles.arrow}>↓</div>;
}

function TightList({ children }: { children: ReactNode }) {
  return <ul className={styles.tight}>{children}</ul>;
}

function Small({ children, muted, style }: { children: ReactNode; muted?: boolean; style?: React.CSSProperties }) {
  return <p className={[styles.small, muted ? styles.muted : ''].filter(Boolean).join(' ')} style={style}>{children}</p>;
}

function LabelCap({ children }: { children: ReactNode }) {
  return <div className={styles.labelCap}>{children}</div>;
}

function Tiny({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return <div className={[styles.tiny, muted ? styles.muted : ''].filter(Boolean).join(' ')}>{children}</div>;
}

function Tag({ children, accent, warn }: { children: ReactNode; accent?: boolean; warn?: boolean }) {
  return (
    <span className={[styles.tag, accent ? styles.tagAccent : '', warn ? styles.tagWarn : ''].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}

function Matrix({ children }: { children: ReactNode }) {
  return <table className={styles.matrix}>{children}</table>;
}

/**
 * MatrixHeader — use inside <Matrix> for the header row. Wraps in <thead>.
 * MatrixBody — use for the body rows. Wraps in <tbody>.
 *
 * The browser auto-inserts a <tbody> if it's missing, which causes
 * React hydration mismatches. Always use these wrappers explicitly.
 */
function MatrixHeader({ children }: { children: ReactNode }) {
  return <thead className={styles.matrixHead}>{children}</thead>;
}

function MatrixBody({ children }: { children: ReactNode }) {
  return <tbody className={styles.matrixBody}>{children}</tbody>;
}

/* ============================================================
 * The slides
 * ============================================================ */

const slides: DeckSlide[] = [
  /* ---------- 1 — Title ---------- */
  {
    id: 'title',
    n: 1,
    total: TOTAL,
    isTitle: true,
    eyebrow: '',
    title: '',
    metaRight: '',
    children: (
      <>
        <TitleTag>K8S · CONTROL-ROOM · v1.0</TitleTag>
        <Title>
          Deploying Workloads
          <br />
          &amp; the <span className="accent">Controller Pattern</span>
        </Title>
        <Lede>
          A working walkthrough of how production Kubernetes workloads are defined,
          deployed, scaled, rolled out, rolled back, debugged, and reconciled by controllers —
          observed through the same lens that watches the cluster.
        </Lede>
        <MetaRow>
          <MetaChip>// module-01</MetaChip>
          <MetaChip>// hands-on</MetaChip>
          <MetaChip>// self-paced</MetaChip>
          <MetaChip>// 22 frames</MetaChip>
        </MetaRow>
      </>
    ),
  },

  /* ---------- 2 — Why Kubernetes Workloads Exist ---------- */
  {
    id: 'why-workloads',
    n: 2,
    total: TOTAL,
    eyebrow: '01 · foundation',
    title: 'Why Kubernetes Workloads Exist',
    subtitle: 'From a process to a reconciled, self-healing system',
    metaRight: '// kubectl get/describe/logs',
    children: (
      <Grid2 grow>
        <Panel>
          <h3>The four building blocks</h3>
          <Flow style={{ marginTop: 14 }}>
            <Box>Pod</Box>
            <Arrow>→</Arrow>
            <Box>Controller</Box>
            <Arrow>→</Arrow>
            <Box>Service</Box>
            <Arrow>→</Arrow>
            <Box>Storage</Box>
          </Flow>
          <LabelCap>
            Pod runs your code · Controller keeps it running · Service exposes it · Storage gives it state
          </LabelCap>
          <h3 style={{ marginTop: 24 }}>The problem without a controller</h3>
          <TightList>
            <li>Process crashes → who restarts it?</li>
            <li>Node dies → who reschedules?</li>
            <li>Traffic spikes → who scales?</li>
            <li>New image → who rolls it out safely?</li>
            <li>Bad release → who rolls it back?</li>
          </TightList>
        </Panel>

        <Panel delay={2}>
          <h3>Desired vs Actual state</h3>
          <p>
            Kubernetes is a <b>reconciliation engine</b>. You describe what you want — controllers make it true.
          </p>
          <Grid2 style={{ marginTop: 14 }}>
            <PanelInset>
              <Tiny muted>// desired</Tiny>
              <BoxInset style={{ width: '100%' }}>3 replicas · image:v2 · cpu=500m</BoxInset>
            </PanelInset>
            <PanelInset>
              <Tiny muted>// actual</Tiny>
              <BoxInset style={{ width: '100%' }}>2 replicas running · 1 crash-looping</BoxInset>
            </PanelInset>
          </Grid2>
          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <VBox accent>controller reconciles</VBox>
          </div>
          <Small muted style={{ marginTop: 14 }}>
            "The system continuously closes the gap between what you asked for and what is running."
          </Small>
        </Panel>
      </Grid2>
    ),
  },

  /* ---------- 3 — Workload Landscape ---------- */
  {
    id: 'landscape',
    n: 3,
    total: TOTAL,
    eyebrow: '02 · landscape',
    title: 'Kubernetes Workload Landscape',
    subtitle: 'Pick the right primitive for the right job',
    metaRight: '// kubectl api-resources',
    children: (
      <Grid4 grow>
        <Panel><h3>Pod</h3><Small muted>Smallest deployable unit. One or more co-scheduled containers sharing network and volumes.</Small></Panel>
        <Panel delay={2}><h3>Deployment</h3><Small muted>Stateless app with rolling updates and rollbacks. Owns a ReplicaSet.</Small></Panel>
        <Panel delay={2}><h3>StatefulSet</h3><Small muted>Stable identity + per-pod PVCs. Databases, queues, clustered software.</Small></Panel>
        <Panel delay={3}><h3>DaemonSet</h3><Small muted>Exactly one Pod per node. Agents, log shippers, CNI, monitoring.</Small></Panel>
        <Panel delay={2}><h3>Job</h3><Small muted>Run-to-completion. Batch, migrations, one-shot data jobs.</Small></Panel>
        <Panel delay={3}><h3>CronJob</h3><Small muted>Time-scheduled Jobs. Backups, reports, reindexing.</Small></Panel>
        <Panel delay={2}><h3>ReplicaSet</h3><Small muted>Maintains N pod replicas. Almost always owned by a Deployment.</Small></Panel>
        <Panel delay={3}><h3>Supporting</h3><Small muted>Service · ConfigMap · Secret · PVC · HPA · PDB · NetworkPolicy · Ingress · ServiceAccount.</Small></Panel>
      </Grid4>
    ),
  },

  /* ---------- 4 — Pod Deep Dive ---------- */
  {
    id: 'pod',
    n: 4,
    total: TOTAL,
    eyebrow: '03 · pod',
    title: 'Pod',
    subtitle: 'The atomic unit of Kubernetes',
    metaRight: '// pods are mortal · controllers respawn them',
    children: (
      <Grid3x className={styles.body}>
        <Panel>
          <h3>Lifecycle</h3>
          <Flow style={{ flexWrap: 'wrap' }}>
            <BoxInset>Pending</BoxInset>
            <Arrow>→</Arrow>
            <BoxInset>Creating</BoxInset>
            <Arrow>→</Arrow>
            <BoxInset>Running</BoxInset>
            <Arrow>→</Arrow>
            <BoxInset>Done</BoxInset>
          </Flow>
          <h3 style={{ marginTop: 16 }}>Spec essentials</h3>
          <TightList>
            <li><b>containers[]</b> — image, ports, env</li>
            <li><b>resources</b> — req / limit</li>
            <li><b>probes</b> — startup · readiness · liveness</li>
            <li><b>securityContext</b> — nonRoot, readOnly FS</li>
            <li><b>volumes</b> + <b>volumeMounts</b></li>
            <li><b>serviceAccountName</b> — API identity</li>
          </TightList>
        </Panel>

        <Panel delay={2} className={styles.codePanel}>
          <CodeSm>
            <C># Minimal production-grade Pod</C>{'\n'}
            <K>apiVersion</K>: <S>v1</S>{'\n'}
            <K>kind</K>: <S>Pod</S>{'\n'}
            <K>metadata</K>:{'\n'}
            {'  '}<K>name</K>: <S>web</S>{'\n'}
            {'  '}<K>labels</K>: {`{ `}<K>app</K>: <S>web</S>{` }`}{'\n'}
            <K>spec</K>:{'\n'}
            {'  '}<K>containers</K>:{'\n'}
            {'    '}- <K>name</K>: <S>app</S>{'\n'}
            {'      '}<K>image</K>: <S>ghcr.io/acme/web:1.4.0</S>{'\n'}
            {'      '}<K>ports</K>: [{`{ `}<K>containerPort</K>: <N>8080</N>{` }`}]{'\n'}
            {'      '}<K>resources</K>:{'\n'}
            {'        '}<K>requests</K>: {`{ `}<K>cpu</K>: <S>&quot;100m&quot;</S>, <K>memory</K>: <S>&quot;128Mi&quot;</S>{` }`}{'\n'}
            {'        '}<K>limits</K>:   {`{ `}<K>cpu</K>: <S>&quot;500m&quot;</S>, <K>memory</K>: <S>&quot;256Mi&quot;</S>{` }`}{'\n'}
            {'      '}<K>readinessProbe</K>:{'\n'}
            {'        '}<K>httpGet</K>: {`{ `}<K>path</K>: <S>/healthz</S>, <K>port</K>: <N>8080</N>{` }`}{'\n'}
            {'      '}<K>livenessProbe</K>:{'\n'}
            {'        '}<K>httpGet</K>: {`{ `}<K>path</K>: <S>/livez</S>, <K>port</K>: <N>8080</N>{` }`}{'\n'}
            {'      '}<K>securityContext</K>:{'\n'}
            {'        '}<K>runAsNonRoot</K>: <N>true</N>{'\n'}
            {'        '}<K>readOnlyRootFilesystem</K>: <N>true</N>{'\n'}
            {'        '}<K>allowPrivilegeEscalation</K>: <N>false</N>{'\n'}
          </CodeSm>
        </Panel>

        <Panel delay={3}>
          <h3>Operate</h3>
          <Cmd sm>kubectl apply -f pod.yaml</Cmd>
          <Cmd sm>kubectl get pod web -o wide</Cmd>
          <Cmd sm>kubectl describe pod web</Cmd>
          <Cmd sm>kubectl logs web</Cmd>
          <Cmd sm>kubectl logs web --previous</Cmd>
          <Cmd sm>kubectl exec -it web -- sh</Cmd>
          <Cmd sm>kubectl delete pod web</Cmd>
        </Panel>
      </Grid3x>
    ),
  },

  /* ---------- 5 — Deployment Deep Dive ---------- */
  {
    id: 'deployment',
    n: 5,
    total: TOTAL,
    eyebrow: '04 · deployment',
    title: 'Deployment',
    subtitle: 'The default workload for stateless services',
    metaRight: '// selector is immutable · template is the engine',
    children: (
      <Grid3x className={styles.body}>
        <Panel>
          <h3>Important spec fields</h3>
          <TightList>
            <li><b>replicas</b> — desired count</li>
            <li><b>selector</b> — immutable; matches template labels</li>
            <li><b>template</b> — Pod spec owned by RS</li>
            <li><b>strategy</b> — RollingUpdate | Recreate</li>
            <li><b>rollingUpdate</b> — maxSurge / maxUnavailable</li>
            <li><b>resources</b> — req drives scheduling, limit caps</li>
            <li><b>probes</b> — readiness gates rollout</li>
            <li><b>topologySpread</b> — spread across zones/nodes</li>
          </TightList>
        </Panel>

        <Panel delay={2} className={styles.codePanel}>
          <CodeSm>
            <K>apiVersion</K>: <S>apps/v1</S>{'\n'}
            <K>kind</K>: <S>Deployment</S>{'\n'}
            <K>metadata</K>: {`{ `}<K>name</K>: <S>web</S>{` }`}{'\n'}
            <K>spec</K>:{'\n'}
            {'  '}<K>replicas</K>: <N>3</N>{'\n'}
            {'  '}<K>selector</K>: {`{ `}<K>matchLabels</K>: {`{ `}<K>app</K>: <S>web</S>{` } }`}{'\n'}
            {'  '}<K>strategy</K>:{'\n'}
            {'    '}<K>type</K>: <S>RollingUpdate</S>{'\n'}
            {'    '}<K>rollingUpdate</K>:{'\n'}
            {'      '}<K>maxSurge</K>: <N>1</N>{'\n'}
            {'      '}<K>maxUnavailable</K>: <N>0</N>{'\n'}
            {'  '}<K>template</K>:{'\n'}
            {'    '}<K>metadata</K>: {`{ `}<K>labels</K>: {`{ `}<K>app</K>: <S>web</S>{` } }`}{'\n'}
            {'    '}<K>spec</K>:{'\n'}
            {'      '}<K>containers</K>:{'\n'}
            {'        '}- <K>name</K>: <S>app</S>{'\n'}
            {'          '}<K>image</K>: <S>ghcr.io/acme/web:1.4.0</S>{'\n'}
            {'          '}<K>resources</K>:{'\n'}
            {'            '}<K>requests</K>: {`{ `}<K>cpu</K>: <S>&quot;100m&quot;</S>, <K>memory</K>: <S>&quot;128Mi&quot;</S>{` }`}{'\n'}
            {'            '}<K>limits</K>:   {`{ `}<K>cpu</K>: <S>&quot;500m&quot;</S>, <K>memory</K>: <S>&quot;256Mi&quot;</S>{` }`}{'\n'}
            {'          '}<K>readinessProbe</K>:{'\n'}
            {'            '}<K>httpGet</K>: {`{ `}<K>path</K>: <S>/healthz</S>, <K>port</K>: <N>8080</N>{` }`}{'\n'}
            {'      '}<K>topologySpreadConstraints</K>:{'\n'}
            {'        '}- <K>maxSkew</K>: <N>1</N>{'\n'}
            {'          '}<K>topologyKey</K>: <S>kubernetes.io/zone</S>{'\n'}
            {'          '}<K>labelSelector</K>: {`{ `}<K>matchLabels</K>: {`{ `}<K>app</K>: <S>web</S>{` } }`}{'\n'}
          </CodeSm>
        </Panel>

        <Panel delay={3}>
          <h3>Operate</h3>
          <Cmd sm>kubectl explain deployment.spec</Cmd>
          <Cmd sm>kubectl get deploy web -o yaml</Cmd>
          <Cmd sm>kubectl scale deploy/web --replicas=5</Cmd>
          <Cmd sm>{`kubectl set image deploy/web \\
  app=ghcr.io/acme/web:1.5.0`}</Cmd>
          <Cmd sm>kubectl edit deploy/web</Cmd>
          <Cmd sm>kubectl rollout status deploy/web</Cmd>
        </Panel>
      </Grid3x>
    ),
  },

  /* ---------- 6 — Deployment Rollout ---------- */
  {
    id: 'rollout',
    n: 6,
    total: TOTAL,
    eyebrow: '05 · rollout',
    title: 'Deployment Rollout',
    subtitle: 'Two ReplicaSets, one traffic-shifting controller',
    metaRight: '// kubectl rollout status / history / undo',
    children: (
      <Grid2>
        <Panel className={styles.grow}>
          <h3>RollingUpdate parameters</h3>
          <div className={styles.kvs}>
            <span className={styles.k}>maxSurge</span>
            <span className={styles.v}>How many pods <i>above</i> replicas you allow during rollout (absolute or %).</span>
            <span className={styles.k}>maxUnavailable</span>
            <span className={styles.v}>How many pods can be <i>unavailable</i> at the same time.</span>
          </div>
          <h3 style={{ marginTop: 18 }}>Rollout lifecycle</h3>
          <Flow>
            <BoxInset>Progressing</BoxInset>
            <Arrow>→</Arrow>
            <BoxInset style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>Healthy</BoxInset>
          </Flow>
          <Small muted style={{ marginTop: 12 }}>
            A rollout is <b>Complete</b> only when all desired pods are Ready and old pods are gone.
          </Small>
        </Panel>

        <Panel delay={2} className={styles.grow}>
          <h3>Architecture</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            <div className={styles.box} style={{ background: 'var(--bg-3)' }}>
              Deployment <span className={styles.muted}>spec.template updated</span>
            </div>
            <DownArrow />
            <Grid2>
              <PanelInset>
                <Tiny muted>old ReplicaSet (v1)</Tiny>
                <BoxInset style={{ marginTop: 8 }}>pod-v1-a</BoxInset>
                <BoxInset style={{ marginTop: 6 }}>pod-v1-b</BoxInset>
                <BoxInset style={{ marginTop: 6, color: 'var(--ink-mute)' }}>pod-v1-c — scaled down</BoxInset>
              </PanelInset>
              <PanelInset>
                <Tiny muted>new ReplicaSet (v2)</Tiny>
                <BoxInset style={{ marginTop: 8, color: 'var(--accent)' }}>pod-v2-a — Ready</BoxInset>
                <BoxInset style={{ marginTop: 6 }}>pod-v2-b — starting</BoxInset>
                <BoxInset style={{ marginTop: 6, color: 'var(--ink-mute)' }}>pod-v2-c — pending</BoxInset>
              </PanelInset>
            </Grid2>
          </div>
        </Panel>
      </Grid2>
    ),
  },

  /* ---------- 7 — Day-2 Operations ---------- */
  {
    id: 'day-2',
    n: 7,
    total: TOTAL,
    eyebrow: '06 · day-2 ops',
    title: 'Deploy · Scale · Rollout · Rollback',
    subtitle: 'The eight commands you will type every day',
    metaRight: '// make these commands muscle memory',
    children: (
      <Grid2>
        <Panel>
          <h3>Apply &amp; observe</h3>
          <Cmd sm>kubectl apply -f deployment.yaml</Cmd>
          <Cmd sm>kubectl get deploy,rs,pods -l app=web</Cmd>
          <Cmd sm>kubectl describe deploy web</Cmd>
          <h3 style={{ marginTop: 14 }}>Scale</h3>
          <Cmd sm>kubectl scale deploy/web --replicas=5</Cmd>
          <h3 style={{ marginTop: 14 }}>Rollout</h3>
          <Cmd sm>{`kubectl set image deploy/web \\
  app=ghcr.io/acme/web:1.5.0`}</Cmd>
          <Cmd sm>kubectl rollout status deploy/web</Cmd>
        </Panel>

        <Panel delay={2}>
          <h3>History &amp; rollback</h3>
          <Cmd sm>kubectl rollout history deploy/web</Cmd>
          <Cmd sm>kubectl rollout undo deploy/web</Cmd>
          <Cmd sm>kubectl rollout undo deploy/web --to-revision=3</Cmd>
          <h3 style={{ marginTop: 14 }}>Debug during rollout</h3>
          <Cmd sm>kubectl get pods -o wide</Cmd>
          <Cmd sm>kubectl logs deploy/web --previous --tail=200</Cmd>
          <Cmd sm>{`kubectl get events \\
  --sort-by=.lastTimestamp`}</Cmd>
          <Small muted style={{ marginTop: 10 }}>
            Every <code>kubectl set image</code>, <code>kubectl edit</code>, or applied manifest change creates a new ReplicaSet — that is your rollback history.
          </Small>
        </Panel>
      </Grid2>
    ),
  },

  /* ---------- 8 — StatefulSet ---------- */
  {
    id: 'statefulset',
    n: 8,
    total: TOTAL,
    eyebrow: '07 · stateful',
    title: 'StatefulSet',
    subtitle: 'Stable identity, stable storage, ordered rollout',
    metaRight: '// DNS: pg-0.pg.default.svc.cluster.local',
    children: (
      <Grid3x className={styles.body}>
        <Panel>
          <h3>Why it exists</h3>
          <TightList>
            <li><b>Stable identity</b> — <code>pg-0</code>, <code>pg-1</code>, <code>pg-2</code></li>
            <li><b>Stable storage</b> — per-pod PVC via <code>volumeClaimTemplates</code></li>
            <li><b>Ordered rollout</b> — up &amp; down in order</li>
            <li><b>Headless Service</b> — DNS A-records per pod</li>
          </TightList>
          <h3 style={{ marginTop: 14 }}>Use for</h3>
          <Small>PostgreSQL · MySQL · MongoDB · Kafka · ZooKeeper · etcd · Elasticsearch · Redis cluster.</Small>
        </Panel>

        <Panel delay={2} className={styles.codePanel}>
          <CodeSm>
            <C># Headless Service for stable DNS</C>{'\n'}
            <K>apiVersion</K>: <S>v1</S>{'\n'}
            <K>kind</K>: <S>Service</S>{'\n'}
            <K>metadata</K>: {`{ `}<K>name</K>: <S>pg</S>{` }`}{'\n'}
            <K>spec</K>:{'\n'}
            {'  '}<K>clusterIP</K>: <S>None</S>{'\n'}
            {'  '}<K>selector</K>: {`{ `}<K>app</K>: <S>pg</S>{` }`}{'\n'}
            {'  '}<K>ports</K>: [{`{ `}<K>port</K>: <N>5432</N>{` }`}]{'\n'}
            ---{'\n'}
            <K>apiVersion</K>: <S>apps/v1</S>{'\n'}
            <K>kind</K>: <S>StatefulSet</S>{'\n'}
            <K>metadata</K>: {`{ `}<K>name</K>: <S>pg</S>{` }`}{'\n'}
            <K>spec</K>:{'\n'}
            {'  '}<K>serviceName</K>: <S>pg</S>{'\n'}
            {'  '}<K>replicas</K>: <N>3</N>{'\n'}
            {'  '}<K>selector</K>: {`{ `}<K>matchLabels</K>: {`{ `}<K>app</K>: <S>pg</S>{` } }`}{'\n'}
            {'  '}<K>template</K>:{'\n'}
            {'    '}<K>metadata</K>: {`{ `}<K>labels</K>: {`{ `}<K>app</K>: <S>pg</S>{` } }`}{'\n'}
            {'    '}<K>spec</K>:{'\n'}
            {'      '}<K>containers</K>:{'\n'}
            {'        '}- <K>name</K>: <S>postgres</S>{'\n'}
            {'          '}<K>image</K>: <S>postgres:16</S>{'\n'}
            {'          '}<K>ports</K>: [{`{ `}<K>containerPort</K>: <N>5432</N>{` }`}]{'\n'}
            {'          '}<K>volumeMounts</K>:{'\n'}
            {'            '}- {`{ `}<K>name</K>: <S>data</S>, <K>mountPath</K>: <S>/var/lib/postgresql/data</S>{` }`}{'\n'}
            {'  '}<K>volumeClaimTemplates</K>:{'\n'}
            {'    '}- <K>metadata</K>: {`{ `}<K>name</K>: <S>data</S>{` }`}{'\n'}
            {'      '}<K>spec</K>:{'\n'}
            {'        '}<K>accessModes</K>: [<S>ReadWriteOnce</S>]{'\n'}
            {'        '}<K>storageClassName</K>: <S>gp3</S>{'\n'}
            {'        '}<K>resources</K>: {`{ `}<K>requests</K>: {`{ `}<K>storage</K>: <S>10Gi</S>{` } }`}{'\n'}
          </CodeSm>
        </Panel>

        <Panel delay={3}>
          <h3>Operate</h3>
          <Cmd sm>kubectl get statefulset pg</Cmd>
          <Cmd sm>kubectl get pods -l app=pg -o wide</Cmd>
          <Cmd sm>kubectl get pvc -l app=pg</Cmd>
          <Cmd sm>kubectl scale sts pg --replicas=5</Cmd>
          <Cmd sm>kubectl rollout status sts/pg</Cmd>
          <Cmd sm>kubectl delete sts pg</Cmd>
          <Small muted style={{ marginTop: 8 }}>
            Pods: <code>pg-0</code> · <code>pg-1</code> · <code>pg-2</code> — and PVCs <code>data-pg-0..2</code>.
          </Small>
        </Panel>
      </Grid3x>
    ),
  },

  /* ---------- 9 — DaemonSet ---------- */
  {
    id: 'daemonset',
    n: 9,
    total: TOTAL,
    eyebrow: '08 · node-level',
    title: 'DaemonSet',
    subtitle: 'One Pod per node — node-level workloads',
    metaRight: '// one Pod per node · survives node drains',
    children: (
      <Grid3x className={styles.body}>
        <Panel>
          <h3>When to use</h3>
          <TightList>
            <li>Log shippers (Fluent Bit, Filebeat)</li>
            <li>Node agents (Datadog, node-exporter)</li>
            <li>Networking (CNI plugins, kube-proxy)</li>
            <li>Storage daemons (ceph, glusterd)</li>
          </TightList>
          <h3 style={{ marginTop: 14 }}>Node selection</h3>
          <Small><b>nodeSelector</b> or <b>nodeAffinity</b> to target GPU / SSD / Linux-only.</Small>
          <h3 style={{ marginTop: 10 }}>Taints &amp; tolerations</h3>
          <Small>DaemonSets tolerate node taints so they can run on every node (including control plane).</Small>
        </Panel>

        <Panel delay={2} className={styles.codePanel}>
          <CodeSm>
            <K>apiVersion</K>: <S>apps/v1</S>{'\n'}
            <K>kind</K>: <S>DaemonSet</S>{'\n'}
            <K>metadata</K>: {`{ `}<K>name</K>: <S>fluentbit</S>{` }`}{'\n'}
            <K>spec</K>:{'\n'}
            {'  '}<K>selector</K>: {`{ `}<K>matchLabels</K>: {`{ `}<K>app</K>: <S>fluentbit</S>{` } }`}{'\n'}
            {'  '}<K>updateStrategy</K>:{'\n'}
            {'    '}<K>type</K>: <S>RollingUpdate</S>{'\n'}
            {'    '}<K>rollingUpdate</K>: {`{ `}<K>maxUnavailable</K>: <N>1</N>{` }`}{'\n'}
            {'  '}<K>template</K>:{'\n'}
            {'    '}<K>metadata</K>: {`{ `}<K>labels</K>: {`{ `}<K>app</K>: <S>fluentbit</S>{` } }`}{'\n'}
            {'    '}<K>spec</K>:{'\n'}
            {'      '}<K>tolerations</K>:{'\n'}
            {'        '}- <K>key</K>: <S>node-role.kubernetes.io/control-plane</S>{'\n'}
            {'          '}<K>operator</K>: <S>Exists</S>{'\n'}
            {'          '}<K>effect</K>: <S>NoSchedule</S>{'\n'}
            {'      '}<K>nodeSelector</K>: {`{ `}<K>kubernetes.io/os</K>: <S>linux</S>{` }`}{'\n'}
            {'      '}<K>containers</K>:{'\n'}
            {'        '}- <K>name</K>: <S>fluentbit</S>{'\n'}
            {'          '}<K>image</K>: <S>fluent/fluent-bit:2.2</S>{'\n'}
            {'          '}<K>resources</K>:{'\n'}
            {'            '}<K>requests</K>: {`{ `}<K>cpu</K>: <S>&quot;50m&quot;</S>, <K>memory</K>: <S>&quot;64Mi&quot;</S>{` }`}{'\n'}
            {'            '}<K>limits</K>:   {`{ `}<K>cpu</K>: <S>&quot;200m&quot;</S>, <K>memory</K>: <S>&quot;128Mi&quot;</S>{` }`}{'\n'}
            {'          '}<K>volumeMounts</K>:{'\n'}
            {'            '}- {`{ `}<K>name</K>: <S>varlog</S>, <K>mountPath</K>: <S>/var/log</S>{` }`}{'\n'}
            {'            '}- {`{ `}<K>name</K>: <S>varlibdockercontainers</S>,{'\n'}
            {'                '}<K>mountPath</K>: <S>/var/lib/docker/containers</S>,{'\n'}
            {'                '}<K>readOnly</K>: <N>true</N>{` }`}{'\n'}
            {'      '}<K>volumes</K>:{'\n'}
            {'        '}- {`{ `}<K>name</K>: <S>varlog</S>, <K>hostPath</K>: {`{ `}<K>path</K>: <S>/var/log</S>{` } }`}{'\n'}
            {'        '}- {`{ `}<K>name</K>: <S>varlibdockercontainers</S>,{'\n'}
            {'            '}<K>hostPath</K>: {`{ `}<K>path</K>: <S>/var/lib/docker/containers</S>{` } }`}{'\n'}
          </CodeSm>
        </Panel>

        <Panel delay={3}>
          <h3>Operate</h3>
          <Cmd sm>kubectl get ds</Cmd>
          <Cmd sm>kubectl get pods -l app=fluentbit -o wide</Cmd>
          <Cmd sm>kubectl rollout status ds/fluentbit</Cmd>
          <Cmd sm>{`kubectl set image ds/fluentbit \\
  fluentbit=fluent/fluent-bit:2.3`}</Cmd>
          <Cmd sm>kubectl logs -l app=fluentbit --tail=100</Cmd>
          <Cmd sm>kubectl delete ds fluentbit</Cmd>
        </Panel>
      </Grid3x>
    ),
  },

  /* ---------- 10 — Job & CronJob ---------- */
  {
    id: 'job-cron',
    n: 10,
    total: TOTAL,
    eyebrow: '09 · batch',
    title: 'Job · CronJob',
    subtitle: 'Run-to-completion and time-scheduled work',
    metaRight: '// Forbid concurrencyPolicy prevents overlap',
    children: (
      <Grid3x className={styles.body}>
        <Panel>
          <h3>Job semantics</h3>
          <TightList>
            <li><b>completions</b> — required successful pods</li>
            <li><b>parallelism</b> — pods allowed at once</li>
            <li><b>backoffLimit</b> — retries before Failed</li>
            <li><b>activeDeadlineSeconds</b> — kill switch</li>
            <li><b>restartPolicy</b> — OnFailure | Never</li>
          </TightList>
          <h3 style={{ marginTop: 14 }}>CronJob adds</h3>
          <TightList>
            <li><b>schedule</b> — 5-field cron</li>
            <li><b>concurrencyPolicy</b> — Allow | Forbid | Replace</li>
            <li><b>historyLimits</b> — keep last N succeeded/failed</li>
          </TightList>
        </Panel>

        <Panel delay={2} className={styles.codePanel}>
          <CodeSm>
            <C># Nightly Postgres backup</C>{'\n'}
            <K>apiVersion</K>: <S>batch/v1</S>{'\n'}
            <K>kind</K>: <S>CronJob</S>{'\n'}
            <K>metadata</K>: {`{ `}<K>name</K>: <S>pg-backup</S>{` }`}{'\n'}
            <K>spec</K>:{'\n'}
            {'  '}<K>schedule</K>: <S>&quot;0 2 * * *&quot;</S>{'\n'}
            {'  '}<K>timeZone</K>: <S>&quot;UTC&quot;</S>{'\n'}
            {'  '}<K>concurrencyPolicy</K>: <S>Forbid</S>{'\n'}
            {'  '}<K>startingDeadlineSeconds</K>: <N>300</N>{'\n'}
            {'  '}<K>successfulJobsHistoryLimit</K>: <N>3</N>{'\n'}
            {'  '}<K>failedJobsHistoryLimit</K>: <N>1</N>{'\n'}
            {'  '}<K>jobTemplate</K>:{'\n'}
            {'    '}<K>spec</K>:{'\n'}
            {'      '}<K>template</K>:{'\n'}
            {'        '}<K>spec</K>:{'\n'}
            {'          '}<K>restartPolicy</K>: <S>OnFailure</S>{'\n'}
            {'          '}<K>containers</K>:{'\n'}
            {'            '}- <K>name</K>: <S>pg-dump</S>{'\n'}
            {'              '}<K>image</K>: <S>postgres:16</S>{'\n'}
            {'              '}<K>command</K>:{'\n'}
            {'                '}- <S>sh</S>{'\n'}
            {'                '}- <S>-c</S>{'\n'}
            {'                '}- <S>{`pg_dump -Fc -d "$DB" \\
                   -f /backup/dump-$(date -u +%Y%m%dT%H%M%SZ).dump`}</S>{'\n'}
            {'              '}<K>envFrom</K>:{'\n'}
            {'                '}- <K>secretRef</K>: {`{ `}<K>name</K>: <S>pg-credentials</S>{` }`}{'\n'}
            {'              '}<K>volumeMounts</K>:{'\n'}
            {'                '}- {`{ `}<K>name</K>: <S>backup</S>, <K>mountPath</K>: <S>/backup</S>{` }`}{'\n'}
            {'          '}<K>volumes</K>:{'\n'}
            {'            '}- <K>name</K>: <S>backup</S>{'\n'}
            {'              '}<K>persistentVolumeClaim</K>: {`{ `}<K>claimName</K>: <S>pg-backup-pvc</S>{` }`}{'\n'}
          </CodeSm>
        </Panel>

        <Panel delay={3}>
          <h3>Operate</h3>
          <Cmd sm>kubectl get cronjobs</Cmd>
          <Cmd sm>kubectl get jobs -A</Cmd>
          <Cmd sm>kubectl create job manual-pg --from=cronjob/pg-backup</Cmd>
          <Cmd sm>kubectl logs job/manual-pg</Cmd>
          <Cmd sm>kubectl delete cronjob pg-backup</Cmd>
          <Cmd sm>kubectl delete job -l job-name=manual-pg</Cmd>
        </Panel>
      </Grid3x>
    ),
  },

  /* ---------- 11 — Services ---------- */
  {
    id: 'services',
    n: 11,
    total: TOTAL,
    eyebrow: '10 · networking',
    title: 'Services & EndpointSlices',
    subtitle: 'Stable virtual IPs for a dynamic set of pods',
    metaRight: '// DNS: web.default.svc.cluster.local',
    children: (
      <Grid3x className={styles.body}>
        <Panel>
          <h3>Service types</h3>
          <Matrix>
            <MatrixHeader>
              <tr><th>Type</th><th>Scope</th></tr>
            </MatrixHeader>
            <MatrixBody>
              <tr><td><b>ClusterIP</b></td><td>Internal VIP. Default.</td></tr>
              <tr><td><b>NodePort</b></td><td>Static port on every node.</td></tr>
              <tr><td><b>LoadBalancer</b></td><td>Cloud LB + NodePort + ClusterIP.</td></tr>
              <tr><td><b>Headless</b></td><td>No VIP, per-pod DNS A-records.</td></tr>
            </MatrixBody>
          </Matrix>
          <Small muted style={{ marginTop: 10 }}>
            Service → <code>EndpointSlices</code> → kube-proxy / CNI → actual routing.
          </Small>
        </Panel>

        <Panel delay={2} className={styles.codePanel}>
          <CodeSm>
            <K>apiVersion</K>: <S>v1</S>{'\n'}
            <K>kind</K>: <S>Service</S>{'\n'}
            <K>metadata</K>:{'\n'}
            {'  '}<K>name</K>: <S>web</S>{'\n'}
            {'  '}<K>labels</K>: {`{ `}<K>app</K>: <S>web</S>{` }`}{'\n'}
            <K>spec</K>:{'\n'}
            {'  '}<K>type</K>: <S>ClusterIP</S>{'\n'}
            {'  '}<K>selector</K>: {`{ `}<K>app</K>: <S>web</S>{` }`}{'\n'}
            {'  '}<K>ports</K>:{'\n'}
            {'    '}- <K>name</K>: <S>http</S>{'\n'}
            {'      '}<K>port</K>: <N>80</N>{'\n'}
            {'      '}<K>targetPort</K>: <N>8080</N>{'\n'}
            {'      '}<K>protocol</K>: <S>TCP</S>{'\n'}
            ---{'\n'}
            <C># Headless Service (StatefulSet)</C>{'\n'}
            <K>apiVersion</K>: <S>v1</S>{'\n'}
            <K>kind</K>: <S>Service</S>{'\n'}
            <K>metadata</K>: {`{ `}<K>name</K>: <S>pg</S>{` }`}{'\n'}
            <K>spec</K>:{'\n'}
            {'  '}<K>clusterIP</K>: <S>None</S>{'\n'}
            {'  '}<K>selector</K>: {`{ `}<K>app</K>: <S>pg</S>{` }`}{'\n'}
            {'  '}<K>ports</K>:{'\n'}
            {'    '}- {`{ `}<K>port</K>: <N>5432</N>, <K>targetPort</K>: <N>5432</N>{` }`}{'\n'}
          </CodeSm>
        </Panel>

        <Panel delay={3}>
          <h3>Operate</h3>
          <Cmd sm>kubectl get svc web</Cmd>
          <Cmd sm>kubectl describe svc web</Cmd>
          <Cmd sm>{`kubectl get endpointslices \\
  -l kubernetes.io/service-name=web`}</Cmd>
          <Cmd sm>{`kubectl get endpointslices \\
  -l kubernetes.io/service-name=web -o yaml`}</Cmd>
          <Cmd sm>kubectl port-forward svc/web 8080:80</Cmd>
          <Cmd sm>kubectl delete svc web</Cmd>
        </Panel>
      </Grid3x>
    ),
  },

  /* ---------- 12 — Ingress & Gateway API ---------- */
  {
    id: 'ingress',
    n: 12,
    total: TOTAL,
    eyebrow: '11 · edge',
    title: 'Ingress & Gateway API',
    subtitle: 'Layer-7 routing into Services',
    metaRight: '// TLS termination at the edge',
    children: (
      <Grid3x className={styles.body}>
        <Panel>
          <h3>Request path</h3>
          <VFlowTight>
            <Box>Client</Box>
            <DownArrow />
            <Box>Cloud Load Balancer</Box>
            <DownArrow />
            <Box>Ingress / Gateway</Box>
            <DownArrow />
            <Box>Service</Box>
            <DownArrow />
            <Box>Pod</Box>
          </VFlowTight>
          <h3 style={{ marginTop: 14 }}>Ingress vs Gateway API</h3>
          <TightList>
            <li><b>Ingress</b> — simple, mature.</li>
            <li><b>Gateway API</b> — role-split, richer protocols.</li>
          </TightList>
        </Panel>

        <Panel delay={2} className={styles.codePanel}>
          <CodeSm>
            <C># Ingress</C>{'\n'}
            <K>apiVersion</K>: <S>networking.k8s.io/v1</S>{'\n'}
            <K>kind</K>: <S>Ingress</S>{'\n'}
            <K>metadata</K>:{'\n'}
            {'  '}<K>name</K>: <S>web</S>{'\n'}
            {'  '}<K>annotations</K>:{'\n'}
            {'    '}<K>nginx.ingress.kubernetes.io/rewrite-target</K>: <S>/</S>{'\n'}
            <K>spec</K>:{'\n'}
            {'  '}<K>ingressClassName</K>: <S>nginx</S>{'\n'}
            {'  '}<K>tls</K>:{'\n'}
            {'    '}- <K>hosts</K>: [<S>app.example.com</S>]{'\n'}
            {'      '}<K>secretName</K>: <S>app-tls</S>{'\n'}
            {'  '}<K>rules</K>:{'\n'}
            {'    '}- <K>host</K>: <S>app.example.com</S>{'\n'}
            {'      '}<K>http</K>:{'\n'}
            {'        '}<K>paths</K>:{'\n'}
            {'          '}- <K>path</K>: <S>/</S>{'\n'}
            {'            '}<K>pathType</K>: <S>Prefix</S>{'\n'}
            {'            '}<K>backend</K>:{'\n'}
            {'              '}<K>service</K>:{'\n'}
            {'                '}<K>name</K>: <S>web</S>{'\n'}
            {'                '}<K>port</K>: {`{ `}<K>number</K>: <N>80</N>{` }`}{'\n'}
          </CodeSm>
        </Panel>

        <Panel delay={3}>
          <h3>Operate</h3>
          <Cmd sm>kubectl get ingress</Cmd>
          <Cmd sm>kubectl describe ingress web</Cmd>
          <Cmd sm>kubectl get ing -A</Cmd>
          <Cmd sm>kubectl get gateway -A</Cmd>
          <Cmd sm>kubectl get httproute -A</Cmd>
          <Cmd sm>kubectl delete ingress web</Cmd>
        </Panel>
      </Grid3x>
    ),
  },

  /* ---------- 13 — ConfigMap & Secret ---------- */
  {
    id: 'config',
    n: 13,
    total: TOTAL,
    eyebrow: '12 · config',
    title: 'ConfigMap & Secret',
    subtitle: 'Decouple configuration from image',
    metaRight: '// decouple config from image',
    children: (
      <Grid3x className={styles.body}>
        <Panel>
          <h3>Three consumption patterns</h3>
          <TightList>
            <li><b>env</b> — single key → single var</li>
            <li><b>envFrom</b> — all keys → vars</li>
            <li><b>volumeMount</b> — keys → files</li>
          </TightList>
          <h3 style={{ marginTop: 14 }}>Secret rules</h3>
          <TightList>
            <li>Base64 ≠ encryption. Enable EncryptionConfiguration.</li>
            <li>Files for changing values; env for simple ones.</li>
            <li>Pair with External Secrets Operator in prod.</li>
          </TightList>
        </Panel>

        <Panel delay={2} className={styles.codePanel}>
          <CodeSm>
            <K>apiVersion</K>: <S>v1</S>{'\n'}
            <K>kind</K>: <S>ConfigMap</S>{'\n'}
            <K>metadata</K>: {`{ `}<K>name</K>: <S>web-config</S>{` }`}{'\n'}
            <K>data</K>:{'\n'}
            {'  '}<K>LOG_LEVEL</K>: <S>info</S>{'\n'}
            {'  '}<K>FEATURE_FLAG_NEW_UI</K>: <S>&quot;true&quot;</S>{'\n'}
            ---{'\n'}
            <K>apiVersion</K>: <S>v1</S>{'\n'}
            <K>kind</K>: <S>Secret</S>{'\n'}
            <K>metadata</K>: {`{ `}<K>name</K>: <S>db-credentials</S>{` }`}{'\n'}
            <K>type</K>: <S>Opaque</S>{'\n'}
            <K>stringData</K>:{'\n'}
            {'  '}<K>DB_PASSWORD</K>: <S>correct-horse-battery-staple</S>{'\n'}
            ---{'\n'}
            <C># Pod consumes both</C>{'\n'}
            <K>apiVersion</K>: <S>v1</S>{'\n'}
            <K>kind</K>: <S>Pod</S>{'\n'}
            <K>metadata</K>:{'\n'}
            {'  '}<K>name</K>: <S>web</S>{'\n'}
            {'  '}<K>labels</K>: {`{ `}<K>app</K>: <S>web</S>{` }`}{'\n'}
            <K>spec</K>:{'\n'}
            {'  '}<K>containers</K>:{'\n'}
            {'    '}- <K>name</K>: <S>app</S>{'\n'}
            {'      '}<K>image</K>: <S>ghcr.io/acme/web:1.4.0</S>{'\n'}
            {'      '}<K>env</K>:{'\n'}
            {'        '}- <K>name</K>: <S>DB_HOST</S>{'\n'}
            {'          '}<K>value</K>: <S>pg-0.pg.default.svc.cluster.local</S>{'\n'}
            {'      '}<K>envFrom</K>:{'\n'}
            {'        '}- <K>configMapRef</K>: {`{ `}<K>name</K>: <S>web-config</S>{` }`}{'\n'}
            {'        '}- <K>secretRef</K>:    {`{ `}<K>name</K>: <S>db-credentials</S>{` }`}{'\n'}
            {'      '}<K>volumeMounts</K>:{'\n'}
            {'        '}- {`{ `}<K>name</K>: <S>cfg</S>, <K>mountPath</K>: <S>/etc/app</S>{` }`}{'\n'}
            {'  '}<K>volumes</K>:{'\n'}
            {'    '}- <K>name</K>: <S>cfg</S>{'\n'}
            {'      '}<K>configMap</K>: {`{ `}<K>name</K>: <S>web-config</S>{` }`}{'\n'}
          </CodeSm>
        </Panel>

        <Panel delay={3}>
          <h3>Operate</h3>
          <Cmd sm>{`kubectl create cm web-config \\
  --from-file=app.yml`}</Cmd>
          <Cmd sm>{`kubectl create secret generic db-credentials \\
  --from-literal=DB_PASSWORD=...`}</Cmd>
          <Cmd sm>kubectl get cm</Cmd>
          <Cmd sm>kubectl get secrets</Cmd>
          <Cmd sm>kubectl describe secret db-credentials</Cmd>
          <Cmd sm>kubectl delete secret db-credentials</Cmd>
        </Panel>
      </Grid3x>
    ),
  },

  /* ---------- 14 — Persistent Storage ---------- */
  {
    id: 'storage',
    n: 14,
    total: TOTAL,
    eyebrow: '13 · storage',
    title: 'Persistent Storage',
    subtitle: 'PVC · PV · StorageClass · CSI',
    metaRight: '// WaitForFirstConsumer binds in the right zone',
    children: (
      <Grid3x className={styles.body}>
        <Panel>
          <h3>Provisioning flow</h3>
          <VFlowTight>
            <Box>Pod</Box>
            <DownArrow />
            <Box>PVC <span className={styles.muted}>(claim)</span></Box>
            <DownArrow />
            <Box>StorageClass</Box>
            <DownArrow />
            <Box>CSI Driver</Box>
            <DownArrow />
            <Box>PV → Backend</Box>
          </VFlowTight>
          <h3 style={{ marginTop: 12 }}>Dynamic vs Static</h3>
          <Small><b>Dynamic</b>: StorageClass auto-provisions. <b>Static</b>: pre-created PVs.</Small>
        </Panel>

        <Panel delay={2} className={styles.codePanel}>
          <CodeSm>
            <K>apiVersion</K>: <S>storage.k8s.io/v1</S>{'\n'}
            <K>kind</K>: <S>StorageClass</S>{'\n'}
            <K>metadata</K>: {`{ `}<K>name</K>: <S>gp3</S>{` }`}{'\n'}
            <K>provisioner</K>: <S>ebs.csi.aws.com</S>{'\n'}
            <K>parameters</K>:{'\n'}
            {'  '}<K>type</K>: <S>gp3</S>{'\n'}
            {'  '}<K>fsType</K>: <S>ext4</S>{'\n'}
            <K>volumeBindingMode</K>: <S>WaitForFirstConsumer</S>{'\n'}
            ---{'\n'}
            <K>apiVersion</K>: <S>v1</S>{'\n'}
            <K>kind</K>: <S>PersistentVolumeClaim</S>{'\n'}
            <K>metadata</K>: {`{ `}<K>name</K>: <S>data</S>{` }`}{'\n'}
            <K>spec</K>:{'\n'}
            {'  '}<K>accessModes</K>: [<S>ReadWriteOnce</S>]{'\n'}
            {'  '}<K>storageClassName</K>: <S>gp3</S>{'\n'}
            {'  '}<K>resources</K>:{'\n'}
            {'    '}<K>requests</K>: {`{ `}<K>storage</K>: <S>10Gi</S>{` }`}{'\n'}
          </CodeSm>
        </Panel>

        <Panel delay={3}>
          <h3>Operate</h3>
          <Cmd sm>kubectl get sc</Cmd>
          <Cmd sm>kubectl get pvc</Cmd>
          <Cmd sm>kubectl describe pvc data</Cmd>
          <Cmd sm>kubectl get pv</Cmd>
          <Cmd sm>kubectl delete pvc data</Cmd>
        </Panel>
      </Grid3x>
    ),
  },

  /* ---------- 15 — Production Bundle ---------- */
  {
    id: 'bundle',
    n: 15,
    total: TOTAL,
    eyebrow: '14 · production',
    title: 'Production Workload Bundle',
    subtitle: 'Nine resources that travel together',
    metaRight: '// apply them as a single manifest or kustomization',
    children: (
      <Grid3>
        <Panel><div className={styles.box} style={{ width: '100%' }}>Deployment</div><Small muted>Stateless pods + rolling strategy</Small></Panel>
        <Panel delay={2}><div className={styles.box} style={{ width: '100%' }}>Service</div><Small muted>ClusterIP + selector + ports</Small></Panel>
        <Panel delay={2}><div className={styles.box} style={{ width: '100%' }}>ConfigMap</div><Small muted>Non-sensitive config</Small></Panel>
        <Panel delay={3}><div className={styles.box} style={{ width: '100%' }}>Secret</div><Small muted>Credentials + tokens</Small></Panel>
        <Panel delay={2}><div className={styles.box} style={{ width: '100%' }}>PVC</div><Small muted>Persistent volume</Small></Panel>
        <Panel delay={3}><div className={styles.box} style={{ width: '100%' }}>ServiceAccount</div><Small muted>Identity for the API</Small></Panel>
        <Panel delay={2}><div className={styles.box} style={{ width: '100%' }}>NetworkPolicy</div><Small muted>Allow/deny pod-to-pod traffic</Small></Panel>
        <Panel delay={3}><div className={styles.box} style={{ width: '100%' }}>HPA</div><Small muted>CPU/memory/custom scaling</Small></Panel>
        <Panel delay={2}><div className={styles.box} style={{ width: '100%' }}>PDB</div><Small muted>Minimum pod count during disruptions</Small></Panel>
      </Grid3>
    ),
  },

  /* ---------- 16 — Scaling & Availability ---------- */
  {
    id: 'scaling',
    n: 16,
    total: TOTAL,
    eyebrow: '15 · resilience',
    title: 'Scaling & Availability',
    subtitle: 'Survive nodes, zones, and traffic spikes',
    metaRight: '// capacity = pods × per-pod requests',
    children: (
      <Grid2>
        <Panel className={styles.grow}>
          <h3>The six levers</h3>
          <TightList>
            <li><b>requests/limits</b> — drive scheduling and prevent noisy neighbors</li>
            <li><b>HPA</b> — scale replicas on CPU/memory/custom metrics</li>
            <li><b>PDB</b> — guarantee N pods during voluntary disruptions</li>
            <li><b>topologySpreadConstraints</b> — even spread across zones/nodes</li>
            <li><b>affinity</b> — co-locate or separate pods deliberately</li>
            <li><b>Cluster Autoscaler / Karpenter</b> — scale nodes when pods don't fit</li>
          </TightList>
        </Panel>

        <div className={`${styles.reveal} ${styles.delay2 ?? ''} ${styles.grow}`}>
          <Code>
            <C># HorizontalPodAutoscaler</C>{'\n'}
            <K>apiVersion</K>: <S>autoscaling/v2</S>{'\n'}
            <K>kind</K>: <S>HorizontalPodAutoscaler</S>{'\n'}
            <K>metadata</K>: {`{ `}<K>name</K>: <S>web</S>{` }`}{'\n'}
            <K>spec</K>:{'\n'}
            {'  '}<K>scaleTargetRef</K>:{'\n'}
            {'    '}<K>apiVersion</K>: <S>apps/v1</S>{'\n'}
            {'    '}<K>kind</K>: <S>Deployment</S>{'\n'}
            {'    '}<K>name</K>: <S>web</S>{'\n'}
            {'  '}<K>minReplicas</K>: <N>3</N>{'\n'}
            {'  '}<K>maxReplicas</K>: <N>20</N>{'\n'}
            {'  '}<K>metrics</K>:{'\n'}
            {'    '}- <K>type</K>: <S>Resource</S>{'\n'}
            {'      '}<K>resource</K>:{'\n'}
            {'        '}<K>name</K>: <S>cpu</S>{'\n'}
            {'        '}<K>target</K>: {`{ `}<K>type</K>: <S>Utilization</S>, <K>averageUtilization</K>: <N>70</N>{` }`}{'\n'}
            ---{'\n'}
            <C># PodDisruptionBudget</C>{'\n'}
            <K>apiVersion</K>: <S>policy/v1</S>{'\n'}
            <K>kind</K>: <S>PodDisruptionBudget</S>{'\n'}
            <K>metadata</K>: {`{ `}<K>name</K>: <S>web</S>{` }`}{'\n'}
            <K>spec</K>:{'\n'}
            {'  '}<K>minAvailable</K>: <N>2</N>{'\n'}
            {'  '}<K>selector</K>: {`{ `}<K>matchLabels</K>: {`{ `}<K>app</K>: <S>web</S>{` } }`}{'\n'}
          </Code>
          <Cmd style={{ marginTop: 12 }}>kubectl get hpa</Cmd>
          <Cmd>kubectl get pdb</Cmd>
        </div>
      </Grid2>
    ),
  },

  /* ---------- 17 — Production Debugging ---------- */
  {
    id: 'debug',
    n: 17,
    total: TOTAL,
    eyebrow: '16 · incident',
    title: 'Production Debugging',
    subtitle: 'Decision tree from symptom to kubectl command',
    metaRight: '// describe first, then logs, then exec',
    children: (
      <Grid2>
        <Panel className={`${styles.grow} ${styles.scroll} ${styles.tree}`}>
          <h3>Symptom → command</h3>
          <div>
            <span className={styles.node}>Pod stuck in <b>Pending</b></span>
            <div className={styles.branch}>
              <CmdInline>kubectl describe pod &lt;name&gt;</CmdInline> → check Events: scheduling, resources, PVC, node taints
            </div>
          </div>
          <div>
            <span className={`${styles.node} ${styles.bad}`}>CrashLoopBackOff</span>
            <div className={styles.branch}>
              <CmdInline>kubectl logs &lt;pod&gt; --previous</CmdInline> · <CmdInline>kubectl describe pod</CmdInline>
            </div>
          </div>
          <div>
            <span className={`${styles.node} ${styles.bad}`}>ImagePullBackOff / ErrImagePull</span>
            <div className={styles.branch}>
              <CmdInline>kubectl describe pod</CmdInline> · check registry creds · imagePullSecrets · tag typo
            </div>
          </div>
          <div>
            <span className={`${styles.node} ${styles.bad}`}>OOMKilled</span>
            <div className={styles.branch}>
              <CmdInline>{`kubectl get pod -o jsonpath='{.status.containerStatuses[*].state}'`}</CmdInline> · raise memory limit · profile heap
            </div>
          </div>
          <div>
            <span className={styles.node}>Pod <b>NotReady</b></span>
            <div className={styles.branch}>
              readinessProbe failing · <CmdInline>kubectl describe endpointslices</CmdInline> · <CmdInline>kubectl port-forward</CmdInline> and curl
            </div>
          </div>
          <div>
            <span className={styles.node}>Service has no endpoints</span>
            <div className={styles.branch}>
              <CmdInline>kubectl get endpointslices -l kubernetes.io/service-name=&lt;svc&gt;</CmdInline> · fix selector / pod labels
            </div>
          </div>
          <div>
            <span className={`${styles.node} ${styles.bad}`}>PVC Pending</span>
            <div className={styles.branch}>
              <CmdInline>kubectl describe pvc</CmdInline> · StorageClass exists? · zone mismatch (use WaitForFirstConsumer)
            </div>
          </div>
          <div>
            <span className={`${styles.node} ${styles.bad}`}>Ingress 404 / 502 / 503</span>
            <div className={styles.branch}>
              <CmdInline>kubectl describe ingress</CmdInline> · check backend service exists · check pod readiness · check upstream logs
            </div>
          </div>
        </Panel>

        <Panel delay={2} className={`${styles.grow} ${styles.scroll}`}>
          <h3>The universal triage</h3>
          <Cmd>kubectl get all -A</Cmd>
          <Cmd>{`kubectl get events -A --sort-by=.lastTimestamp \\
  | tail -50`}</Cmd>
          <Cmd>kubectl top nodes &amp;&amp; kubectl top pods -A</Cmd>
          <h3 style={{ marginTop: 14 }}>Useful one-liners</h3>
          <Cmd>kubectl get pod &lt;name&gt; -o yaml | less</Cmd>
          <Cmd>kubectl logs -l app=web --tail=200 --since=10m</Cmd>
          <Cmd>kubectl exec -it &lt;pod&gt; -- sh</Cmd>
          <Cmd>kubectl port-forward svc/web 8080:80</Cmd>
          <div className={styles.cmdWrap}>
            <Cmd>{`kubectl get endpointslices \\
  -l kubernetes.io/service-name=web -o yaml`}</Cmd>
          </div>
          <Small muted style={{ marginTop: 10 }}>
            Tip: <code>--previous</code> is the most underused flag in production debugging.
          </Small>
        </Panel>
      </Grid2>
    ),
  },

  /* ---------- 18 — Controller Pattern (focal moment) ---------- */
  {
    id: 'controller-pattern',
    n: 18,
    total: TOTAL,
    eyebrow: '17 · the mental model',
    title: 'Kubernetes Controller Pattern',
    subtitle: 'Observe · Compare · Reconcile · Repeat',
    metaRight: '// the heartbeat of Kubernetes',
    children: (
      <ZoomStage className={styles.body}>
        <Grid2 style={{ height: '100%' }}>
          <Panel style={{ height: '100%' }}>
            <h3>The reconcile loop</h3>
            <VFlow>
              <Box>Desired State <span className={styles.muted}>— what the spec says</span></Box>
              <DownArrow />
              <Box>Observe <span className={styles.muted}>— watch cluster state</span></Box>
              <DownArrow />
              <Box>Compare <span className={styles.muted}>— diff desired vs actual</span></Box>
              <DownArrow />
              <VBox accent>Reconcile <span className={styles.muted}>— drive actual toward desired</span></VBox>
              <DownArrow />
              <Box>Update <span className={styles.muted}>— write back to API</span></Box>
              <DownArrow />
              <Box>Repeat</Box>
            </VFlow>
          </Panel>

          <Panel delay={2} style={{ height: '100%' }}>
            <h3>Why this matters</h3>
            <TightList>
              <li>Controllers are <b>level-triggered</b>, not edge-triggered — state, not events, is the source of truth.</li>
              <li>Every Kubernetes component follows this pattern: Deployment, ReplicaSet, StatefulSet, DaemonSet, Job, CronJob, Garbage Collector, Service controller.</li>
              <li>Operators extend Kubernetes by writing their own controllers (CRDs + reconcile loops).</li>
              <li>Idempotency is the contract: calling reconcile N times has the same effect as calling it once.</li>
            </TightList>
            <h3 style={{ marginTop: 14 }}>The promise</h3>
            <Small muted>&quot;If I keep my desired state correct, the system will continuously close the gap to it.&quot;</Small>
          </Panel>
        </Grid2>
      </ZoomStage>
    ),
  },

  /* ---------- 19 — Native Controller Architecture ---------- */
  {
    id: 'controller-arch',
    n: 19,
    total: TOTAL,
    eyebrow: '18 · internals',
    title: 'Native Controller Architecture',
    subtitle: 'How a controller sees and acts on the cluster',
    metaRight: '// client-go · controller-runtime · kubebuilder',
    children: (
      <Grid2>
        <Panel className={styles.grow}>
          <h3>The data path</h3>
          <VFlow>
            <Box>API Server</Box>
            <DownArrow />
            <Box>Watch / Informer <span className={styles.muted}>— local cache + event stream</span></Box>
            <DownArrow />
            <Box>Work Queue <span className={styles.muted}>— deduped, rate-limited keys</span></Box>
            <DownArrow />
            <VBox accent>Controller Worker <span className={styles.muted}>— your reconcile() function</span></VBox>
            <DownArrow />
            <Box>API Server <span className={styles.muted}>— patch / create / update back</span></Box>
          </VFlow>
          <h3 style={{ marginTop: 14 }}>Built-in controllers</h3>
          <TightList>
            <li>Deployment controller · ReplicaSet controller</li>
            <li>StatefulSet controller · DaemonSet controller</li>
            <li>Job controller · CronJob controller · Garbage collector</li>
            <li>Service controller · EndpointSlice controller · Node controller</li>
          </TightList>
        </Panel>

        <Panel delay={2} className={styles.grow}>
          <h3>Anatomy of reconcile()</h3>
          <Code>
            <C># Pseudocode — every controller looks like this</C>{'\n'}
            <K>func</K> Reconcile(ctx, key) {'{'}{'\n'}
            {'  '}obj := informer.Get(key)         <C># 1. read current state</C>{'\n'}
            {'  '}desired := buildDesired(obj)     <C># 2. compute desired state</C>{'\n'}
            {'  '}diff := diff(desired, obj)       <C># 3. compare</C>{'\n'}
            {'  '}<K>if</K> diff == empty {'{'}{'\n'}
            {'    '}<K>return</K> Done                  <C># 4. nothing to do</C>{'\n'}
            {'  '}{'}'}{'\n'}
            {'  '}err := apply(ctx, diff)          <C># 5. mutate cluster</C>{'\n'}
            {'  '}<K>if</K> err {'{'}{'\n'}
            {'    '}enqueue(key, retry)            <C># 6. retry with backoff</C>{'\n'}
            {'  '}{'}'}{'\n'}
            {'  '}requeueAfter(time.Minute)        <C># 7. periodic safety re-sync</C>{'\n'}
            {'}'}{'\n'}
          </Code>
          <h3 style={{ marginTop: 14 }}>Why operators exist</h3>
          <Small>
            A CRD declares a new kind. A controller implements <code>Reconcile()</code> for it. That is the entire extension model of Kubernetes — Helm is a package, an Operator is a controller.
          </Small>
        </Panel>
      </Grid2>
    ),
  },

  /* ---------- 20 — End-to-End Lifecycle ---------- */
  {
    id: 'lifecycle',
    n: 20,
    total: TOTAL,
    eyebrow: '19 · end-to-end',
    title: 'Complete End-to-End Lifecycle',
    subtitle: 'From <code>kubectl apply</code> to client traffic',
    metaRight: '// every box above is a reconciler or a runtime',
    children: (
      <Panel className={styles.grow}>
        <VFlowTight>
          <Box>kubectl apply -f deployment.yaml</Box>
          <DownArrow />
          <Box>API Server <span className={styles.muted}>— authenticates · authorizes · mutating admission · validating admission</span></Box>
          <DownArrow />
          <Box>etcd <span className={styles.muted}>— durable, versioned storage</span></Box>
          <DownArrow />
          <Box>Deployment Controller <span className={styles.muted}>— creates ReplicaSet</span></Box>
          <DownArrow />
          <Box>ReplicaSet Controller <span className={styles.muted}>— creates Pod objects</span></Box>
          <DownArrow />
          <Box>Scheduler <span className={styles.muted}>— binds pod to a node</span></Box>
          <DownArrow />
          <Box>Kubelet <span className={styles.muted}>— pulls image via CRI</span></Box>
          <DownArrow />
          <Box>Container Runtime <span className={styles.muted}>— starts containers</span></Box>
          <DownArrow />
          <Box>CNI <span className={styles.muted}>— attaches pod network</span></Box>
          <DownArrow />
          <Box>Service &amp; EndpointSlice <span className={styles.muted}>— kube-proxy wires backends</span></Box>
          <DownArrow />
          <VBox accent>Client Traffic <span className={styles.muted} style={{ color: 'var(--ink-soft)' }}>— requests reach the pod</span></VBox>
        </VFlowTight>
      </Panel>
    ),
  },

  /* ---------- 21 — Cheat Sheet ---------- */
  {
    id: 'cheat-sheet',
    n: 21,
    total: TOTAL,
    eyebrow: '20 · reference',
    title: 'Production Cheat Sheet',
    subtitle: 'Selection matrix · kubectl · debug flow',
    metaRight: '// print · laminate · carry',
    children: (
      <Grid2>
        <Panel className={styles.grow}>
          <h3>Workload selection matrix</h3>
          <Matrix>
            <MatrixHeader>
              <tr><th>Need</th><th>Pick</th></tr>
            </MatrixHeader>
            <MatrixBody>
              <tr><td>Stateless web/API</td><td><b>Deployment</b></td></tr>
              <tr><td>Stateful DB / queue / cluster</td><td><b>StatefulSet</b> + Headless Service</td></tr>
              <tr><td>Node-level agent</td><td><b>DaemonSet</b></td></tr>
              <tr><td>One-shot batch</td><td><b>Job</b></td></tr>
              <tr><td>Scheduled batch</td><td><b>CronJob</b></td></tr>
              <tr><td>Background one-shot per node</td><td><b>Job</b> with DaemonSet-like placement</td></tr>
              <tr><td>Domain-specific automation</td><td><b>Custom Resource + Operator</b></td></tr>
            </MatrixBody>
          </Matrix>
        </Panel>

        <Panel delay={2} className={styles.grow}>
          <h3>Most useful kubectl commands</h3>
          <Cmd>kubectl get pods -A -o wide</Cmd>
          <Cmd>kubectl describe deploy/web</Cmd>
          <Cmd>kubectl logs -l app=web --tail=200 --previous</Cmd>
          <Cmd>kubectl rollout status deploy/web</Cmd>
          <Cmd>kubectl rollout undo deploy/web --to-revision=3</Cmd>
          <Cmd>kubectl scale deploy/web --replicas=5</Cmd>
          <Cmd>kubectl get events -A --sort-by=.lastTimestamp</Cmd>
          <Cmd>kubectl get endpointslices,ing,pvc,hpa,pdb</Cmd>
          <Cmd>kubectl port-forward svc/web 8080:80</Cmd>
          <h3 style={{ marginTop: 14 }}>Debug flow</h3>
          <Small muted>describe → events → logs (with --previous) → exec → port-forward → escalate.</Small>
        </Panel>
      </Grid2>
    ),
  },

  /* ---------- 22 — Close ---------- */
  {
    id: 'close',
    n: 22,
    total: TOTAL,
    eyebrow: '// close',
    title: 'The Heartbeat of Kubernetes',
    subtitle: 'One idea to remember everything',
    metaRight: '// end of transmission',
    children: (
      <Panel className={styles.grow}>
        <div className={styles.flow} style={{ flexDirection: 'column', gap: 6, alignItems: 'stretch', width: '55%', alignSelf: 'center' }}>
          <Box>Application intent</Box>
          <DownArrow />
          <Box>Kubernetes API</Box>
          <DownArrow />
          <Box>Desired State</Box>
          <DownArrow />
          <VBox accent>Controller</VBox>
          <DownArrow />
          <Box>Reconciliation</Box>
          <DownArrow />
          <Box>Pod</Box>
          <DownArrow />
          <Box>Runtime</Box>
          <DownArrow />
          <Box>Network / Storage</Box>
          <DownArrow />
          <BoxInset>Actual State → fed back into the loop</BoxInset>
        </div>
        <p style={{ fontSize: 20, color: 'var(--ink)', marginTop: 24, maxWidth: 760, textAlign: 'center', letterSpacing: '-0.01em' }}>
          &quot;Controllers continuously close the gap between Desired State and Actual State.&quot;
        </p>
        <Small muted style={{ marginTop: 8 }}>That single sentence is the entire operating model of Kubernetes.</Small>
      </Panel>
    ),
  },
];

export { slides };
