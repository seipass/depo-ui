import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import LiveExamples from '../components/LiveExamples';
import LocalSearch from '../components/LocalSearch';
import { docsNavigation } from '../index';

export default function Home() {
  return (
    <Layout>
      <header className="dui-doc-hero">
        <div className="dui-doc-hero__inner">
          <p>Depo UI Design System</p>
          <h1>Build clear, resilient Web applications.</h1>
          <p>
            A reusable component system for SaaS, dashboards, administration tools, internal tools,
            and data-heavy interfaces.
          </p>
          <div className="dui-doc-actions">
            <Link
              className="dui-doc-button dui-doc-button--primary"
              to="/docs/guides/getting-started"
            >
              Get started
            </Link>
            <Link className="dui-doc-button dui-doc-button--secondary" to="/docs/components">
              Browse components
            </Link>
          </div>
        </div>
      </header>
      <main className="container">
        <section aria-labelledby="search-heading" className="dui-doc-card">
          <h2 id="search-heading">Find guidance quickly</h2>
          <LocalSearch />
        </section>
        <section aria-labelledby="sections-heading">
          <h2 id="sections-heading">Explore Depo UI</h2>
          <div className="dui-doc-grid">
            {docsNavigation.map((item) => (
              <article className="dui-doc-card" key={item.id}>
                <h3>
                  <Link to={item.path}>{item.label}</Link>
                </h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
        <LiveExamples />
      </main>
    </Layout>
  );
}
