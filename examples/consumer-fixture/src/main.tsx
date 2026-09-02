import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@depo-ui/react/css';
import {
  Badge,
  Button,
  Card,
  Field,
  Stat,
  TextInput,
  foundationAttributes,
} from '@depo-ui/react';
import './styles.css';

const startedAt = performance.now();
const themes = ['dark', 'light', 'high-contrast'] as const;

type Theme = (typeof themes)[number];

function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [perf, setPerf] = useState('measuring…');

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setPerf(`${(performance.now() - startedAt).toFixed(1)} ms mount · ${document.querySelectorAll('*').length} nodes`);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const nextTheme = () => {
    const current = themes.indexOf(theme);
    setTheme(themes[(current + 1) % themes.length]);
  };

  return (
    <div {...foundationAttributes({ theme, density: 'comfortable', direction: 'ltr' })} className="launch-app">
      <header className="launch-header">
        <a className="launch-brand" href="#top" aria-label="Orbit home"><span>O</span><strong>Orbit</strong></a>
        <nav aria-label="Primary navigation"><a href="#product">Product</a><a href="#proof">Proof</a><a href="#contact">Contact</a></nav>
        <div className="launch-actions"><Button size="sm" variant="ghost" onClick={nextTheme}>Theme: {theme}</Button><Button size="sm" tone="primary">Start free</Button></div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <Badge tone="primary">Built with the @depo-ui/react entrypoint</Badge>
            <h1>Ship calmer operations software.</h1>
            <p>Orbit is a fictional customer workspace used to test whether Depo UI can support a polished public-facing product without looking like an admin template.</p>
            <div className="hero-actions"><Button size="lg" tone="primary">Start a workspace</Button><Button size="lg" variant="outline">See the product</Button></div>
            <div className="perf-line"><Badge tone="success">Live render</Badge><span>{perf}</span><span>{theme} theme</span></div>
          </div>

          <Card className="hero-product">
            <div className="product-window-bar"><span>Orbit / Revenue workspace</span><Badge tone="success">Live</Badge></div>
            <div className="product-metrics"><Stat label="Pipeline" value="$1.42M" change="+18.6%" /><Stat label="Win rate" value="34.8%" change="+3.2%" /></div>
            <div className="signal-list">
              {[
                ['Enterprise renewal', '$184k', 'success'],
                ['APAC expansion', '$92k', 'primary'],
                ['Partner rollout', '$61k', 'warning'],
              ].map(([name, amount, tone]) => <div key={name}><span><strong>{name}</strong><small>Updated moments ago</small></span><span><strong>{amount}</strong><Badge tone={tone as 'success' | 'primary' | 'warning'}>{tone}</Badge></span></div>)}
            </div>
          </Card>
        </section>

        <section className="proof-strip" id="proof" aria-label="Product proof">
          <Stat label="Workspaces" value="8,400+" change="fictional demo data" />
          <Stat label="Weekly actions" value="12.8M" change="render-density sample" />
          <Stat label="Regions" value="31" change="responsive content" />
          <Stat label="Themes" value="3" change="dark · light · contrast" />
        </section>

        <section className="feature-section" id="product">
          <div className="section-intro"><p className="eyebrow">One system, different jobs</p><h2>From dense workflows to customer-facing surfaces.</h2><p>The cards below deliberately reuse the same Depo UI primitives with different hierarchy and spacing.</p></div>
          <div className="feature-grid">
            {[
              ['Command center', 'Dense monitoring views, statuses, tables, and fast actions.', 'primary'],
              ['Team workspace', 'Forms, project cards, navigation, and responsive shells.', 'success'],
              ['Customer portal', 'Clear onboarding, account controls, and trust-oriented content.', 'secondary'],
              ['High contrast', 'A dedicated theme path for users who need stronger boundaries.', 'warning'],
              ['Semantic tokens', 'Layout CSS consumes Depo UI variables instead of copied palette values.', 'primary'],
              ['Single entrypoint', 'The demo imports components and CSS through @depo-ui/react.', 'success'],
            ].map(([title, body, tone]) => <Card className="feature-card" key={title}><Badge tone={tone as 'primary' | 'success' | 'secondary' | 'warning'}>{title}</Badge><p>{body}</p></Card>)}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div><p className="eyebrow">Consumer fixture</p><h2>Test a real conversion surface.</h2><p>This form checks labels, inputs, button hierarchy, focus states, and narrow-screen wrapping using the public React facade.</p></div>
          <Card className="contact-card">
            <form onSubmit={(event) => event.preventDefault()}>
              <Field label="Work email" required><TextInput name="email" type="email" placeholder="you@example.com" /></Field>
              <Field label="Company"><TextInput name="company" placeholder="Acme Studio" /></Field>
              <Button type="submit" size="lg" tone="primary">Create demo workspace</Button>
            </form>
          </Card>
        </section>
      </main>

      <footer><span>Orbit · Depo UI performance fixture</span><span>No external UI library used.</span></footer>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
