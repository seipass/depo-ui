import { useEffect, useState } from 'react';

type SearchEntry = { title: string; description: string; path: string; kind: string };

export default function LocalSearch() {
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    void globalThis
      .fetch('/generated/search.json')
      .then((response) => (response.ok ? response.json() : []))
      .then((value: unknown) => {
        if (active && Array.isArray(value)) setEntries(value as SearchEntry[]);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const results = normalizedQuery
    ? entries
        .filter((entry) =>
          `${entry.title} ${entry.description}`.toLocaleLowerCase().includes(normalizedQuery),
        )
        .slice(0, 6)
    : [];

  return (
    <div aria-label="Documentation search" className="dui-doc-search-block" role="search">
      <label htmlFor="docs-search">Search documentation</label>
      <input
        className="dui-doc-search"
        id="docs-search"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search components, patterns, and foundations"
        type="search"
        value={query}
      />
      {results.length > 0 ? (
        <ul aria-label="Search results">
          {results.map((entry) => (
            <li key={entry.path}>
              <a href={entry.path}>{entry.title}</a>
              <span> — {entry.description}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
