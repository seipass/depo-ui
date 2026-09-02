import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@depo-ui/react/css';
import {
  Badge,
  Button,
  Card,
  Field,
  SearchField,
  Stat,
  TextInput,
  foundationAttributes,
} from '@depo-ui/react';
import './styles.css';

const startedAt = performance.now();
const projects = [
  ['Mobile checkout', 'On track', 'success', '12 tasks'],
  ['Identity refresh', 'At risk', 'warning', '8 tasks'],
  ['Analytics v3', 'On track', 'success', '21 tasks'],
  ['Help center IA', 'Review', 'secondary', '6 tasks'],
  ['Billing migration', 'Blocked', 'danger', '17 tasks'],
  ['Partner portal', 'On track', 'success', '14 tasks'],
  ['Data export', 'Review', 'secondary', '9 tasks'],
  ['Design tokens', 'On track', 'success', '11 tasks'],
];

function PerformanceReadout() {
  const [text, setText] = useState('measuring…');
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setText(`${(performance.now() - startedAt).toFixed(1)} ms mount · ${document.querySelectorAll('*').length} nodes`);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return <span className="shell-performance">{text}</span>;
}

function App() {
  return (
    <div
      {...foundationAttributes({ theme: 'light', density: 'comfortable', direction: 'ltr' })}
      className="workspace-app"
    >
      <aside className="workspace-sidebar">
        <div className="workspace-brand"><span>N</span><strong>Northstar</strong></div>
        <nav aria-label="Workspace navigation">
          {['Home', 'Projects', 'Calendar', 'Reports', 'People', 'Settings'].map((item, index) => (
            <Button key={item} variant={index === 1 ? 'soft' : 'ghost'} tone={index === 1 ? 'primary' : 'neutral'}>{item}</Button>
          ))}
        </nav>
        <Card className="upgrade-card">
          <Badge tone="primary">Team plan</Badge>
          <strong>18 of 25 seats used</strong>
          <span>Invite collaborators while there is room.</span>
          <Button size="sm" variant="outline">Manage seats</Button>
        </Card>
      </aside>

      <main className="workspace-main">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">Acme Studio</p>
            <h1>Projects</h1>
          </div>
          <div className="workspace-actions">
            <SearchField aria-label="Search projects" placeholder="Search projects" />
            <Button variant="outline">Invite</Button>
            <Button tone="primary">New project</Button>
          </div>
        </header>

        <div className="workspace-meta">
          <div><Badge tone="success">Synced</Badge><PerformanceReadout /></div>
          <span>Responsive shell · comfortable density</span>
        </div>

        <section className="summary-grid" aria-label="Project summary">
          <Card><Stat label="Active projects" value="24" change="6 due this week" /></Card>
          <Card><Stat label="Completed" value="81%" change="+4% this month" /></Card>
          <Card><Stat label="Team velocity" value="46" change="story points / week" /></Card>
        </section>

        <section className="content-grid">
          <div>
            <div className="section-heading"><div><p className="eyebrow">Portfolio</p><h2>Current work</h2></div><Button variant="ghost">View all</Button></div>
            <div className="project-grid">
              {projects.map(([name, status, tone, tasks], index) => (
                <Card className="project-card" key={name}>
                  <div className="project-topline"><Badge tone={tone as 'success' | 'warning' | 'secondary' | 'danger'}>{status}</Badge><span>Q{(index % 4) + 1}</span></div>
                  <h3>{name}</h3>
                  <p>Cross-functional delivery stream with product, design, and engineering milestones.</p>
                  <div className="project-footer"><span>{tasks}</span><Button size="sm" variant="outline">Open</Button></div>
                </Card>
              ))}
            </div>
          </div>

          <aside className="workspace-rail">
            <Card>
              <p className="eyebrow">Quick create</p>
              <h2>New work item</h2>
              <form className="quick-form" onSubmit={(event) => event.preventDefault()}>
                <Field label="Title" required><TextInput name="title" placeholder="e.g. Review mobile flow" /></Field>
                <Field label="Owner"><TextInput name="owner" placeholder="Search teammate" /></Field>
                <Button type="submit" tone="primary">Create task</Button>
              </form>
            </Card>
            <Card>
              <p className="eyebrow">Today</p>
              <h2>Upcoming</h2>
              <div className="agenda">
                {['Design critique · 10:00', 'Sprint review · 13:30', 'Launch checklist · 16:00'].map((item) => <div key={item}>{item}</div>)}
              </div>
            </Card>
          </aside>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
