# Lifecycle governance

Depo UI uses one lifecycle vocabulary across Component metadata, Figma mappings, Docs badges, Changesets, and release notes:

| Status     | Meaning                                      | Required action                                                                                                     |
| ---------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Proposal   | A researched idea, not a public API.         | Record the user need, alternatives, owner, and initial accessibility/content/responsive risks.                      |
| Trial      | Implemented and available for learning.      | Keep the contract explicitly changeable, provide a pilot Consumer, and record feedback and known limitations.       |
| Stable     | A long-lived public contract.                | Pass every `stableGate` item in `policy.json`, including production usage and named primary/backup owners.          |
| Deprecated | A replacement exists and removal is planned. | Publish the reason, replacement, warning, codemod or manual recipe, release note, and at least two release windows. |
| Removed    | No longer exported or supported.             | Complete the deprecation window, usage audit, migration evidence, release note, and major-release gate.             |

Status is metadata, not a code comment. A lifecycle change must update the Component metadata, evidence registry, Docs, Figma mapping where applicable, and a Changeset when a published package is affected. The release check rejects a Stable, Deprecated, or Removed entry that lacks its required evidence.

The allowed graph is intentionally one-way, with the documented Trial-to-Deprecated emergency path. A removed API is not reintroduced under the same name; a new proposal and replacement name are required.
