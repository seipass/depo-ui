# ADR-001: Token architecture

- Status: Accepted
- Date: 2026-09-01
- Owners: Depo UI Design System maintainers
- Review date: Phase 10 governance review

## Context

Depo UI は、Figma、CSS、TypeScript、React、Docs が同じ意味の Token を利用しながら、raw value の変更を安全に運用する必要がある。Theme、Component state、生成物、外部ツールの交換形式も、Source の責任範囲を曖昧にせず管理しなければならない。

## Decision

1. DTCG Format Module 2025.10 を JSON の交換形式として採用する。DTCG の構造は specs/_schemas/token.schema.json と tooling/token-build/model.mjs で検証し、Depo UI 固有の tier、status、theme は $extensions.depo-ui で検証する。
2. Token の依存方向を Reference → Semantic → Component に固定する。Reference は raw value、Semantic は UI の意味、Component は Component 内部の local alias とする。
3. Product 向けの公開面は Semantic CSS Custom Property、型付き Semantic map、dark appearance manifest とする。Reference JSON と Component Token は public API にしない。
4. packages/tokens/src/ が人が編集する Source of Truth、packages/tokens/generated/ が build で再現する committed artifact である。生成物を直接編集せず、pnpm tokens:check で再生成との差分を検出する。
5. Dark is the single standard appearance. The semantic defaults and `dark.json` provide its mapping; there is no runtime theme selector or switching API. Forced-colors is an OS accessibility mode implemented with CSS system colors, not a token theme.
6. Reference と Semantic の canonical path は同一にしない。Semantic の安定した public name（例: size.control.md）と Reference の raw name（例: size.control.visual-md）を分離し、resolver が自己参照と曖昧な解決を起こさないようにする。
7. 生成物には CSS、TypeScript source、TypeScript declaration、ES module runtime、manifest を含める。runtime JavaScript は package export の実行入口に必要な build artifact であり、source ではない。

## Alternatives considered

- Reference と Semantic を同一 namespace に置く案: resolver の優先順位が自己参照になり、alias cycle と public/private boundary が曖昧になるため却下。
- Product に raw Reference を公開する案: Theme を差し替えられず、意味のない値へ依存するため却下。
- CSS だけを生成する案: React/TypeScript consumer と manifest、Figma mapping の型・差分検証ができないため却下。
- Figma Variables を唯一の Source of Truth にする案: review、CI、package build、migration と同期できる責任境界を保ちにくいため却下。

## Consequences

- Token source の変更は generated artifact、contrast、schema、manifest の検証を通過する必要がある。
- Reference の内部名は Product の API ではなく、必要に応じて安全に整理できる。ただし Semantic の canonical name は migration なしに変更しない。
- High Contrast の system color は通常の hex contrast 計算では判定できないため、forced-colors browser test と semantic redundancy を併用する。
