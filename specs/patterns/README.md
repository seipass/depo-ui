# Pattern specifications

Pattern specifications describe a user goal, not a reusable product workflow. The JSON file is the machine-readable contract used by tooling and the Markdown file is the rationale and usage guidance for people.

Pattern implementations may compose Depo UI Components, but they do not own product data fetching, routing, authorization, persistence, or analytics. Those responsibilities remain in an example or consumer adapter.

Every pattern begins in `trial` lifecycle. A pattern can become `stable` only after the Governance gate, including production evidence, accessibility review, responsive review, and documentation parity.
