import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@depo-ui/react/css';
import {
  Badge,
  Button,
  Card,
  SearchField,
  Stat,
  Table,
  foundationAttributes,
} from '@depo-ui/react';
import './styles.css';

const startedAt = performance.now();

const services = Array.from({ length: 120 }, (_, index) => {
  const status = index % 17 === 0 ? 'Degraded' : index % 29 === 0 ? 'Investigating' : 'Healthy';
  const region = ['Tokyo', 'Singapore', 'Frankfurt', 'Virginia'][index % 4];
  const latency = 34 + ((index * 17) % 182);
  const errorRate = ((index * 7) % 19) / 10;
  return {
    name: `service-${String(index + 1).padStart(3, '0')}`,
    status,
    region,
    latency,
    errorRate,
  };
});

function PerformanceReadout() {
  const [metrics, setMetrics] = useState({ mount: 0, nodes: 0 });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMetrics({
        mount: performance.now() - startedAt,
        nodes: document.querySelectorAll('*').length,
      });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="perf-readout" aria-label="Render diagnostics">
      <Badge tone="success">interactive</Badge>
      <span>{metrics.mount.toFixed(1)} ms mount</span>
      <span>{metrics.nodes} DOM nodes</span>
    </div>
  );
}

function App() {
  const rows = useMemo(
    () =>
      services.map((service) => [
        service.name,
        <Badge
          key={`${service.name}-status`}
          tone={service.status === 'Healthy' ? 'success' : service.status === 'Degraded' ? 'warning' : 'danger'}
        >
          {service.status}
        </Badge>,
        service.region,
        `${service.latency} ms`,
        `${service.errorRate.toFixed(1)}%`,
      ]),
    [],
  );

  return (
    <div
      {...foundationAttributes({ theme: 'dark', density: 'compact', direction: 'ltr' })}
      className="ops-app"
    >
      <aside className="ops-sidebar">
        <div className="brand-lockup">
          <span className="brand-mark">D</span>
          <div>
            <strong>Pulse Ops</strong>
            <span>Depo UI stress lab</span>
          </div>
        </div>
        <nav className="ops-nav" aria-label="Operations navigation">
          {['Overview', 'Services', 'Deployments', 'Incidents', 'Audit log'].map((item, index) => (
            <Button key={item} variant={index === 0 ? 'soft' : 'ghost'} tone={index === 0 ? 'primary' : 'neutral'}>
              {item}
            </Button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Badge tone="success">All systems sampled</Badge>
          <span>120 services · compact density</span>
        </div>
      </aside>

      <main className="ops-main">
        <header className="ops-header">
          <div>
            <p className="eyebrow">Production overview</p>
            <h1>Global operations</h1>
          </div>
          <div className="header-actions">
            <SearchField aria-label="Search services" placeholder="Search services" />
            <Button variant="outline">Export</Button>
            <Button tone="primary">New deployment</Button>
          </div>
        </header>

        <PerformanceReadout />

        <section className="metric-grid" aria-label="Key metrics">
          <Card><Stat label="Requests / min" value="2.84M" change="+8.4%" /></Card>
          <Card><Stat label="p95 latency" value="148 ms" change="-12 ms" /></Card>
          <Card><Stat label="Error rate" value="0.42%" change="-0.08%" /></Card>
          <Card><Stat label="Active incidents" value="3" change="2 need review" /></Card>
        </section>

        <section className="ops-grid">
          <Card className="table-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Live inventory</p>
                <h2>Service health</h2>
              </div>
              <Badge tone="secondary">120 rows</Badge>
            </div>
            <div className="table-scroll">
              <Table
                caption="Service health inventory"
                headers={['Service', 'Status', 'Region', 'p95 latency', 'Error rate']}
                rows={rows}
              />
            </div>
          </Card>

          <div className="ops-rail">
            <Card>
              <p className="eyebrow">Incidents</p>
              <h2>Needs attention</h2>
              <div className="incident-list">
                {[
                  ['Checkout API', 'Elevated latency', 'warning'],
                  ['Media worker', 'Queue saturation', 'danger'],
                  ['Search index', 'Replica lag', 'warning'],
                ].map(([name, detail, tone]) => (
                  <div className="incident" key={name}>
                    <div><strong>{name}</strong><span>{detail}</span></div>
                    <Badge tone={tone as 'warning' | 'danger'}>{tone}</Badge>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <p className="eyebrow">Deployment queue</p>
              <h2>Next 30 minutes</h2>
              <div className="queue-list">
                {['billing-web · v7.12.0', 'auth-edge · v4.8.2', 'events-api · v12.2.1'].map((item, index) => (
                  <div className="queue-item" key={item}>
                    <span>{item}</span>
                    <Badge tone={index === 0 ? 'primary' : 'neutral'}>{index === 0 ? 'Running' : 'Queued'}</Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="full-width">Open deployment queue</Button>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
