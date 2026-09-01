# Depo UI Design System Plan

> Status: Phase 0 — Repository Foundation、Phase 1 — Tokens、Phase 2 — Foundations、Phase 3 — Primitives、Phase 4A — Basic Controls、Phase 4B — Overlay Infrastructure、Phase 4C — Composite Components、Phase 5 — Advanced Components、Phase 6 — Patterns、Phase 7 — Accessibility Infrastructure、Phase 8 — Figma Integration implemented; Phase 9 — Documentation has not started. このファイルは白紙のリポジトリから Depo UI Design System を実装するための設計書であり、実装時の Source of Truth である。
>
> Research baseline: 2026-09-01（技術のバージョンは実装開始時に公式ドキュメントで再確認し、採用したバージョンを ADR に記録する）。

## 1. Goals

Depo UI は、SaaS、Dashboard、管理画面、Desktop Web、Responsive Web、Data-heavy UI、Internal Tool、Documentation UI を横断して利用できる、Web アプリケーション向けの汎用デザインシステムとする。

実装後に、次の状態を達成する。

- 見た目、状態、テーマ、密度が一貫している。
- 大量のデータを読み取りやすく、操作の結果と次の行動が分かる。
- キーボード、スクリーンリーダー、拡大表示、強制配色、タッチ入力を最初から考慮する。
- 小さな画面では情報を適切に畳み、大きな画面では一覧・詳細・補助ペインを有効に使う。
- Figma、JSON、コード、仕様、テストの名前と状態モデルが一致する。
- Component を追加しても、API、依存関係、ドキュメント、テストの構造が崩れない。
- Production での利用状況とレビューを根拠に、Component の成熟度を段階的に上げられる。
- 人間にも AI/Codex にも、どこが Source of Truth か、何を変更してよいかが明確である。

成功指標は Component 数ではなく、次の品質ゲートを継続的に通過できることである。

1. Token の依存グラフ、Theme、Contrast、生成物の鮮度が CI で検証できる。
2. Stable Component が共通の Contract、Keyboard、Focus、A11y、Theme、Responsive、Localization、Visual のテストを持つ。
3. Figma と Code の Variant、Property、Token、Lifecycle の差分を報告できる。
4. 仕様から Docs の参照情報を生成でき、重要なルールが Docs だけ、または Code だけに存在しない。
5. Package の依存グラフが DAG であり、Consumer が内部ファイルに依存しない。

## 2. Non-goals

- 特定 Product の画面、API、ドメインモデル、認可ロジック、データ取得、状態管理を Core に含めない。
- Material、Carbon、Fluent、Primer、Atlassian、GOV.UK の見た目や名前をコピーしない。参考にするのは、考え方、運用、検証方法だけである。
- Figma を単独の秘密の Source of Truth にしない。
- すべてのプラットフォーム向けの Native UI を同時に実装しない。初期実装の主対象は Web と React である。
- すべての業務画面を一つの万能 Component で表現しない。
- Component の API を自由な CSS、任意の DOM、任意の状態文字列で無制限に拡張しない。
- Accessibility、Localization、Reduced Motion、High Contrast を後付けの QA として扱わない。
- 今回の作業で package.json、tsconfig.json、Component、Token、CSS、React code、CI、Test、Docs app を作成しない。

## 3. Design Principles

### 3.1 Semantic first

Product は Reference Token の値ではなく、Semantic Token の意味を利用する。Component Token は Component 内部の実装詳細に限定する。色、余白、サイズ、状態、文言のすべてに意味を持つ名前を与える。

### 3.2 Accessible by construction

HTML の Native semantics を優先し、ARIA は不足する場合だけ利用する。Keyboard、Focus、名前、状態、エラー回復、Contrast、Zoom、Reduced Motion を Component Contract と Test の最初の項目にする。

### 3.3 Adaptive, not merely responsive

Viewport の数字だけで Component の振る舞いを決めない。Container の実効幅、Content の量、Input Method、Density、Navigation の構造、ユーザーの設定を組み合わせて、Reveal、Transform、Divide、Reflow、Expand、Position を選ぶ。

### 3.4 Composable and narrow

Primitive は小さく、Component は一つの目的に集中させる。複合的なユーザータスクは Pattern で表現する。Dropdown のように意味が広い名前を作らず、Menu、Select、Combobox、Popover のように目的を分ける。

### 3.5 Explicit contracts

Purpose、Anatomy、Variant、State、Props、Keyboard、ARIA、Content、Responsive、Density、Theme、Loading、Error、Recovery、Test、Lifecycle を機械可読な Metadata と人間向けの Specification に記録する。

### 3.6 One name across tools

JSON、CSS Custom Property、TypeScript、Figma Variable、Figma Component、Story、Docs、Test、Codemod で、Token、Component、Variant、Size、Tone、State、Property、Lifecycle の canonical name を共有する。

### 3.7 Provenance over convenience

人が編集する Source、生成された Artifact、外部ツールの Snapshot を分離する。生成物は直接編集せず、CI で Source から再生成して差分を検出する。

### 3.8 Progressive maturity

Proposal、Trial、Stable、Deprecated、Removed を明示する。利用実績、レビュー、検証が揃うまでは Stable と呼ばない。

### 3.9 AI-readable repository

短い AGENTS.md を入口にし、詳細は specs/、docs/、Metadata、テスト、生成物に分ける。AI が推測しなくても、依存方向、Source of Truth、実行コマンド、禁止事項、完了条件が読めるようにする。

## 4. Target Repository Structure

リポジトリの実体は現在のリポジトリ直下とし、不要な hasilan/ の入れ子は作らない。以下の <repo-root>/ はリポジトリ直下を表す。これは提示された構造を、Source、Artifact、Test、Governance の責任が分かるように具体化した完成予定図である。Phase 0 ではこの tree の空ディレクトリと必要な境界ファイルだけを作成し、Feature source は作成しない。

~~~text
<repo-root>/
├─ apps/
│  ├─ docs/
│  │  ├─ content/
│  │  │  ├─ guides/
│  │  │  ├─ foundations/
│  │  │  ├─ components/
│  │  │  ├─ patterns/
│  │  │  ├─ accessibility/
│  │  │  ├─ content-design/
│  │  │  ├─ api/
│  │  │  ├─ examples/
│  │  │  ├─ releases/
│  │  │  ├─ migration/
│  │  │  └─ generated/
│  │  ├─ src/
│  │  ├─ static/
│  │  └─ package.json
│  ├─ playground/
│  │  ├─ src/
│  │  │  ├─ routes/
│  │  │  └─ fixtures/
│  │  ├─ .storybook/
│  │  └─ package.json
│  └─ visual-tests/
│     ├─ tests/
│     ├─ snapshots/
│     ├─ fixtures/
│     └─ package.json
│
├─ packages/
│  ├─ tokens/
│  │  ├─ src/
│  │  │  ├─ reference/
│  │  │  ├─ semantic/
│  │  │  └─ themes/
│  │  ├─ generated/
│  │  │  ├─ tokens.css
│  │  │  ├─ tokens.ts
│  │  │  ├─ tokens.js
│  │  │  ├─ tokens.d.ts
│  │  │  └─ manifest.json
│  │  └─ package.json
│  ├─ foundations/
│  │  ├─ src/
│  │  │  ├─ css/
│  │  │  ├─ layout/
│  │  │  ├─ theme/
│  │  │  ├─ typography/
│  │  │  └─ index.ts
│  │  └─ package.json
│  ├─ primitives/
│  │  ├─ src/
│  │  │  ├─ Box/
│  │  │  ├─ Stack/
│  │  │  ├─ Inline/
│  │  │  ├─ Cluster/
│  │  │  ├─ Grid/
│  │  │  ├─ Container/
│  │  │  ├─ Center/
│  │  │  ├─ Split/
│  │  │  ├─ Sidebar/
│  │  │  ├─ Text/
│  │  │  ├─ Heading/
│  │  │  ├─ Icon/
│  │  │  ├─ Divider/
│  │  │  └─ VisuallyHidden/
│  │  └─ package.json
│  ├─ components/
│  │  ├─ src/
│  │  │  ├─ actions/
│  │  │  ├─ forms/
│  │  │  ├─ selection/
│  │  │  ├─ navigation/
│  │  │  ├─ data-display/
│  │  │  ├─ feedback/
│  │  │  ├─ overlays/
│  │  │  └─ disclosure/
│  │  └─ package.json
│  ├─ patterns/
│  │  ├─ src/
│  │  │  ├─ form-submission/
│  │  │  ├─ search-filter/
│  │  │  ├─ list-detail/
│  │  │  ├─ data-management/
│  │  │  └─ index.ts
│  │  └─ package.json
│  ├─ icons/
│  │  ├─ src/
│  │  │  ├─ actions/
│  │  │  ├─ navigation/
│  │  │  ├─ status/
│  │  │  ├─ objects/
│  │  │  └─ system/
│  │  └─ package.json
│  ├─ accessibility/
│  │  ├─ src/
│  │  │  ├─ focus/
│  │  │  ├─ keyboard/
│  │  │  ├─ ids/
│  │  │  ├─ live-region/
│  │  │  └─ index.ts
│  │  └─ package.json
│  ├─ utilities/
│  │  ├─ src/
│  │  │  ├─ collections/
│  │  │  ├─ dom/
│  │  │  ├─ formatting/
│  │  │  ├─ style/
│  │  │  └─ index.ts
│  │  └─ package.json
│  └─ react/
│     ├─ src/
│     │  ├─ providers/
│     │  ├─ entrypoints/
│     │  └─ index.ts
│     └─ package.json
│
├─ specs/
│  ├─ _schemas/
│  │  ├─ component-contract.schema.json
│  │  ├─ pattern-contract.schema.json
│  │  └─ depo-extensions.schema.json
│  ├─ principles/
│  ├─ foundations/
│  ├─ components/
│  ├─ patterns/
│  ├─ content/
│  └─ decisions/
│
├─ figma/
│  ├─ variables/
│  ├─ components/
│  ├─ mapping/
│  └─ sync/
│
├─ testing/
│  ├─ unit/
│  ├─ interaction/
│  ├─ accessibility/
│  ├─ visual/
│  ├─ themes/
│  └─ fixtures/
│
├─ tooling/
│  ├─ token-build/
│  ├─ token-lint/
│  ├─ component-generator/
│  ├─ dependency-check/
│  ├─ docs-generator/
│  ├─ figma-sync/
│  └─ codemods/
│
├─ governance/
│  ├─ lifecycle/
│  ├─ release/
│  ├─ ownership/
│  └─ templates/
│
├─ examples/
│  ├─ consumer-fixture/
│  ├─ data-heavy-dashboard/
│  └─ responsive-shell/
│
├─ docs/
│  ├─ architecture/
│  ├─ contributing/
│  ├─ operations/
│  └─ generated/
│
├─ .github/
│  ├─ workflows/
│  ├─ ISSUE_TEMPLATE/
│  ├─ PULL_REQUEST_TEMPLATE.md
│  └─ CODEOWNERS
│
├─ .changeset/
├─ AGENTS.md
├─ README.md
├─ package.json
├─ pnpm-workspace.yaml
├─ pnpm-lock.yaml
├─ turbo.json
├─ tsconfig.json
├─ eslint.config.mjs
├─ prettier.config.mjs
├─ stylelint.config.mjs
├─ playwright.config.ts
├─ vitest.workspace.ts
├─ .nvmrc
└─ .gitignore
~~~

### 4.0 App の役割

- `apps/docs/` は公式 Docs Site。Getting Started から Releases/Migration までを提供し、正式仕様や Metadata を読みやすく表示する。
- `apps/playground/` は Component を自由に試す環境。Storybook と deterministic fixture を統合し、実 Product の認証、API、データを持ち込まない。
- `apps/visual-tests/` は Visual Regression 専用の実行環境。固定 Theme、Density、Container、Locale、Browser で stories/fixtures を描画し、結果を baseline と比較する。

### 4.1 Folder boundary rules

| Folder | 目的 | 入れてよいもの | 入れてはいけないもの | 他フォルダとの関係 |
|---|---|---|---|---|
| apps/ | 実行可能なサイト、検証環境 | Docs、Playground、Visual Test の app code と app 設定 | 再利用 Component の実装、Product 固有ロジック | packages/、specs/、生成 Docs を利用する最上位の Consumer |
| packages/ | Product が import する再利用コード | Token、Foundation、Primitive、Component、Pattern、Icon、A11y、Utility | Product 固有画面、API client、秘密の値 | 下位 Package は上位 Package を参照しない |
| specs/ | 正式な設計仕様と機械可読 Contract | Markdown、JSON Schema、Component/Pattern Metadata、ADR | React/CSS、実装から推測した未承認ルール | packages/ と Docs の設計上の Source of Truth |
| figma/ | Figma 変数、Component、mapping、同期設定 | Variable manifest、Component property mapping、同期スクリプト | Access token、Figma だけの値、Product の画面 | Token/Metadata を repo から Figma に投影し、Parity を検証する |
| testing/ | 全体で共有する Test harness | Axe/Playwright/Vitest helper、fixture、matrix | Component 本体、個別 Component の唯一の Test | Component の co-located Test と組み合わせる |
| tooling/ | Build、Lint、Generator、Sync、Codemod | CLI、schema validator、transformer | 実行時 UI、Product ロジック | Source を読み、Artifact を生成する。Source を逆参照しない |
| governance/ | Lifecycle、Release、Owner、Contribution | Policy、template、review checklist | Component 実装、Product の判断 | PR、CI、Docs、Spec が参照する運用の Source |
| examples/ | 利用例と Consumer 検証 | 最小の dashboard、responsive shell、data-heavy fixture | Core への import、実装のコピー | Package を公開 API 経由で利用する |
| docs/ | リポジトリ運用と設計の人間向け案内 | Architecture、contributing、operations、生成 snapshot | Formal spec の二重管理 | apps/docs が読みやすいサイトとして表示する |
| .github/ | CI と GitHub workflow | YAML、template、CODEOWNERS | Token、Component、長い設計仕様 | tooling/ の CLI を起動する |

specs/ を正式仕様、apps/docs/ を人間向けサイト、docs/ をリポジトリ運用案内に分ける。内容が重複する場合は specs/ または Metadata を Source とし、Docs は生成またはリンクで表示する。

### 4.2 提示された基本案からの変更理由

- リポジトリ直下に hasilan/ を作らない。既に repo root が対象であり、二重の root は Codex、CI、Package path を分かりにくくする。
- specs/_schemas/ を追加する。Component Contract と Pattern Contract を Generator、CI、Docs が同じ schema で読めるようにするためである。
- packages/react/ は別実装ではなく、React 向けの公開 facade、Provider、entrypoint とする。Component 実装を二重管理しないためである。
- testing/、tooling/、governance/、.changeset/ を明示する。長期運用では Component code だけでなく、検証、生成、Release、Lifecycle が製品品質を決めるためである。
- apps/playground/.storybook/ を置く。Stories は Component の co-located source とし、Playground で統合して閲覧・操作できるようにする。

### 4.3 初期 ADR の配置

重要な設計判断は `specs/decisions/` に次のような連番で置く。ADR の本文は「Context、Decision、Alternatives、Consequences、Status、Owners、Review date」を持ち、後から変更された場合も過去の判断を上書きせず、新しい ADR から参照する。

- `ADR-001-token-architecture.md`: Reference → Semantic → Component と DTCG の採用理由。
- `ADR-002-spacing-scale.md`: 4px 基本単位と 2px hairline の境界。
- `ADR-003-density-model.md`: compact / comfortable / touch と hit target の関係。
- `ADR-004-component-api.md`: common prop vocabulary、controlled state、slot、escape hatch。
- `ADR-005-color-palette.md`: Depo UI anchor、追加色、Contrast の結果。
- `ADR-006-figma-source-boundary.md`: Repo/Figma の Source of Truth、sync、権限境界。

## 5. Package Responsibilities

初期の npm scope は仮に @depo-ui とする。実装開始前に公開範囲と Package の分割を ADR に確定する。

| Package | 責任 | 公開するもの | 禁止事項 |
|---|---|---|---|
| @depo-ui/tokens | DTCG JSON の Source、Theme、生成 CSS/TS 型 | Semantic CSS variables、型付き token map、Theme manifest | Component import、React、Product の raw token 利用を強制する API |
| @depo-ui/foundations | Reset、Theme root、Typography、Layer、layout CSS の基盤 | CSS、Theme/Direction/Density の基礎、layout helpers | Button などの業務 Component、具体的な画面 |
| @depo-ui/primitives | DOM と layout の最小構成 | Box、Stack、Text、Grid、Icon など | API call、Data fetch、複雑な業務 state、意味の曖昧な万能 wrapper |
| @depo-ui/components | 再利用可能な UI Component | Button、TextInput、Dialog、Table など | Product 固有の data shape、routing、business validation |
| @depo-ui/patterns | ユーザータスクの標準的な composition | Search and filter、Form submission、List detail など | Core Component の再実装、Product の API client |
| @depo-ui/icons | SVG Icon の canonical catalog | Tree-shakable Icon、Icon metadata | 独自の状態管理、ラベルを含む業務 UI |
| @depo-ui/accessibility | Focus、Keyboard、ID、ARIA、live region の共通機能 | framework-neutral な計算・型・DOM helper | 色、見た目、Componentごとの業務挙動 |
| @depo-ui/utilities | UI に依存しない小さな純粋関数 | class/token formatting、collection、Intl formatter | 何でも入れる utils.ts、React Component、Product logic |
| @depo-ui/react | React consumer の安定した入口 | re-export、ThemeProvider、DensityProvider、DirectionProvider | 別の Component 実装、内部 Package からの逆参照 |

@depo-ui/components の Component source は packages/components/src/<category>/<Component>/ に統一する。packages/components/package.json、公開 entrypoint、build 設定など Package root の管理ファイルは root に置き、src/ には移動しない。category directory を Package root 直下に作る構成は採用しない。

React 18 を support する選択をした場合、ref compatibility の実装層は Phase 0 の ADR で @depo-ui/react facade、専用 entrypoint、または明示的な adapter のいずれかに決める。Component ごとの無条件な forwardRef を compatibility policy として採用しない。

公開単位は、初期は @depo-ui/react を推奨する。必要な場合だけ foundation/token/icon の subpath export を公開し、Package 内部 path への依存を防ぐ。各 Package の exports で公開面を明示し、src/** の deep import は CI で禁止する。

初期の `primitives`、`components`、`patterns` の renderer は React/TSX とする。Framework-neutral に保つ対象は Token JSON、Foundation CSS、Accessibility の計算・型・DOM helper、Utilities であり、将来別 renderer を追加する場合も React 実装をコピーせず、同じ Spec/Metadata/Token を実装する。

## 6. Dependency Architecture

### 6.1 依存方向

~~~text
@depo-ui/tokens
        ↓
@depo-ui/foundations
        ↓
@depo-ui/accessibility   @depo-ui/utilities   @depo-ui/icons
          \                |                 /
           └────── @depo-ui/primitives ─────┘
                              ↓
                     @depo-ui/components
                              ↓
                      @depo-ui/patterns
                              ↓
                       @depo-ui/react
                              ↓
                       apps / examples
~~~

補足ルール:

- utilities は原則 leaf package とし、tokens、components、apps に依存しない。
- accessibility は utilities の純粋な helper だけを利用できる。Component 固有の CSS や Component import はしない。
- icons は独立した SVG catalog であり、必要なら token の size contract を参照するが、Component を参照しない。
- primitives、components、patterns の順は上向きのみ許可する。components → patterns、tokens → components は禁止する。
- @depo-ui/react は facade なので全 runtime package に依存できるが、下位 Package は facade に依存しない。
- apps と examples は public export だけを利用し、Package 内部 path、test helper、generated source へ直接依存しない。
- packages/tokens/generated/ は packages/tokens/src/ から生成される。generated から source を import したり、source の build が generated の編集結果を必要としたりしない。
- Product 固有コードは apps または Consumer 側に置き、Core Component の props を Product 名に合わせて増やさない。

### 6.2 自動検査

- pnpm-workspace.yaml で workspace を宣言し、workspace dependency は workspace: protocol を使う。workspace cycle は disallowWorkspaceCycles: true で install 時に失敗させる。
- tooling/dependency-check/ に package graph と import graph の検査を実装する。dependency-cruiser 相当のルールまたは自前の TypeScript AST checker を使い、上記の forbidden edge、deep import、cycle を検出する。
- TypeScript の project reference と tsc --noEmit で型境界を検証する。
- Turborepo の task graph は build/test の依存を ^build 等で宣言し、graph を CI で出力して review 可能にする。
- ESLint の import boundary rule と、Package の exports を併用する。片方だけに依存しない。
- 代表的なチェックコマンドは pnpm lint:deps、pnpm lint:tokens、pnpm lint:raw-values、pnpm typecheck とする。

## 7. Token Architecture

### 7.1 三層モデル

~~~text
Reference  ── raw value、theme 非依存
    ↓
Semantic   ── UI 上の意味、theme で値が変わる
    ↓
Component  ── Component 内部の slot/state 用 alias
~~~

依存は必ず Reference → Semantic → Component とし、逆参照、横断参照、循環 alias を禁止する。

#### Reference Token

色、数値、寸法、font、duration、easing などの生の値を持つ。color.brand.600、space.4、radius.2、font.size.300、duration.fast のように、値の分類とスケールを表す。意味を表す action や button を Reference の名前に入れない。

#### Semantic Token

UI の意味と役割を表す。例は color.bg.canvas、color.bg.surface、color.fg.primary、color.fg.secondary、color.border.default、color.border.focus、color.action.primary、space.control.inline、size.control.md である。Product は原則としてこの層だけを利用する。

#### Component Token

Component の slot と state を実装する local alias である。例は button.primary.bg.rest、button.primary.bg.hover、input.border.invalid、dialog.padding.inline。Component Token は public な global token として Product に公開しない。必ず Semantic Token を参照し、raw value を持たない。

### 7.2 Source of Truth とファイル規則

~~~text
packages/tokens/src/reference/*.json  = 人が編集する Reference
packages/tokens/src/semantic/*.json   = 人が編集する Semantic contract/alias
packages/tokens/src/themes/*.json     = 人が編集する Theme mapping
specs/components/**/*.json            = Component metadata/contract
packages/tokens/generated/*           = 自動生成、直接編集禁止
~~~

Design Token の exchange format は DTCG Format Module 2025.10 を基準にする。DTCG は W3C Community Group の仕様であり W3C Recommendation そのものではないため、Depo UI では「ツール間交換形式」として利用し、独自の tier/theme policy は別の schema で検証する。独自拡張は $extensions.depo-ui の namespace に限定する。DTCG が将来 supersede された場合は、正規化層で吸収し、Source の意味と canonical name を不用意に変えない。

各 Token は $value、適切な $type、$description、$extensions.depo-ui.tier、status、必要なら figma metadata を持つ。Alias は DTCG の参照記法で表し、未定義参照、型不一致、alias cycle、Theme 間の欠落を build 失敗にする。

例（構造例であり、実装時は schema に合わせて確定する）。

~~~json
{
  "color": {
    "brand": {
      "600": {
        "$type": "color",
        "$value": "#6C6FF6",
        "$description": "Depo UI primary brand reference",
        "$extensions": {
          "depo-ui": {
            "tier": "reference",
            "status": "stable",
            "figma": { "collection": "Reference", "name": "color/brand/600" }
          }
        }
      }
    }
  }
}
~~~

### 7.3 ディレクトリと生成物

packages/tokens/src/reference/ は color.json、spacing.json、typography.json、sizing.json、radius.json、border.json、elevation.json、motion.json、layout.json、density.json に分ける。src/semantic/ は color.json、spacing.json、typography.json、sizing.json、motion.json、layout.json、density.json、radius.json、border.json、elevation.json とし、Theme 固有の値は src/themes/dark.json、light.json、high-contrast.json に置く。

generated/ は commit して差分をレビュー可能にする。tokens.css、tokens.ts、tokens.js、tokens.d.ts、manifest.json は build で再生成し、pnpm tokens:build && git diff --exit-code -- packages/tokens/generated を CI に置く。生成物を直接編集した場合は CI が失敗する。tokens.js は ESM consumer が実行時に利用する生成入口であり、他の生成物と同じく直接編集しない。

生成 CSS は --dui-* prefix を使用する。Reference は developer-only の inspect 用に限定し、Product 向けの public export は Semantic Token と Theme を中心にする。

### 7.4 Depo UI の Color palette

Depo UI の指定色は必須の palette anchor として採用し、変更には色差分、Contrast 結果、Migration note を含む ADR を要求する。canonical な Reference ramp に割り当て、Semantic Token から role を表現する。

| 指定された役割 | 値 | 初期の canonical mapping |
|---|---|---|
| Primary | #6C6FF6 | color.brand.600 |
| Primary hover | #8588FF | color.brand.500 |
| Primary container | #262A5F | color.brand.900 |
| On primary | #05060A | color.neutral.950 |
| On primary container | #C8CBFF | color.brand.100 |
| Secondary / Info | #4B8DFF | color.accent.600 |
| Secondary hover | #72A6FF | color.accent.500 |
| Secondary container | #14345F | color.accent.900 |
| On secondary container | #C7DCFF | color.accent.100 |
| Success | #35B779 | color.success.600 |
| Success container | #153B2A | color.success.900 |
| On success container | #BEF4D8 | color.success.100 |
| Warning | #C79240 | color.warning.600 |
| Warning container | #3C2F18 | color.warning.900 |
| On warning container | #F5D7A3 | color.warning.100 |
| Danger | #E06A6A | color.danger.600 |
| Danger container | #461F25 | color.danger.900 |
| On danger container | #FFC4C4 | color.danger.100 |
| Surface | #05060A | color.neutral.950 |
| Surface sunken | #08090D | color.neutral.925 |
| Surface panel | #0D0F14 | color.neutral.900 |
| Surface raised | #14161D | color.neutral.850 |
| Surface hover | #1D2029 | color.neutral.800 |
| Surface inverse | #F8FAFC | color.neutral.50 |
| On surface | #F8FAFC | color.neutral.50 |
| On surface secondary | #D8DDE6 | color.neutral.200 |
| On surface muted | #858C9B | color.neutral.400 |
| On surface inverse | #08090D | color.neutral.925 |
| Border subtle | #20232D | color.neutral.750 |
| Border | #2C303B | color.neutral.700 |
| Border strong | #414753 | color.neutral.600 |

neutral.925 のような中間段階は、Depo UI の supplied surface anchors を正確に保つための内部 ramp 名である。番号そのものを明るさや Contrast の意味として Product に公開しない。

### 7.5 追加する色と理由

指定 palette だけでは Light、High Contrast、Disabled、Focus、Status text の全組合せを安全に表現できないため、次の追加色を Phase 1 で設計し、Contrast test を通過したものだけを採用する。

1. neutral.0、neutral.25、neutral.100、neutral.300、neutral.500 などの light neutral ramp。Light Theme の canvas、field、hover、divider、disabled を中間色で構成し、すべてを白黒の二値にしないために必要である。指定された #F8FAFC、#D8DDE6、#858C9B、#414753 はこの ramp の anchor として再利用する。
2. color.focus.ring の Theme 別値。Brand Primary と Focus Indicator は役割が違い、背景によって必要な 3:1 の non-text contrast を満たす値が変わるためである。
3. color.fg.success、color.fg.warning、color.fg.danger の strong text/icon 値。指定された明るい status color は fill として適していても、Light Theme の通常文字として常に十分な Contrast になるとは限らないためである。
4. color.overlay.scrim、color.focus.inner、color.disabled.*。Dialog/Drawer の背面、二重 focus ring、非活性文字・背景を opacity だけに頼らず表現するためである。
5. High Contrast Theme 用の CSS system color（Canvas、CanvasText、Field、FieldText、ButtonFace、ButtonText、LinkText、Highlight、HighlightText、GrayText 等）。ユーザーの OS 設定に従い、色名を固定しないためである。

追加色は「ブランドの自由な拡張」ではなく、特定の Semantic role と Contrast 検証に紐づく最小限の補助 palette とする。未使用の見た目目的の色は追加しない。

### 7.6 Theme architecture

- Reference Token は Theme 非依存である。
- Semantic Token の名前、型、説明、用途は全 Theme で同じにする。Light/Dark/High Contrast は同じ role に別の値を割り当てる。
- dark.json は指定された Surface、Foreground、Border、Primary、Secondary、Status anchors を default とする。
- light.json は追加した light neutral と accessible status/focus value を使い、指定色は brand/status fill として可能な箇所で維持する。
- high-contrast.json は system color と visible border を優先する。shadow、透過、色相差だけを情報伝達に使わない。
- Runtime は data-theme="dark|light|high-contrast" を基本とし、system は OS preference を解決して同じ semantic variables に切り替える。SSR では初回 Theme を決める仕組みを用意し、FOUC を避ける。
- Theme override が Semantic contract にない新しい public Token を追加することを禁止する。新しい role が必要なら先に Semantic contract と ADR を更新する。

## 8. Foundation Architecture

Foundation は Component の見た目の共通語彙であり、Product の画面構造ではない。実装は @depo-ui/foundations と @depo-ui/tokens に分け、すべての値は Token 経由で参照する。

| Foundation | 初期設計 | 受け入れ条件 |
|---|---|---|
| Color | 7.4 の Depo palette、Semantic role、Light/Dark/High Contrast | Contrast、forced colors、color-only prohibition を検証できる |
| Typography | UI は Inter, Noto Sans JP, Noto Sans, Segoe UI, system-ui, sans-serif の順を初期候補とする。Monospace は ui-monospace 系。Font は role と fallback を token 化する | CJK、英数混在、長文、200% resize、font 未インストール時に layout が壊れない |
| Spacing | 4px を基本単位、2px hairline を細部専用。初期 scale は 0, hairline, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24 | arbitrary spacing の増殖がなく、semantic spacing へ解決できる |
| Sizing | size.control.sm=32px、md=40px、lg=48px を基礎候補。Touch density は視覚サイズと hit target を分離し、最低 44px の操作領域を優先 | 3 density、keyboard、coarse pointer、long label で操作できる |
| Radius | none=0、sm=4、md=6、lg=8、xl=12、full=9999 の初期候補 | Component が独自の radius を発明せず、Theme で一貫する |
| Border | 通常 1px、strong/focus 2px、divider と outline を別 role にする。Focus は layout をずらさない outline/inner ring を使う | 3:1 non-text contrast、forced colors、focus not obscured を満たす |
| Elevation | base、raised、floating、popover、modal の 5 level。Dark は shadow だけでなく Surface/Border を変える | layering が z-index と一致し、shadow がなくても階層を理解できる |
| Layout | logical properties、min/max content、Container、Split、Sidebar、scroll boundary を基礎とする | RTL、zoom、narrow container、overflow で内容を失わない |
| Grid | 12-column を広い画面の基準にし、narrow では 4、medium では 8、expanded では 12 を候補とする。Gutter は 8/16/24/32px token | grid を固定幅の牢獄にせず、container query で再配置できる |
| Density | compact、comfortable、touch。Provider/attribute で subtree に適用し、Component は density token を解決する | row height、control、gap、hit target が同じ density で揃う |
| Responsive | 15 の adaptive mode と container query。Viewport breakpoint は shell の fallback のみ | 320 CSS px / 400% zoom、orientation、input method、long content を検証できる |
| Iconography | 17 の Icon System に従う。Icon 単体の意味、隣接 label、hit target を分ける | decorative/semantic の accessible name が明確 |
| Motion | 16 の duration、easing、reduced motion に従う | animation 無効でも状態、順序、回復方法が分かる |
| Z-index / Layer | base=0、sticky=10、navigation=20、popover=100、modal=200、toast=300、debug=1000 を候補とし、token 化する | arbitrary z-index がなく、overlay が focus を遮らない |

Typography の font 候補は Phase 0 でライセンスと Figma 利用可否を確認する。Font が入手できない場合も fallback で同じ line-height、weight、overflow の Contract を満たすことを優先する。

## 9. Component Architecture

### 9.1 実装モデル

- Component は semantic HTML、controlled/uncontrolled state、slot、data attribute、tokenized styles の組み合わせで作る。
- React 19 以降を利用する場合、Function Component は `ref` を通常の prop として受け取る設計を基本とする。新しく作る Component の標準実装に `forwardRef` を使わない。React 19 では新規 Function Component に `forwardRef` は不要で、将来 deprecated になる予定である。
- React 18 を support range に含める場合は、Phase 0 で React support range と ref compatibility strategy を一緒に決定する。互換性のために `forwardRef` が必要な場合も、Component ごとに無条件で使わず、明示した compatibility layer、entrypoint、または adapter の責任として管理する。
- Public Component API として ref を利用できることは維持するが、DOM node を公開する必要がない Component には不要な ref API を作らない。`useImperativeHandle` 等の imperative API は、props では表現できない focus、scroll、selection などの操作に限定し、open/close 等の状態操作には使わない。
- Component の styling は build-time の vanilla-extract の TypeScript style recipe を採用する。Runtime CSS-in-JS は使わず、CSS Custom Property と logical property を中心にする。将来 CSS Modules 等へ交換できるよう、Component は styles.ts 以外の style compiler API を公開しない。
- HTML が持つ Native behavior を優先する。button、input、select、dialog、table で実現できるものを、不要な div role に置き換えない。
- data-disabled、data-loading、data-invalid、data-selected、data-checked、data-expanded、data-dragging、data-focus-visible などを状態の観測面として提供する。CSS の data-state は open/closed、checked/unchecked のような単一の finite state machine 用に限定する。
- className は Primitive と明示的な layout slot に限定して許可する。Component は style で arbitrary CSS value を無制限に上書きできない。拡張が必要な場合は documented component token、slot、variant のいずれかを追加する。
- as/asChild は意味と Keyboard/ARIA を壊さない Primitive のみに限定する。Interactive Component に任意の element を許可しない。

### 9.2 Component directory convention

すべての Component は、可能な限り同じ file set を持つ。Contract の正式な Source は specs/components/<category>/<component>.json と .md であり、実装フォルダに同じ仕様を複製しない。

~~~text
<Component>/
├─ <Component>.tsx
├─ <Component>.types.ts
├─ <Component>.styles.ts
├─ <Component>.tokens.ts
├─ <Component>.test.tsx
├─ <Component>.a11y.test.tsx
├─ <Component>.visual.tsx
├─ <Component>.stories.tsx
└─ index.ts
~~~

| File | 役割 | 書かないもの |
|---|---|---|
| <Component>.tsx | render、slot、event wiring、controlled/uncontrolled state、semantic HTML | raw color/spacing、巨大な domain logic |
| <Component>.types.ts | public props、slot、event、value/selection 型 | Component ごとの別名 API、any による逃げ道 |
| <Component>.styles.ts | token を参照する build-time style recipe、slot、state selector | hex、任意の px、theme 固有の秘密の値 |
| <Component>.tokens.ts | Component Token の local alias と slot/state mapping | global token の再定義、Product 向け public token |
| <Component>.test.tsx | props、render、state transition、event、controlled/uncontrolled の単体/interaction | screen reader の全検証をここだけに閉じること |
| <Component>.a11y.test.tsx | axe、名前/role/state、focus、keyboard、live region の自動検証 | 自動検証だけで WCAG 達成と判断すること |
| <Component>.visual.tsx | Theme、Density、Responsive、long text、状態の visual fixture | 仕様にない状態の追加 |
| <Component>.stories.tsx | Default、Variants、States、Edge cases、play interaction、Docs 用 story | 仕様と矛盾する demo、Product API のモック依存 |
| index.ts | public export と型 export | 内部 helper、test fixture、未承認 export |

この共通 file set は ref API の存在を意味しない。各 Component の Contract が DOM node または限定した imperative handle を公開すると定めた場合だけ、React 19+ では ref prop を実装し、React 18 を support する場合は Phase 0 の compatibility boundary に従う。

### 9.3 共通 Component API

同じ意味の prop は全 Component で次の語彙を使う。

~~~text
variant
size
tone
density

disabled
readOnly
loading

selected
checked
expanded
invalid
required
~~~

kind、type、mode、appearance、style、isDisabled を同義語として新設しない。ただし HTML の標準 type、inputMode など、標準 API と同じ意味の属性は例外とする。

State の API は Component の意味に合わせて統一する。

- 入力: value / defaultValue / onValueChange、validation は invalid と errorMessage。
- Open state: open / defaultOpen / onOpenChange。
- Selection: selectedKey / defaultSelectedKey / onSelectionChange。
- Check: checked / defaultChecked / onCheckedChange。
- 変更イベントは onXChange、DOM event は必要な場合に標準 onClick 等を併記する。
- disabled は操作不可を意味し、loading は処理中を意味する。Loading を単に disabled の見た目として扱わない。

#### Ref policy

- Component Contract の Props/Accessibility に、ref を公開するか、公開する場合にどの DOM node または限定された imperative handle を返すかを記録する。
- React 19+ の実装では `ref` を props から対象 node へ渡す。`forwardRef` は新規 Component の共通規約ではなく、React 18 compatibility strategy が選択された場合の境界実装に限る。
- ref の公開は keyboard/focus test を可能にするための手段であって、全 Component に機械的に追加する API ではない。Form control、focusable overlay、scrollable data surface など、Consumer が操作する明確な対象がある場合にだけ公開する。

Variant の値は Component ごとに必要なものだけ許可するが、語彙は共通にする。例として solid、soft、outline、ghost、link、subtle を候補とし、意味が違うものを同じ variant 名に詰め込まない。tone は neutral、primary、secondary、success、warning、danger を基本にする。

### 9.4 Canonical Component Contract

すべての Component の `specs/components/<category>/<component>.json` は、次のフィールドを必須とする。値が適用できない場合も、フィールドを省略せず `none`、`not-applicable`、または理由付きの空配列で明示する。これにより Generator、Docs、Codex が「未定義」と「該当なし」を区別できる。

```text
Purpose
Anatomy

Variants
Sizes
Tone

States

Props
Events

Keyboard behavior
Focus behavior

Semantic HTML
ARIA

Content rules

Responsive behavior
Density behavior
Theme behavior

Loading behavior

Error behavior
Recovery behavior

Accessibility

Tests

Lifecycle status
Owner
Figma mapping
Token mapping
Known limitations
Migration notes
```

`specs/_schemas/component-contract.schema.json` は field type、allowed lifecycle、common prop vocabulary、state name、WCAG reference の形を検証する。人間向けの `.md` は同じ JSON を読み、why/when/how、Do/Don't、例、Content guidance を補足する。Code にしか存在しない重要な API ルール、Docs にしか存在しない重要な状態ルールを許可しない。

## 10. Component Catalog

### Actions

Button、IconButton、Link、SplitButton。

- Button は単一の action、Link は navigation、IconButton は label を持つ単一 icon action、SplitButton は primary action と関連 Menu を組み合わせる。
- Dropdown は作らない。選択は Select/Combobox、action menu は Menu、浮遊情報は Popover とする。

### Forms

Field、TextInput、Textarea、NumberInput、Checkbox、CheckboxGroup、Radio、RadioGroup、Switch、Select、Combobox、DateInput、DatePicker、SearchField、FileUpload、Slider。

- Field は label、description、error、required、help の関係を統一する structural component。
- SearchField は検索の submit/clear/loading を持つ compound field、Combobox は候補検索と selection、Select は既知の選択肢から選ぶ control とする。
- DateInput は text/keyboard entry、DatePicker は calendar overlay を含む。日付の validation と locale は utilities/Pattern と組み合わせる。

### Selection

Tabs、SegmentedControl、ToggleButton。

- Tabs は page/region navigation、SegmentedControl は同一 context の少数 option、ToggleButton は boolean または toggle group action。

### Navigation

Breadcrumbs、Pagination、SideNav、TopNav、Menu、MenuButton、CommandPalette。

- MenuButton は Button と Menu の composition。Menu は action list、Select/Combobox は value selection なので混ぜない。
- CommandPalette は searchable command surface であり、navigation/selection の keyboard model を明示する。

### Data Display

Badge、Tag、Avatar、Card、List、Table、DataGrid、Tree、Stat、KeyValue、Code、Kbd。

- Table は semantic static table、DataGrid は sorting、selection、keyboard navigation、column/row virtualization 等の interactive data surface。
- List は collection presentation。selection、loading、empty は Pattern または explicit props で構成する。
- Badge は短い status、Tag は分類・filter・removable label として区別する。

### Feedback

InlineMessage、Banner、Toast、Spinner、ProgressBar、Skeleton、EmptyState、ErrorState。

- InlineMessage は local context、Banner は page/section context、Toast は transient status。Toast だけで重要な error recovery を伝えない。

### Overlay

Tooltip、Popover、Dialog、Drawer。

- Tooltip は補助情報であり必須情報を隠さない。Popover は non-modal contextual content。Dialog は modal task/confirmation、Drawer は side/bottom surface として focus と dismiss rule を分ける。

### Disclosure

Disclosure、Accordion。

- Disclosure は一つの region、Accordion は複数または single-open の disclosure collection。Dialog や Menu の代替にしない。

各 Component は追加前に既存 catalog の目的、Anatomy、Keyboard、aria role、lifecycle を比較し、重複がないことを ADR または Component proposal に記録する。

## 11. State Model

### 11.1 State は一つの enum にまとめない

状態は次の channel に分ける。

1. Behavior gate: disabled、loading、pending。
2. Validation/status: success、warning、invalid、unavailable。
3. Interaction: hover、pressed、focus-visible、dragging。
4. Selection/disclosure: selected、checked、expanded。
5. Lifecycle: rest、enter、exit。

この分離により、selected + hover + focus-visible、invalid + focus-visible、loading + disabled を表現できる。state="everything" のような combinatorial API は作らない。

### 11.2 表示と操作の優先順位

Behavior は次の順で決める。

~~~text
disabled
  ↓
loading / pending
  ↓
dragging（該当する場合）
  ↓
validation: invalid / warning / success
  ↓
interaction fill: pressed → selected/checked/expanded → hover → rest
~~~

focus-visible は fill の優先順位に入れず、enabled な全 state の上に独立した focus ring として表示する。invalid も focus を隠さず、focus ring と error indicator を同時に認識できるようにする。

- disabled: interaction を受け付けず、通常 Tab sequence から除外する。disabled であることを opacity だけで表さない。
- loading/pending: duplicate submit を防ぐ。既に focus 中なら focus を奪わず、aria-busy/status を必要に応じて付ける。
- invalid: field と error message を programmatically associate する。色以外に icon/文言/outline を使う。
- focus-visible: 2px 相当の visible indicator、背景との 3:1 以上、overlay に隠れない位置を確保する。
- pressed/selected/checked/expanded: 永続状態を pointer hover だけで表さない。ARIA/state と visual を一致させる。
- hover: pointer がない環境でも基本操作を失わない。
- rest: 必ず操作可能性と意味が分かる baseline。

### 11.3 State metadata

State 名は Figma、CSS data attribute、Story 名、Test 名、Docs の表で同じにする。State が適用できない Component は無理に追加せず、Metadata の supportedStates で明示する。

## 12. Pattern Architecture

Pattern は Component の再利用ではなく、「ユーザーが達成したい仕事」の再利用である。Pattern は UI composition、state transition、error/recovery、responsive、a11y を定義するが、Product の data fetch、route、permission model の実装は持たない。

### 12.1 Pattern Contract

各 Pattern は specs/patterns/<slug>.md と specs/patterns/<slug>.json を持つ。最低限、次を記述する。

~~~text
Purpose
User goal
Entry conditions
Components
States and transitions
Error and recovery
Responsive behavior
Accessibility
Content guidance
Instrumentation boundary（任意、Product が実装）
Lifecycle
~~~

共通 transition は idle → loading → success | empty | error、submit は idle → submitting → success | error、destructive は idle → confirm → processing → success | error を基本とし、cancel、retry、undo、permission change を明示する。

### 12.2 Pattern catalog

| Pattern | 目的 / Component | 状態・遷移 | Error / Recovery | Responsive / Accessibility |
|---|---|---|---|---|
| Form submission | 入力を安全に送信する。Field、form controls、Button、InlineMessage | idle → editing → submitting → success/error。未保存変更を保持 | Field error は該当 field へ戻す。server error は summary + retry/修正。入力値を消さない | narrow は単列、actions は見つけやすく。label、required、error association、submit keyboard |
| Search and filter | 大量データから絞り込む。SearchField、Select、Combobox、Tag、Table/List | idle → loading → results/empty/error。filter は個別削除・全解除 | query/filter を保持して retry。結果 0 と error を混同しない | filter bar は wrap、narrow は drawer。結果件数を status で通知、keyboard で全条件へ移動 |
| List detail | 一覧と詳細を行き来する。List、Card、Drawer、Dialog、navigation | narrow は list ↔ detail、wide は list + detail | detail load error は list selection を失わず retry/back | container 幅で one/two/three pane。選択状態、heading、back、focus return を管理 |
| Create | 新規リソースを作る。Dialog/Drawer または page form | idle → editing → submitting → created / error / cancel | duplicate、permission、validation ごとに修正または retry。作成後の destination を明示 | small は full-screen/route、large は dialog。focus trap、heading、unsaved changes |
| Edit | 既存リソースを変更する。Field、Button、Banner | view → editing → dirty → saving → saved/error | conflict/version error は差分と reload/merge。保存中の二重操作を防ぐ | action bar の reflow、長文保持。変更内容を screen reader に通知 |
| Delete | リソースを削除する。IconButton/Button、Dialog、Toast | idle → confirm → deleting → deleted/error | 影響範囲を確認。失敗時 retry、可能なら undo/restore | destructive CTA を明示。Dialog の focus、Escape/cancel、red だけに依存しない |
| Destructive action | 取り返しのつかない操作を理解させる | idle → confirm → processing → complete | action、対象、不可逆性、代替/recovery を文言化 | narrow でも CTA の順序を維持。default focus は安全な選択肢を検討 |
| Async action | background または remote 操作の進行を示す。Button、ProgressBar、InlineMessage | idle → pending → success/warning/error。cancel 可能なら cancelling | retry、cancel、partial success、support link。silent failure 禁止 | no motion でも進捗と status を伝える。aria-busy と live region |
| Error recovery | 問題から作業を再開させる。ErrorState、InlineMessage、Button、Link | error → retry → loading → recovered/error、error → alternative | 何が問題か + どう直すか。入力、filter、selection を保持 | page/section/field の error level を分ける。heading、focus、status message |
| Empty state | データがない、まだない、結果がないを区別する | loading → empty または filtered-empty | create、clear filter、learn more の次 action を提示 | narrow でも CTA を wrap。decorative image は alt policy に従う |
| Loading | 初回、部分、再取得を示す | idle → loading → content/empty/error、refresh は content を保持 | timeout/error と skeleton を分ける。retry を示す | Skeleton は layout shift を抑える。screen reader には status、必須 content を隠さない |
| Data management | browse、sort、filter、paginate、view detail を一連で行う | idle → fetching → ready/empty/error、sort/filter/pagination で fetch | stale data、partial failure、retry。current query を URL/consumer が管理 | Table/DataGrid は narrow で priority column、detail alternative、keyboard grid model |
| Bulk action | 複数 item をまとめて操作する。Checkbox、DataGrid/List、action bar、Dialog | none-selected → some/all-selected → processing → partial/success/error | affected count、partial failure、retry/undo。selection を不用意に消さない | selection summary を announce。select all の scope を明示 |
| Responsive navigation | shell の navigation を画面/Container に合わせる。TopNav、SideNav、Drawer、Menu | permanent/persistent/temporary。wide ↔ narrow transform | nav failure は main content を失わず fallback | nav toggle name、landmark、focus return、Escape、skip link |
| Permission state | access がない/限定される状態を説明する。Banner、InlineMessage、Button/Link | checking → allowed/limited/denied | request access、switch account、learn more。機密情報を error に出さない | disabled では理由が読めないため説明を残す。aria-disabled の使い分け |
| Unavailable state | resource が削除済み、未提供、offline などを区別する | available → unavailable、retry/alternate | 状況、影響、可能な次 action を示す | status と heading、link/button の名前、offline でも操作可能な範囲 |
| Undo | reversible action の取り消しを短時間提供する。Toast、Button | completed → undo-window → restored/expired | undo failure は状態を再同期し、元データを失わない | Toast を見逃しても操作履歴/別 recovery を用意。live region と timeout 操作 |
| Authentication | sign-in、verification、session expiry、re-auth | signed-out → authenticating → authenticated/error/expired | field-specific error、retry、password manager、recovery | accessible authentication、one field per fact、focus、autocomplete、error text |
| Command palette | command を検索し keyboard で実行する。CommandPalette、Combobox、Kbd | closed → open → query → result/empty → executing → closed/error | command unavailable、permission、execution error を保持して retry | Ctrl/Cmd+K は補助。focus trap、roving/active descendant、Escape、announced result |

Pattern の React 実装は必要な場合だけ packages/patterns に置き、仕様のみで価値があるものは先に specs/ と Docs で提供する。Pattern が Product domain の data type を要求し始めたら、Pattern ではなく Consumer adapter に分離する。

**Phase status**

- Status: Completed。19個の Pattern catalog を `specs/patterns/` の JSON/Markdown として定義し、Form submission、Search and filter、List detail、Data management、Error recovery、Responsive navigation の主要6 Patternを `packages/patterns/src/<pattern>/` に実装した。
- Implemented source: `packages/patterns/src/form-submission/`、`search-filter/`、`list-detail/`、`data-management/`、`error-recovery/`、`responsive-navigation/`。公開 entrypoint は `packages/patterns/src/index.ts`、React consumer facade は `packages/react/src/index.ts` とする。
- Boundary decision: Pattern は Component、state transition、error/recovery、responsive/a11y compositionだけを持ち、fetch、cache、route、permission、persistence、analytics は example/consumer adapterへ委譲する。Data management は Table と DataGrid の役割境界を維持し、Responsive navigation は既存の TopNav、SideNav、Drawer を再利用する。
- Tests: `pnpm --filter @depo-ui/patterns typecheck`、`pnpm --filter @depo-ui/patterns build`、`pnpm --filter @depo-ui/patterns test`（60 files、84 tests）、`pnpm test:visual -- patterns.spec.ts`（3 browser tests）を通過した。Pattern 固有では recoverable form、search/filter result state、list/detail selection、data grid composition、error recovery、navigation reflow、axe、forced colors、reduced motion を確認した。
- Lifecycle: 全 Pattern は `Trial`。Production usage、owner、manual screen-reader evidence、API/A11y/Figma parity を含む Stable gate は Governance の条件を満たすまで変更しない。catalog のうち未実装の13 Patternは仕様先行であり、実装済みとは表示しない。
- Known limitations: Pattern source は主要6 Patternに限定し、残りの catalog は仕様と docs input を提供する。実際の server state、URL、authorization、analytics、data adapter は Consumer の責任である。Browser automation は Chromium、screen-reader evidence と multi-browser matrix は後続 Phase の対象とする。
- Commit: `feat(phase-6): implement patterns`
- Blocked items: なし。

## 13. Content Design

Content は visual styling と同じく Design System の一部として扱う。正式な文言原則は specs/content/、人間向けの例は apps/docs/content/content-design/、locale/number/date の実装は @depo-ui/utilities に置く。

### 13.1 Writing rules

- Button label は目的の動詞を使う。Save、Create、Remove、Retry のように結果が分かる名前にし、OK、Submit、Click here を既定にしない。
- Label は何を入力するかを明示し、placeholder を label の代わりにしない。Description/help は format、例、制約、privacy を補う。
- Error は「何が問題か」+「どう直すか」を短く書く。分からない原因を作らず、技術用語、責任をユーザーに押し付ける表現、不要な please/sorry を避ける。
- Warning は将来のリスク、Error は既に起きた問題、Success は完了した結果を表す。色と icon だけで区別しない。
- Empty は初回データなし、filter 結果なし、error/permission で見えないを区別し、次の action を一つ以上示す。
- Confirmation は action、対象、影響、不可逆性、cancel を明記する。破壊的 action では安全な選択肢を default focus にすることを検討する。
- Loading は待ち時間の意味を示し、spinner だけで長時間の処理を隠さない。完了/失敗を status message で伝える。
- Capitalization は sentence case を基本とし、Component 名、proper noun、code は保持する。翻訳で大文字規則を固定しない。
- Truncation は視認性のためだけに使用し、重要な情報を ... に隠さない。full value を accessible name、details、copy、responsive reflow のいずれかで取得できるようにする。

### 13.2 Localization

- Intl.DateTimeFormat、Intl.NumberFormat 等を utilities/formatting で薄く包み、locale、timezone、numbering system を Consumer が指定できるようにする。
- Date、Time、Number、Currency、Percentage、Relative time は locale に依存し、文字列を Component 内で組み立てない。
- CJK では不自然な単語分割、line-height、縦方向の密度を検証する。英語長文だけで overflow を判断しない。
- RTL は dir と logical CSS properties で対応する。Icon の向き（戻る、進む等）は dir に応じて変えるが、意味のない icon は反転しない。
- 翻訳される label、error、empty、confirmation を固定幅にしない。Pseudo-localization と long-string fixture を CI の一部にする。

## 14. Accessibility

最低基準を **WCAG 2.2 AA** とし、Level A/AA の Success Criterion を full page と Component の両方で扱う。自動 Axe scan は補助であり、手動の Keyboard、Screen reader、Visual、Human review を置き換えない。

### 14.1 共通要件

- Native semantic HTML を第一候補とし、Accessible name、role、state、value、change notification が programmatically determinable であること。
- Tab/Shift+Tab、Enter、Space、Arrow、Home/End、Escape、typeahead、Ctrl/Cmd ショートカットを Component Contract に明記する。
- :focus-visible の focus indicator は背景と 3:1 以上の non-text contrast を持ち、2px 相当以上を基本とする。focus が sticky header、drawer、toast、modal に隠れないことを確認する。
- Text contrast は通常文字 4.5:1 以上、大きな文字 3:1 以上、UI component/graphical object は 3:1 以上を目標にする。Disabled、decorative、logo の例外を通常 state に流用しない。
- 色だけで status、selection、error、required、disabled を伝えない。文言、shape、icon、pattern、border の少なくとも一つを併用する。
- Target size は WCAG 2.2 の 2.5.8 を満たし、touch density では 44px 以上の hit target を優先する。視覚的な icon が 20px でも、操作領域は別に設計できる。
- aria-live、role="status"、role="alert" は通知の重要度に応じて使い分ける。Toast、Loading、validation は focus を奪わずに通知できるようにする。
- Forced colors では system color、visible border、forced-color-adjust を検証する。shadow、gradient、opacity に意味を依存しない。
- prefers-reduced-motion で非本質的な transition/animation を短縮または無効化する。時間制限、状態理解、操作結果を損なわない。
- 200% text resize、400% zoom 相当の 320 CSS px reflow を確認する。Data table の二次元 scroll が意味上必要な場合は、個別 cell の情報と操作に別の reflow/詳細手段を用意する。
- CJK、RTL、長い文字、複数行 label、locale 変更を Test matrix に含める。

### 14.2 手動確認マトリクス

Stable 前に、最低限 Windows の NVDA + Chromium、macOS の VoiceOver + Safari、主要ブラウザの Keyboard/Zoom を確認する。JAWS、TalkBack、追加ブラウザは対象 Consumer とリスクに応じて拡張する。Manual result は testing/accessibility/ の checklist として保存し、自動テスト pass を WCAG 達成の証明と混同しない。

### 14.3 Component Contract への組み込み

各 Component の specs/components/**/*.json に semanticHtml、aria、keyboard、focus、screenReaderNotes、wcag、manualChecks を必須フィールドとして持たせる。A11y が未記載の Component は Proposal/Trial から Stable に昇格できない。

## 15. Responsive / Adaptive Design

### 15.1 判断の優先順位

1. Content の意味と最小可読幅。
2. Component が入る Container の実効 inline size。
3. Input method（keyboard、pointer、coarse touch、hover の有無）。
4. Density と hit target。
5. Navigation hierarchy と pane の関係。
6. Viewport width は app shell の fallback breakpoint として最後に使う。

### 15.2 Adaptive modes

Component の public API に breakpoint="md" を乱立させない。内部では container query と named mode を使う。

- narrow: single column、折り返し、stack、overlay/temporary navigation。
- regular: 2 pane、persistent navigation、主要 action と overflow の分離。
- expanded: 12-column、list + detail + supporting pane、permanent navigation。
- wide: max content width と余白を増やすが、内容を過度に引き伸ばさない。

実装上の container threshold は Phase 2 で測定し、初期候補として 480、640、768、1024、1280 CSS px を使う。これらは public design decision ではなく、content minimum と fixture によって変更できる内部 token である。

### 15.3 Shell と pane

- Side navigation は available space があると permanent/persistent、狭い場合は temporary Drawer/Menu に transform する。
- List-detail は narrow では一度に一つの hierarchy、regular 以上では同時表示を候補にする。戻る操作、selection、focus return を失わない。
- Table/DataGrid は狭い画面で無理に全列を縮めない。priority column、column chooser、row detail、accessible alternate view、必要な二次元 scroll を組み合わせる。
- Dialog は width ではなく内容の最小幅、form action、keyboard、zoom で決める。narrow では full-screen/Drawer への transform を許可する。
- @media (pointer: coarse)、hover: hover、prefers-reduced-motion を必要な場合に使い、device 名で分岐しない。

### 15.4 Density と responsive の関係

compact は desktop の data-heavy 操作、comfortable は標準、touch は coarse pointer/タブレット/アクセシビリティ優先の候補である。Viewport が狭いから必ず compact にする、とはしない。Touch では視覚的に compact な表でも hit target は維持する。

## 16. Motion

Motion は状態、階層、因果関係を補助するが、意味を一つも Motion に預けない。

### 16.1 Token

- duration.instant=0ms、fast、normal、slow、long を候補とする。具体値は Phase 2 で usability test と prefers-reduced-motion を通して確定する。
- easing.standard、enter、exit、emphasized を用意し、Component が独自 cubic-bezier を作らない。
- hover は短く、press は即時、enter/exit は surface の距離と役割に応じて調整する。

### 16.2 Component behavior

- Popover/Menu は位置、scale/opacity、focus target の関係を壊さず enter/exit する。
- Dialog/Drawer は overlay、panel、focus trap、close の順序を安定させる。Exit animation 中に操作を受け付けない。
- Loading は spinner/skeleton の animation がなくても pending と進捗が分かる。ProgressBar は数値/label を併記できる。
- Reduced motion では transition を instant または opacity を含まない最小変更にし、auto-play、parallax、continuous shimmer を止める。
- Animation の Test は duration に依存せず、最終 state、aria、focus、DOM order を確認する。

## 17. Icon System

### 17.1 Catalog と命名

canonical ID は category.name とし、Figma の asset、JSON metadata、React export、Docs、deprecation map で一致させる。React の初期 export は AddIcon のように生成するが、mapping の canonical name は actions.add とする。

カテゴリは actions、navigation、status、objects、system。Icon の追加には用途、既存 Icon との差、RTL、filled/outline、accessibility を記録する。

### 17.2 Visual/technical rules

- viewBox は 24×24 を基準、stroke は currentColor、default size は 20 または 24 の token とする。stroke width は 1.75〜2 の契約候補を検証し、Icon ごとに勝手に変えない。
- size は sm、md、lg、xl の token に紐づける。Icon の見た目サイズと Button/IconButton の hit target を分離する。
- 隣接 label がある場合は aria-hidden="true" を default とする。Icon 単体では aria-label または visible label を必須にし、tooltip だけを accessible name にしない。
- 複数色、embedded text、Product ロゴを Core Icon に入れない。ロゴは別の brand asset とする。
- Metadata は name、category、size、stroke、directional、decorativeDefault、deprecated、replacement、license を持つ。

## 18. Figma Architecture

### 18.1 Source and parity

Repo の DTCG JSON と Component Metadata を canonical source とし、Figma はそれを利用する Design surface とする。Figma 側にのみ存在する色、spacing、variant、component state、secret value は作らない。

Figma と Code で一致させるもの:

~~~text
Token
Component
Variant
Size
Tone
State
Property
Lifecycle
~~~

### 18.2 Figma tree

~~~text
figma/
├─ variables/
│  ├─ collections.json
│  ├─ modes.json
│  └─ export-manifest.json
├─ components/
│  ├─ actions.json
│  ├─ forms.json
│  └─ data-display.json
├─ mapping/
│  ├─ tokens.json
│  ├─ components.json
│  ├─ properties.json
│  └─ exceptions.json
└─ sync/
   ├─ README.md
   ├─ pull-plan.json
   └─ push-plan.json
~~~

### 18.3 Variables

- Collection は Reference、Semantic、必要な場合のみ Component に分ける。Theme mode は dark、light、high-contrast とし、Code の Theme 名と一致させる。
- Designer が通常使うのは Semantic と Component の公開された role。Reference は inspect/maintenance 用であり、Product UI の設計で直接選ばない。
- Figma variable name は color/bg/canvas、space/control/inline のように slash-separated にし、JSON path と mapping/tokens.json で一対一に対応させる。自動変換で名前が推測されないよう mapping を保存する。
- Figma Component set は Button、TextInput 等の canonical Component name、properties は variant、size、tone、state、disabled 等の canonical name を使う。Code の prop と Figma property を別名にしない。

### 18.4 Sync workflow

1. PR で JSON Token/Metadata を変更する。
2. Token build が CSS/TS/manifest を生成し、schema、alias、contrast、theme completeness を検証する。
3. Figma sync は mapping と manifest に従い、差分 preview を生成する。
4. 承認された PR のみ Figma Variables REST API または Plugin API で push する。Figma 側の publish が必要な場合は明示的な step とする。
5. pull は read-only parity check として利用し、Figma 変更を自動で repo に上書きしない。意図的な Figma 変更は PR と ADR を経て JSON に反映する。
6. Figma snapshot を pull し、Code/Metadata と比較して extra/missing/renamed variable、mode、property、variant を CI で報告する。

Figma Variables REST API は利用プラン、Full seat、権限、scope の制約があるため、初期同期は repo→Figma を主経路にする。Enterprise API が使えない環境には同じ mapping を読む Plugin API の手動実行を fallback として用意する。Access token、file key、CI secret は repository に置かない。ID は秘密でない mapping 情報と credential を分離する。

## 19. Documentation Architecture

### 19.1 3つの役割

- specs/: 正式な仕様。何が正しいか、どういう理由か、どう変更するかを記録する。
- apps/docs/: 人間が読む公式サイト。Getting Started、Foundations、Components、Patterns、Accessibility、Content Design、API、Examples、Releases、Migration Guide を表示する。
- docs/: リポジトリの architecture、contributing、operations、生成 pipeline、Codex 向けの補助案内を置く。

### 19.2 Single-source publishing

Component Metadata JSON から、Docs の次の部分を生成する。

- Purpose、Anatomy、Lifecycle、Variants、Sizes、Tones、States、Props、Events の reference table。
- Keyboard、ARIA、Responsive、Density、Theme、Loading、Error、Recovery、Test matrix。
- Figma mapping、Token usage、Story link、Visual fixture link。

人が編集する MDX/Markdown は、使い方、理由、例、Content guidance、Migration narrative に限定する。生成セクションには marker を付け、手編集との差分を CI で検出する。

Docs build は specs/、Metadata、generated token manifest、Stories を読む。Docs の表示用に別の Component contract を作らない。サイトの navigation と editorial order は apps/docs に置いてよいが、仕様の値を二重管理しない。

## 20. Testing Strategy

### 20.1 Component-level tests

Component folder に co-locate し、実装の変更理由と同じ場所で更新する。

| 種類 | 主な場所 | 確認すること |
|---|---|---|
| Unit | *.test.tsx、testing/unit/ | render、props、controlled/uncontrolled、純粋な state reducer |
| Interaction | Story play、Vitest browser mode | click、type、select、open/close、submit、retry、cancel |
| Keyboard | *.test.tsx / testing/interaction/ | Tab order、Arrow、Home/End、Escape、typeahead、shortcut |
| Accessibility | *.a11y.test.tsx、testing/accessibility/ | Axe、name/role/state/value、label/error relation、focus/announcement |
| Visual | *.visual.tsx、apps/visual-tests/ | Theme、Variant、State、Density、long text、container width |
| Story | *.stories.tsx | Contract 上の全状態を再現可能な fixture として保持 |

### 20.1.1 Ref contract tests

- React 19+ の Component test は、Function Component に ref を通常の prop として渡し、Contract が公開する対象 DOM node または限定 handle だけが返ることを確認する。
- React 18 を support range に含める場合は、Phase 0 で決めた compatibility layer、entrypoint、adapter を通る test を追加する。forwardRef を全 Component に機械的に適用したことを合格条件にしない。
- DOM node を公開しない Component は ref の absence も test し、useImperativeHandle を使う場合は focus、scroll、selection 等の props では表現できない操作だけを許可する。

### 20.2 System-level tests

- Token schema、alias graph、theme completeness、contrast、raw value lint、generated freshness。
- Package graph、exports、cycle、build order、未公開 deep import。
- Playwright の browser matrix、responsive/reflow、forced colors、reduced motion、RTL、CJK、long text。
- Docs link、生成 marker、metadata-to-story、metadata-to-Figma parity。
- examples/consumer-fixture で build 済み package を registry/packed tarball として install し、public API、peer dependency、CSS import を検証する。
- Release smoke test で changeset version 前後の internal dependency と export を確認する。

### 20.3 Stable Component minimum matrix

Stable Component は最低限、次を確認してから昇格する。

~~~text
Keyboard
Focus
Accessibility
Dark
Light
High Contrast
Reduced Motion
Responsive / Container query
Long Text / CJK / RTL
Visual Regression
~~~

DataGrid、Tree、Combobox、Dialog のような複雑な Component は、screen reader の manual matrix、focus recovery、virtualization/large data performance、error/retry も追加する。

### 20.4 Baseline policy

Visual baseline は CI の固定 browser/container image で生成する。Playwright の screenshot は同じ OS、browser version、font、color profile で比較する。Baseline の更新は Snapshot diff、理由、reviewer の承認を必須にし、update-snapshots の無条件実行を禁止する。

## 21. Tooling

### 21.1 技術選定

| 領域 | 採用案 | 採用理由 | 代替・交換方法 |
|---|---|---|---|
| Package manager / workspace | pnpm workspace、workspace: protocol、catalog | workspace を標準で持ち、strict dependency、catalog による version 一元化ができる | npm workspaces / Yarn に移す場合、Package manifest と task script の境界を保つ |
| Monorepo task runner | Turborepo | package/task graph、parallelism、local/remote cache、段階導入ができる | Nx、Moon。task script と package graph を標準形に保ち、runner を交換可能にする |
| Language | TypeScript、strict、ESM | Props、Token schema、Metadata、generator の型安全性と AI 可読性 | JS でも public contract は JSON Schema と .d.ts で維持 |
| App/library build | Vite、library mode、TypeScript declaration build | browser app と library の開発体験を揃え、公開 entry を明示できる | Rollup、tsdown。package の exports と CSS artifact を契約にする |
| Styling | CSS Custom Properties + build-time typed styles | Theme、semantic token、SSR、runtime performance、state selectors に向く | CSS Modules。Component から compiler API を隠す |
| Unit/component runner | Vitest（Node + browser mode）、Testing Library、user-event | Vite と同じ transform、browser の実 DOM interaction を扱える | Jest。テスト API を薄い testing/ wrapper に分離 |
| Browser E2E / visual | Playwright Test | multi-browser、keyboard、screenshot、forced-color/emulation を一つにまとめる | Cypress。E2E fixture と page object の境界を維持 |
| Component explorer | Storybook React + Vite | Stories を docs、interaction、a11y、visual の入力として再利用できる | Ladle。CSF/portable story を孤立させない |
| Accessibility | axe-core、Storybook a11y、Playwright integration + manual review | 自動で common issue を早期検知し、手動検証を補助する | jest-axe 等。Axe pass を WCAG 達成の証明にしない |
| Documentation | Docusaurus/MDX を採用 | React component の例、version、i18n、検索を扱いやすい | Astro Starlight、Storybook Docs。生成 layer と content layer を分離 |
| Lint | ESLint flat config、typescript-eslint、import boundary、Stylelint、Markdown lint | code/style/CSS/Markdown のルールを用途別に機械検査する | Biome。raw token rule と dependency rule の portability を確認 |
| Formatting | Prettier | TS/JSON/MD/YAML の共通整形、editor/CI が多い | Biome formatter。format と lint の責任を混ぜない |
| Token build | DTCG validator + custom normalizer/resolver/renderer | DTCG の tier/theme/component policy、contrast、Figma mapping を明示的に制御できる | Style Dictionary。DTCG adapter を tooling/token-build の入出力境界に置く |
| Generator | custom CLI + templates、schema driven | Component の同じ file set、Metadata、Test stub を強制できる | Plop/Hygen。template engine を CLI から分離 |
| Release | Changesets | monorepo の package version、internal dependency、changelog を意図ベースで扱える | Release Please、Rush。semver/change intent の metadata を失わない |
| Migration | TypeScript AST の codemod（ts-morph/jscodeshift 相当） | prop rename、token rename、deprecated API を安全に移行できる | 手動 migration。breaking change では codemod を優先 |

バージョンは実装時に公式の current stable/active LTS を確認し、根幹となる Node、pnpm、React、Vite、Storybook、Playwright、TypeScript は package.json、lockfile、ADR に固定する。古いバージョンの例を PLAN から機械的にコピーしない。

### 21.2 Planned commands

Phase 0 で root script を次の語彙に揃える。実際の flags は採用 tool の current docs に合わせる。

~~~text
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
pnpm lint:tokens
pnpm lint:raw-values
pnpm lint:deps
pnpm test
pnpm test:a11y
pnpm test:visual
pnpm test:e2e
pnpm tokens:build
pnpm tokens:check
pnpm generate component --name Button --category actions
pnpm docs:generate
pnpm figma:check
pnpm changeset
pnpm release:check
~~~

Component generator の category 解決先は packages/components/src/<category>/<Component>/ とする。たとえば Button の出力は packages/components/src/actions/Button/、spec は specs/components/actions/button.json と button.md、Figma mapping は figma/mapping/components.json になる。packages/components/package.json など Package root の管理ファイルは generator の Component output に含めない。

### 21.3 Raw value lint

Product-facing code で color: #6C6FF6、padding: 13px、border-radius: 5px 等を直接書いた場合、CI で検出する。

- CSS は Stylelint custom rule/PostCSS parser、TS/TSX は ESLint custom rule/AST checker で検出する。
- 許可される raw value は packages/tokens/src/reference/、色の contrast fixture、browser reset、第三者 CSS の隔離 adapter などの path allowlist に限定する。
- generated/ は source のために編集しない。generated output 内の raw value は build artifact として検査対象外にするが、生成元の alias policy を検査する。
- 例外は inline comment の自由入力で解除せず、tooling/raw-value-allowlist.json に path、reason、owner、expiry、issue/ADR を記録する。期限切れは fail。
- Semantic Token の CSS variable を優先し、Component Token は *.tokens.ts の local alias だけで使う。

## 22. Governance

### 22.1 Lifecycle

| Status | 意味 | 利用条件 / 変更ルール |
|---|---|---|
| Proposal | アイデアまたは設計提案 | RFC、目的、既存との差、Owner、A11y/Content/Responsive の初期検討を持つ。公開 API ではない |
| Trial | 実装済みだが学習中 | docs に Trial と表示し、breaking change を許容。少なくとも一つの実験 Consumer とフィードバック計画を持つ |
| Stable | 長期利用を推奨する契約 | 22.2 の全 review、test、Figma/Code parity、Production usage、Owner を満たす。semver の breaking policy を適用 |
| Deprecated | 後継があり、廃止予定 | replacement、理由、codemod/migration、warning、期限を示す。Minor release で告知し、少なくとも二つの release window を置く |
| Removed | 公開面から削除済み | deprecation window、利用調査、migration、release note、major release（security/emergency を除く）を完了 |

Lifecycle は specs/components/**/*.json、Figma metadata、Docs badge、package export、Changeset の名前を一致させる。Status を Code のコメントだけに置かない。

### 22.2 Stable gate

Stable への昇格には最低限、次を checklist として全て記録する。

- Design review
- API review
- Accessibility review
- Keyboard test
- Screen reader test
- Responsive review
- Theme review（Dark / Light / High Contrast）
- Reduced motion review
- Localization review（Long text / CJK / RTL を含む）
- Visual regression
- Figma / Code parity
- Production usage（最低一つの実 Product の継続利用。重要度の高い Component は二つ以上の独立した workflow を推奨）
- Owner（Design と Engineering の primary/backup）

Production usage は Component が少なくとも一つの実 Product、複数の代表 workflow、または明示された pilot に一定期間使われ、未解決の P0/P1 usability/accessibility issue がないことを evidence link で示す。数字だけで Stable にせず、利用文脈と既知の制約を記録する。

### 22.3 Contribution workflow

1. Issue/RFC で user need、既存 catalog、Pattern、A11y、Content、Responsive を調査する。
2. component-generator で Metadata、spec、実装、story、test の骨格を作る。
3. Design/API/A11y/Content owner がレビューする。
4. CI が token、dependency、unit、a11y、visual、docs、Figma parity を確認する。
5. Trial として pilot に出し、feedback、usage、error/recovery を記録する。
6. Stable gate を満たしたら Changeset と lifecycle metadata を更新する。

CODEOWNERS では tokens、a11y、data components、Figma、governance を分け、該当 domain の reviewer がいない PR は merge できないようにする。

## 23. AGENTS.md Strategy

root AGENTS.md は Codex/AI と人間のための入口であり、百科事典にしない。目標は約 100 行前後の短い地図で、詳細は specs/、docs/、README、Package README、Metadata、commands に置く。

最低限、次を案内する。

~~~text
Repository purpose
Architecture overview
Important directories
Dependency rules
Commands
Testing rules
Generated files
Documentation locations
Important constraints
~~~

具体的な記載方針:

- Phase 0 では PLAN.md を roadmap として指し、Phase 完了後は specs/ と docs/architecture/ を現在の Source of Truth として指す。
- 「変更前に読むもの」「変更後に実行するもの」「生成ファイルは直接編集しない」「raw value を追加しない」「accessibility を省略しない」を短く列挙する。
- root commands と Package filter の例、必要な Node/pnpm version、環境変数の名前だけを示す。secret の値は書かない。
- Component を追加するときは specs/components、Generator、Story/Test、Figma mapping、Changeset の順に確認するよう link する。
- 詳細な色、API、ARIA pattern、lifecycle 条件を AGENTS.md に重複させない。規則が変わったときに一箇所だけ更新できるようにする。
- サブツリーに特殊な手順が必要になった場合だけ、短い scoped AGENTS.md を置く。深い入れ子と矛盾する指示は避ける。

AGENTS.md の更新は、Architecture/command/dependency rule の変更と同じ PR で行う。実際のコマンドが通らない案内を残さないため、CI で root に記載した必須 command の smoke test を行う。

## 24. Implementation Phases

各 Phase は、依存する Exit criteria を満たしてから次の主実装へ進める。並行作業を許可する場合は各 Phase の Dependencies に明記する。Phase 7 の Accessibility infrastructure は「A11y を初めて追加する Phase」ではない。Phase 3、Phase 4A、Phase 4B、Phase 4C から各 Component に A11y Contract と Test を入れ、Phase 7 では共有基盤、manual matrix、監査、性能を強化する。

### 24.0 Implementation order and dependency graph

主実装の順序は次のとおりとする。

Phase 0 → Phase 1 → Phase 2 → Phase 3 → (Phase 4A + Phase 4B) → Phase 4C → Phase 5 → Phase 6 → Phase 7 → Phase 8 → Phase 9 → Phase 10

Phase 4A と Phase 4B はどちらも Phase 3 の後に開始できる。Phase 4C は、Basic Component と Overlay Infrastructure のうち、各 Component が実際に使うものだけに依存する。Phase 5 は Phase 4A、Phase 4B、Phase 4C の実装済み基盤を前提にする。Phase 6 は Phase 4C を前提にし、Advanced Component を使う Pattern だけ Phase 5 にも依存する。Phase 7 の shared infrastructure は Phase 3 以降で段階的に強化できるが、Stable gate 用の総合監査は Phase 4A〜4C と Phase 5 の対象実装が揃ってから行う。Phase 8 以降は、前段の Source、Metadata、Test artifact が存在する範囲で進める。

### Phase 0 — Repository Foundation

**Goal**

空 repo を安全な workspace、依存 graph、CI、AGENTS の入口にする。

**Dependencies**

なし。

**Files / directories**

Root の package.json、pnpm-workspace.yaml、pnpm-lock.yaml、turbo.json、TypeScript/ESLint/Prettier/Stylelint/Vitest/Playwright の設定、.github/、AGENTS.md、README.md、target tree の最小 skeleton、docs/architecture/、governance/、specs/decisions/。

**Tasks**

- Active LTS の Node version、pnpm version、React support range、ref compatibility strategy、npm scope、license、browser support を一緒に決めて ADR 化する。React 19 を使う場合の ref-as-prop、React 18 を含める場合の compatibility layer/entrypoint/adapter の境界をここで確定し、React 19 only をこの PLAN だけで先に決めない。
- pnpm workspace と catalog、Turborepo task graph、strict TypeScript、ESM、Package exports の雛形を作る。
- dev/build/typecheck/lint/test の root command と CI matrix を用意する。
- folder boundary、generated policy、dependency rule、raw value policy、PR template、CODEOWNERS の初期版を作る。
- Package/Apps の空の entrypoint は実装せず、Phase 1 以降の作業場所と public export 境界だけを定義する。

**Tests**

- clean checkout で install、typecheck、lint、test、build の smoke test。
- workspace cycle、package exports、root command、Node/pnpm version の検査。React 19 の direct ref prop、ref を公開しない Component、選択した React 18 compatibility strategy（該当する場合）の smoke test も行う。

**Exit criteria**

別の Codex session が AGENTS.md と README.md だけを読み、正しい command と Phase 1 の Source files を特定できる。CI が空の repo で再現可能に動き、packages の依存方向ルールが machine-checkable である。

**Phase status**

- Status: Completed
- Tests: `pnpm install --frozen-lockfile`、`pnpm format:check`、`pnpm lint:deps`、`pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build`、`pnpm test:a11y`、`pnpm test:visual`、`pnpm test:e2e`
- Commit: `feat(phase-0): implement repository foundation`
- Known limitations: Feature source、token values、real build artifacts、visual fixtures、manual screen-reader evidenceは後続Phaseで追加する。
- Blocked items: なし。

### Phase 1 — Tokens

**Goal**

DTCG JSON を Source of Truth とする Reference/Semantic/Theme、生成 CSS/TS、schema/contrast/lint を確立する。

**Dependencies**

Phase 0。

**Files / directories**

packages/tokens/src/reference/、semantic/、themes/、generated/、tooling/token-build/、tooling/token-lint/、specs/foundations/color.md、specs/decisions/ADR-001-token-architecture.md、ADR-005-color-palette.md。

**Tasks**

- DTCG 2025.10 の schema/normalizer を用意し、tier、type、description、extension、alias の validation を実装する。
- Depo UI の supplied color anchor を入力し、light neutral、focus、status text、overlay、system color の追加理由と mapping を記録する。
- dark/light/high-contrast の semantic matrix を作り、missing role、contrast、forced-color の検証を追加する。
- CSS/TS/ES module runtime/d.ts/manifest を生成し、generated freshness check と raw value lint を有効にする。

**Tests**

- valid/invalid JSON、unknown alias、cycle、type mismatch、theme missing、duplicate name。
- text/non-text contrast、status、focus、surface の全 Theme matrix。
- CSS variable naming、TS type export、generated diff、DTCG round-trip。

**Exit criteria**

Product から Reference を直接 import できず、Semantic Token が全 Theme で解決する。指定色が変更されず、追加色は理由と test を持ち、generated file を再生成しても diff がない。

**Phase status**

- Status: Completed
- Tests: pnpm tokens:build、pnpm tokens:check、pnpm lint:tokens、pnpm lint:raw-values、pnpm lint:deps、pnpm format:check、pnpm lint、pnpm typecheck、pnpm test、pnpm build
- Commit: feat(phase-1): implement token architecture
- Known limitations: Component Token、Foundation、React/Component source、Figma Variables、visual/manual forced-colors evidenceは後続Phaseで追加する。High Contrast の system color は browser test で検証する。
- Blocked items: なし。

### Phase 2 — Foundations

**Goal**

Typography、Spacing、Sizing、Radius、Border、Elevation、Layout、Grid、Responsive、Density、Motion、Icon rules を Token と Spec にする。

**Dependencies**

Phase 1。

**Files / directories**

tsconfig.base.json、packages/foundations/src/、packages/foundations/tsconfig.json、packages/foundations/tsconfig.build.json、tooling/foundation-build/、specs/foundations/、packages/tokens/src/reference/・semantic/ の非色ファイル、testing/foundations.test.mjs、apps/visual-tests/tests/foundations.spec.ts、specs/decisions/ADR-002-spacing-scale.md、ADR-003-density-model.md。

**Tasks**

- 4px scale と 2px hairline、control sizing、radius/border/elevation/layer を確定する。
- font stack、type scale、line-height、CJK/RTL fallback、logical layout property を定義する。
- data-density、Theme root、Direction、Layer、container query、shell fallback breakpoint の contract を作る。
- motion token と reduced-motion stylesheet を設計する。
- Foundation CSS/APIをpackages/foundations/src/に実装し、semantic variableだけを参照する。Iconographyの命名、size、stroke、RTL、accessibility規則をspecs/foundations/iconography.mdに記録する。

**Tests**

- token reference が semantic role に正しく解決する。
- 320 CSS px/400% zoom、200% text resize、RTL、CJK、long text、forced colors、reduced motion。
- density と touch hit target の visual/interaction fixture。

**Exit criteria**

すべての Core Component が利用する最小 Foundation contract と CSS/API が文書化され、arbitrary value がなく、Responsive/Density/Motion の Test harness が使える。

**Phase status**

- Status: Completed
- Tests: pnpm tokens:build、pnpm tokens:check、pnpm --filter @depo-ui/foundations typecheck、pnpm --filter @depo-ui/foundations test、pnpm --filter @depo-ui/foundations build、pnpm lint:tokens、pnpm lint:raw-values、pnpm lint:deps、pnpm format:check、pnpm lint、pnpm typecheck、pnpm test、pnpm build、pnpm test:visual
- Commit: feat(phase-2): implement foundations
- Known limitations: React/Component source、real component visual fixtures、Figma Variables、manual screen-reader evidenceは後続Phaseで追加する。Foundation browser fixtureはChromiumで検証済みで、他browserのmatrixとmanual evidenceは後続Phaseで拡張する。turboのplaceholder packageはdistをまだ出力しないため、root buildでは後続Phaseまでoutput warningが残る。
- Blocked items: なし。

### Phase 3 — Primitives

**Goal**

再利用可能な layout/typography/accessibility building blocks を小さく実装する。

**Dependencies**

Phase 1、Phase 2。A11y minimum helper はこの Phase で先に実装する。

**Files / directories**

packages/primitives/src/、packages/primitives/tsconfig.json、packages/primitives/tsconfig.build.json、packages/accessibility/src/ids/・focus/、packages/accessibility/tsconfig.json、packages/icons/src/、packages/icons/tsconfig.json、tooling/primitives-build/、testing/primitives.test.tsx、testing/fixtures/foundation-styles.mjs、apps/visual-tests/tests/primitives.spec.ts、specs/components/primitives/。

**Tasks**

- Box、Stack、Inline、Cluster、Grid、Container、Center、Split、Sidebar、Text、Heading、Icon、Divider、VisuallyHidden を作る。
- DOM semantics、logical props、slot、as の許可範囲、data attribute を定義する。
- useId、focus-visible detection、description/error ID、initial focus の最小 utility を作る。
- React 19 ref-as-prop の型契約を保ち、公開対象が明確なPrimitiveだけがDOM refを受け取る。Iconの命名、metadata、decorative/meaningful semanticsも同じ契約で公開する。

**Tests**

- HTML semantics、heading order、Component Contract で宣言した ref、layout wrapping、RTL、container query、density。
- keyboard/focus、axe、forced colors、long text、SSR/hydration smoke。

**Exit criteria**

Primitive が business state を持たず、Component の全カテゴリーが同じ layout/typography/focus contract を使える。Primitive の public API に Product 固有名がない。

**Phase status**

- Status: Completed
- Tests: pnpm tokens:build、pnpm tokens:check、pnpm --filter @depo-ui/accessibility typecheck、pnpm --filter @depo-ui/accessibility build、pnpm --filter @depo-ui/icons typecheck、pnpm --filter @depo-ui/icons build、pnpm --filter @depo-ui/primitives typecheck、pnpm --filter @depo-ui/primitives build、pnpm lint:raw-values、pnpm lint:deps、pnpm format:check、pnpm lint、pnpm typecheck、pnpm test（12 tests）、pnpm test:a11y、pnpm test:visual（7 tests）
- Commit: feat(phase-3): implement primitives
- Known limitations: SSR/hydration smokeはhappy-dom、browser fixtureはChromiumのstatic markupとaxeで検証済み。Safari/Firefox、実ブラウザhydration、手動screen reader、全Icon catalog、Component固有のStory/Testは後続Phaseで拡張する。placeholder packageのroot build output warningは後続Phaseまで残る。
- Blocked items: なし。

### Phase 4A — Basic Controls

**Goal**

基本的な Action、Form、Feedback、Data Display を作り、Primitive + Foundation + Basic Component だけで一般的なフォームや情報表示を組める状態にする。低い interaction complexity と明確な native semantics を持つ Component を先に完成させる。

**Dependencies**

Phase 3。

**Files / directories**

packages/components/src/actions/、packages/components/src/forms/、packages/components/src/data-display/、packages/components/src/feedback/、specs/components/、testing/unit/、testing/interaction/、testing/accessibility/、examples/consumer-fixture/。

**Tasks**

- Button、IconButton、Link。
- Field、TextInput、Textarea、NumberInput、Checkbox、CheckboxGroup、Radio、RadioGroup、Switch、DateInput、SearchField。
- Badge、Tag、Avatar、Card、List、Table、Stat、KeyValue、Code、Kbd。
- InlineMessage、Banner、Spinner、ProgressBar、Skeleton、EmptyState、ErrorState。
- Component generator で packages/components/src/<category>/<Component>/ の同じ file set、Metadata、Story、Test の骨格を作る。
- common props、state precedence、loading/error/recovery、content rules、ref 公開条件を個別 Contract に落とす。

Table は semantic table/thead/tbody/th/td/caption を中心とする static data display であり、二次元の keyboard navigation、editing、virtualization を持たないため Phase 4A に置く。SearchField と DateInput は overlay を必要としない基本入力として扱い、locale/IME/error Contract はこの Phase で固定する。

**Tests**

- 各 Component の minimum matrix（Keyboard、Focus、Accessibility、Dark、Light、High Contrast、Reduced Motion、Responsive、Long Text、Visual Regression）。
- React 19 の ref-as-prop contract と、ref を公開しない Component に余計な ref API がないこと。React 18 を support range に含める場合は、Phase 0 で選んだ compatibility strategy の test を追加する。
- native semantics、screen-reader manual checklist、consumer fixture の public import。

**Exit criteria**

上記 Basic Component が Product-like fixture で組め、API review、A11y review、ref contract review を通過する。未成熟な Component は Trial のまま明示され、Stable と誤表示されない。

**Phase status**

- Status: Completed
- Implemented source: `packages/components/src/actions/`、`packages/components/src/forms/`、`packages/components/src/data-display/`、`packages/components/src/feedback/`。公開 entrypoint は `packages/components/src/index.ts`、React facade は `packages/react/src/index.ts` とする。
- Metadata: `specs/components/{actions,forms,data-display,feedback}/*.json`。Component generator は `tooling/component-generator/generate.mjs` から同一の source、styles、tokens、stories、visual、unit/a11y test skeleton を生成できる。
- Tests: `pnpm install --frozen-lockfile`、`pnpm tokens:build`、`pnpm tokens:check`、`pnpm lint:tokens`、`pnpm lint:raw-values`、`pnpm lint:deps`、`pnpm --filter @depo-ui/components typecheck`、`pnpm --filter @depo-ui/components test`（24 tests）、`pnpm test:a11y`（16 tests）、`pnpm test:visual -- components-basic.spec.ts`（3 tests）、`pnpm format:check`、`pnpm lint`、consumer fixture typecheck/build。
- Review evidence: native HTML semantics、React 19 ref-as-prop の型利用、Dark/Light/High Contrast の theme root、Reduced Motion、touch density、narrow viewport、long/CJK text、axe smoke、Table と DataGrid の役割境界を fixture で確認した。React 18 を support range に含める場合の compatibility test は Phase 0 の決定に従い、必要な場合だけ追加する。
- Lifecycle: 全 Phase 4A Component は `Trial`。Production usage、owner、API/A11y/Figma parity の Stable gate は Governance の条件を別途満たすまで変更しない。
- Commit: `feat(phase-4a): implement basic controls`
- Known limitations: browser test は Chromium、screen-reader evidence は manual checklist 前提、DateInput/SearchField は overlay を持たない基本入力、Table は static semantic table であり、advanced interaction は Phase 5 の DataGrid 等で扱う。
- Blocked items: なし。

### Phase 4B — Overlay Infrastructure

**Goal**

Menu、Select、Toast、Dialog などが共有する低レベルの Overlay Infrastructure を、責任の小さい utility と accessibility helper に分けて設計し、Popover、Tooltip、Dialog で実際に利用できる状態にする。

**Dependencies**

Phase 3。Phase 4A の完了は必須ではないが、既存の Foundation、Primitive、A11y minimum を再利用する。

**Files / directories**

packages/accessibility/src/focus/、packages/accessibility/src/keyboard/、packages/accessibility/src/ids/、packages/utilities/src/dom/、packages/foundations/src/css/、packages/components/src/overlays/Popover/、packages/components/src/overlays/Tooltip/、packages/components/src/overlays/Dialog/、specs/components/overlays/、testing/accessibility/、testing/interaction/。

**Tasks**

- FocusScope、FocusRestore、DismissableLayer、nested scope、inert background、Escape と outside interaction の小さな helper を packages/accessibility/src/ に置く。これらは focus、keyboard、assistive technology の意味を担い、見た目を持たない。
- Portal、scroll lock、stable layer id、positioning、collision detection の DOM/geometry helper を packages/utilities/src/dom/ に置く。これらは rendering/geometry の責任だけを持ち、ARIA semantics を決めない。
- Phase 2 で定義した z-index、layer、surface、motion の token/CSS は packages/foundations/ から再利用し、必要な overlay extension も同じ場所に置く。overlay の stack と visual hierarchy を一箇所で管理し、Component 側で arbitrary z-index を作らない。
- Popover は non-modal contextual content、Tooltip は補助情報、Dialog は modal task/confirmation として、異なる semantic、focus、dismiss、content Contract を作る。
- 巨大な OverlayManager は作らない。Portal、FocusScope、DismissableLayer、ScrollLock、Positioning、Layer、Motion を独立した責任として組み合わせる。

**Tests**

- nested overlay、Escape、outside interaction、focus enter、focus return、focus trap/scope、portal、scroll lock、layering。
- forced colors、reduced motion、screen reader、narrow viewport、exit animation 中の操作不可。
- Dialog の modal/inert、Popover の non-modal、Tooltip の accessible name と必須情報を隠さないこと。

**Exit criteria**

Popover、Tooltip、Dialog が shared infrastructure の各 helper を必要な範囲だけ利用し、nested overlay、focus、dismiss、portal、scroll、layer、forced colors、reduced motion、screen reader、narrow viewport の検証を通過する。Overlay 同士の責任が重複せず、後続の Select、Menu、Toast、Drawer が再利用できる public/internal boundary が決まる。

**Phase status**

- Status: Completed。Phase 4B の実装は `packages/accessibility/src/focus/`、`packages/utilities/src/dom/`、`packages/components/src/overlays/` に配置し、FocusScope、DismissableLayer、inert sibling、Portal、scroll lock、positioning/collision の責任を分離した。Popover、Tooltip、Dialog はそれぞれ non-modal contextual content、補助情報、modal task/confirmation の Contract を持ち、必要な helper だけを組み合わせる。
- Placement decision: FocusScope、focus restoration、DismissableLayer、Escape/outside interaction、inert background は assistive technology と keyboard/focus semantics を担うため `packages/accessibility/src/focus/` に置いた。Portal、scroll lock、geometry positioning は DOM/rendering の責任だけを担うため `packages/utilities/src/dom/` に置いた。Overlay の semantic component と surface/motion/z-index の tokenized CSS はそれぞれ `packages/components/src/overlays/` と `packages/components/src/css/index.css` に置き、arbitrary z-index や万能 `OverlayManager` は導入しない。
- Tests: `pnpm install --frozen-lockfile`、`pnpm tokens:build`、`pnpm tokens:check`、`pnpm lint:tokens`、`pnpm lint:raw-values`、`pnpm lint:deps`、`pnpm typecheck`、`pnpm build`、`pnpm test`（root 28 tests、workspace 24 tasks）、`pnpm test:visual`（13 browser tests）、`pnpm format:check`、`pnpm lint` が通過した。Overlay 固有では Vitest 4 tests、Playwright 3 tests、axe smoke、narrow viewport、forced colors、reduced motion、Escape/focus return、layering を確認した。
- Lifecycle: Popover、Tooltip、Dialog と shared overlay helpers は `Trial`。Production usage、owner、manual screen-reader evidence、API/A11y/Figma parity を含む Stable gate は Governance の条件を満たすまで変更しない。
- Known limitations: browser automation は Chromium、screen-reader evidence は manual checklist 前提、positioning は fixed geometry と基本 collision clamp、scroll lock/inert/focus scope は単一 document 境界を対象とする。Nested overlay の基盤は検証済みだが、Select、Menu、Toast、Drawer との実利用は後続 Phase 4C/5 で行う。
- Commit: `feat(phase-4b): implement overlay infrastructure`
- Blocked items: なし。

### Phase 4C — Composite Components

**Goal**

Phase 4A の Basic Component と Phase 4B の Overlay Infrastructure を組み合わせ、複数の state、keyboard model、responsive navigation を持つ Composite Component を作る。

**Dependencies**

Phase 4A。Popover、Menu、Select、Toast、SplitButton など Overlay Infrastructure を使う Component は Phase 4B にも依存する。Tabs、SegmentedControl、ToggleButton、Breadcrumbs、Pagination、Disclosure、Accordion のように Overlay を使わない Component は、Phase 4B の完了を待たずに必要な Phase 4A の依存だけで進めてもよい。

**Files / directories**

packages/components/src/actions/SplitButton/、packages/components/src/forms/Select/、packages/components/src/selection/、packages/components/src/navigation/、packages/components/src/feedback/Toast/、packages/components/src/disclosure/、specs/components/、testing/interaction/、testing/accessibility/、examples/。

**Tasks**

- Select は既知の選択肢の value selection、Menu は action list、MenuButton は Button + Menu の composition とする。
- Select、Menu、MenuButton、Tabs、SegmentedControl、ToggleButton、Toast、Breadcrumbs、Pagination、SideNav、TopNav、Disclosure、Accordion、SplitButton を実装・仕様化する。
- Select、Menu、MenuButton、Toast、SplitButton は必要な Overlay helper だけを利用し、Tabs 等に不要な Overlay dependency を追加しない。
- roving tabindex、selected/checked/expanded、open/close、toast queue、responsive navigation、single/multiple disclosure の state と recovery を個別 Contract に落とす。

**Tests**

- Basic Component と composition した API vocabulary、state model、keyboard、focus、accessibility、theme、density、responsive behavior。
- Menu/Select の Arrow/Home/End/Escape/Enter、MenuButton の focus return、Toast の announcement/timeout/undo、Tabs の tablist model、Disclosure/Accordion の heading/button/region semantics。
- narrow/wide navigation、long label、RTL、CJK、forced colors、reduced motion、nested composition。

**Exit criteria**

Composite Component が必要な依存だけを持ち、4A/4B の API vocabulary、state model、keyboard、focus、accessibility、theme、density、responsive behavior を崩さない。Menu 等が Overlay Infrastructure より前に実装されておらず、各 Component の first implementation phase が matrix で一意に確認できる。

**Phase status**

- Status: Completed。Phase 4C の全14 Component（SplitButton、Select、Tabs、SegmentedControl、ToggleButton、Breadcrumbs、Pagination、SideNav、TopNav、Menu、MenuButton、Toast、Disclosure、Accordion）を `packages/components/src/` の catalog 分類に追加し、各 Component の metadata、source、styles、tokens、story、visual fixture、unit/a11y test を揃えた。
- Dependency decision: Menu、Select、Toast、SplitButton は Phase 4B の Portal、dismiss、focus、positioning を必要な範囲だけ利用する。Tabs、SegmentedControl、ToggleButton、Breadcrumbs、Pagination、SideNav、TopNav、Disclosure、Accordion は Overlay に依存せず、native tab/navigation/button/region semantics を使う。Table は Phase 4A の semantic static table のまま、DataGrid は Phase 5 で初めて実装する。
- Tests: `pnpm --filter @depo-ui/components typecheck`、`pnpm test:a11y`（42 files、61 tests）、`pnpm test:visual`（16 browser tests）、`pnpm lint:raw-values` が通過した。Composite 固有では contract Vitest 5 tests、Chromium 3 tests、axe、narrow navigation、focusable tab semantics、forced colors、reduced motion、CJK/long-label fixture を確認した。
- Lifecycle: Phase 4C Component はすべて `Trial`。Production usage、owner、manual screen-reader evidence、API/A11y/Figma parity を含む Stable gate は Governance の条件を満たすまで変更しない。
- Known limitations: Select/Menu は data-driven option/action list API、Toast は provider queue と standalone surface を提供するが、advanced async option、command search、virtualization、calendar、file picker は Phase 5 の責任とする。Browser automation は Chromium、screen-reader evidence は manual checklist 前提。
- Commit: `feat(phase-4c): implement composite components`
- Blocked items: なし。

### Phase 5 — Advanced Components

**Goal**

高い interaction complexity、data complexity、locale complexity、または性能要件を持つ Component に集中し、Advanced Component の scope と limitation を明確にする。

**Dependencies**

Phase 4A、Phase 4B、Phase 4C。Phase 3 の shared accessibility minimum と、Phase 4B の Overlay Infrastructure を必要な Component だけが利用する。

**Files / directories**

packages/components/src/forms/Combobox/、packages/components/src/forms/DatePicker/、packages/components/src/forms/FileUpload/、packages/components/src/forms/Slider/、packages/components/src/data-display/DataGrid/、packages/components/src/data-display/Tree/、packages/components/src/navigation/CommandPalette/、packages/components/src/overlays/Drawer/、specs/components/、testing/interaction/、testing/accessibility/、testing/visual/、examples/。

**Tasks**

- Combobox、DatePicker、DataGrid、Tree、CommandPalette、Drawer、FileUpload、Slider を implementation/Contract として作る。
- active descendant/roving tabindex、focus scope、portal/layer、virtualization boundary、sorting/filtering/selection、async loading、file error/recovery を Component ごとの spec に分ける。
- Combobox は text input/listbox relationship、IME、async option、freeform、single/multiple を扱う。DatePicker は calendar、locale、keyboard、range/selection を扱う。
- DataGrid は keyboard navigation、selection、sorting、editing、resize、pinning、virtualization を対象にする。Table は Phase 4A の semantic static table のまま再実装しない。
- Tree、CommandPalette、Drawer、FileUpload、Slider はそれぞれの keyboard/focus、responsive、performance、permission/error boundary を定義する。
- Table と DataGrid、Menu と Combobox、Tooltip と Popover、Disclosure と Accordion の役割境界と fallback を確認する。

FileUpload、Slider、Disclosure/Accordion の配置基準は次のとおりとする。FileUpload は keyboard/file picker/drag-and-drop/progress/error の複数 state と browser security boundary があるため Phase 5、Slider は pointer/keyboard/range/value announcement の interaction model があるため Phase 5、Disclosure と Accordion は native button + region と collection state で構成できるため Phase 4C とする。

**Tests**

- large data、async options、keyboard grid/tree model、focus return、portal、Escape、screen reader manual、performance。
- narrow/expanded、RTL、long option、IME/CJK、file error/retry、reduced motion、forced colors、virtualization。
- DataGrid の two-dimensional navigation、selection announcement、editing/resize/pinning、Table との semantic/accessibility 差分。

**Exit criteria**

複雑な interaction が isolated story と real browser test で再現可能で、未対応の screen reader/keyboard limitation、performance boundary、fallback、error recovery が Docs と lifecycle に記載される。DataGrid 等の Advanced Component は Stable gate 前に production-like large-data fixture を通過する。

**Phase status**

- Status: Completed。Combobox、DatePicker、FileUpload、Slider、DataGrid、Tree、CommandPalette、Drawer を `packages/components/src/` の分類配下に実装し、各 Component の metadata、source、styles、tokens、story、visual fixture、unit/a11y test を揃えた。
- Dependency decision: Combobox、DatePicker、CommandPalette、Drawer は Phase 4B の Popover/Dialog、Portal、DismissableLayer、FocusScope、positioning、scroll lock を必要な範囲だけ利用する。FileUpload と Slider は native input を基礎にし、Tree は独自の二次元ではない roving focus model、DataGrid は semantic `role="grid"` と最小限の selection/sort/edit/pinning contract を持つ。Table は Phase 4A の semantic static table のまま再実装しない。
- Placement decision: Advanced Component の source は `packages/components/src/forms/`、`data-display/`、`navigation/`、`overlays/` に置き、共有 overlay/accessibility/DOM helper は既存の `packages/accessibility/src/`、`packages/utilities/src/`、Phase 4B の境界を再利用する。巨大な Advanced manager や Product 固有 adapter は追加しない。
- Tests: `pnpm --filter @depo-ui/components typecheck`、`pnpm test:a11y`（59 files、80 tests）、`pnpm test:visual`（19 browser tests）、`pnpm test`、`pnpm build`、`pnpm typecheck`、`pnpm lint`、`pnpm lint:deps`、`pnpm lint:raw-values`、`pnpm format:check` が通過した。Advanced 固有では contract Vitest 3 tests、各 Component の unit/a11y test、Chromium 3 tests、axe、narrow viewport、grid/tree focus、forced colors、reduced motion を確認した。
- Review evidence: Combobox の active descendant/listbox、DatePicker の dialog trigger、DataGrid の row/column semantics、Tree の level/expanded state、Drawer の modal role と focus boundary、FileUpload の error/progress、Slider の native range、CommandPalette の command result contract を確認した。React 19 ref-as-prop、Theme、Density、Long/CJK text、Responsive の共通方針は既存 Phase の contract を継承する。
- Lifecycle: Phase 5 Component はすべて `Trial`。Production usage、owner、manual screen-reader evidence、API/A11y/Figma parity を含む Stable gate は Governance の条件を満たすまで変更しない。
- Known limitations: DataGrid はこの Phase では resize drag、virtualization、column chooser、server-side data adapter を実装せず、基本の sorting/selection/editing/pinning boundary に限定する。DatePicker は native date input を calendar fallback として使い、range calendar UI は後続の仕様拡張対象とする。Combobox、CommandPalette、Tree、Drawer の screen-reader/manual evidence と Safari/Firefox matrix は後続で拡張する。Browser automation は Chromium、visual fixture は deterministic static fixture を前提とする。
- Commit: `feat(phase-5): implement advanced components`
- Blocked items: なし。

### Phase 4A〜4C / Phase 5 component implementation phase matrix

下表は section 10 の Component Catalog にある全 Component の first implementation phase である。各 Component は一度だけ割り当て、4A/4B/4C/5 の別 Phase で再実装しない。Phase 3 は下位の Primitive catalog を担当する。

| Catalog | Phase 3 | Phase 4A | Phase 4B | Phase 4C | Phase 5 |
|---|---|---|---|---|---|
| Primitives | Box、Stack、Inline、Cluster、Grid、Container、Center、Split、Sidebar、Text、Heading、Icon、Divider、VisuallyHidden | — | — | — | — |
| Actions | — | Button、IconButton、Link | — | SplitButton | — |
| Forms | — | Field、TextInput、Textarea、NumberInput、Checkbox、CheckboxGroup、Radio、RadioGroup、Switch、DateInput、SearchField | — | Select | Combobox、DatePicker、FileUpload、Slider |
| Selection | — | — | — | Tabs、SegmentedControl、ToggleButton | — |
| Navigation | — | — | — | Breadcrumbs、Pagination、SideNav、TopNav、Menu、MenuButton | CommandPalette |
| Data Display | — | Badge、Tag、Avatar、Card、List、Table、Stat、KeyValue、Code、Kbd | — | — | DataGrid、Tree |
| Feedback | — | InlineMessage、Banner、Spinner、ProgressBar、Skeleton、EmptyState、ErrorState | — | Toast | — |
| Overlay | — | — | Popover、Tooltip、Dialog | — | Drawer |
| Disclosure | — | — | — | Disclosure、Accordion | — |

Matrix の確認では、catalog 名、spec path、implementation path、Story、Test、Figma mapping の Component name が一致すること、Overlay Infrastructure に依存する Composite が helper より前に実装されないことを検査する。

### Phase 6 — Patterns

**Goal**

ユーザータスクを表す Pattern を仕様・例・必要な composition として提供する。

**Dependencies**

Phase 4A、Phase 4B、Phase 4C、必要に応じて Phase 5。

**Files / directories**

packages/patterns/src/、specs/patterns/、examples/、apps/playground/src/fixtures/。

**Tasks**

- 12.2 の Pattern catalog を、まず Form submission、Search and filter、List detail、Data management、Error recovery、Responsive navigation から作る。
- 各 Pattern の transition、error/recovery、content、a11y、responsive fixture を作る。
- Domain data adapter は example/consumer に置き、Pattern 本体に持ち込まない。

**Tests**

- happy path、empty、loading、error、retry、permission、undo、narrow/wide、keyboard、screen reader notification。

**Exit criteria**

Pattern が「Component の寄せ集め」ではなく user goal と state recovery を説明でき、Docs の recipe と consumer fixture が同じ契約を使う。

### Phase 7 — Accessibility Infrastructure

**Goal**

Component ごとの個別実装を共通 utility、manual audit、browser matrix、reporting で強化する。

**Dependencies**

Phase 3、Phase 4A、Phase 4B、Phase 4C の A11y minimum、Phase 5 の複雑な interaction。共有 helper は Phase 4B から段階的に強化できるが、Stable release の総合 gate は Phase 5 と必要な Phase 6 の結果を含めて確認する。

**Files / directories**

packages/accessibility/src/keyboard/、focus/、live-region/、testing/accessibility/、testing/fixtures/、tooling/accessibility/、docs/accessibility/、specs/foundations/accessibility.md。生成 report は `testing/accessibility/known-limitations.generated.md` に置き、直接編集しない。

**Tasks**

- focus manager、roving tabindex、typeahead、focus scope/trap、announcement、ID association、reduced-motion/forced-color helper を共通化する。
- Axe/Playwright/Storybook の共通設定と manual SR checklist を作る。
- WCAG 2.2 AA の coverage map と known limitations report を生成する。

**Tests**

- all Stable candidate story の a11y scan、keyboard matrix、NVDA/VoiceOver manual、forced colors、zoom/reflow、reduced motion。

**Exit criteria**

A11y utility が下位層で再利用され、Component が独自 focus/ARIA を不用意に実装していない。自動と手動の結果が追跡可能で、未解決 issue が lifecycle に反映される。

**Phase status**

- Status: Completed. Shared accessibility infrastructure is implemented in `packages/accessibility/src/keyboard/`, `packages/accessibility/src/focus/`, `packages/accessibility/src/ids/`, `packages/accessibility/src/live-region/`, and `packages/accessibility/src/media/`. Roving tabindex and typeahead remain framework-light utilities; `FocusScope`, dismiss/focus restoration, and ID association remain reusable lower-layer APIs. Existing Tabs navigation now consumes the shared roving calculation.
- Placement decision: Keyboard state calculation and media preference hooks belong to `packages/accessibility`; live-region rendering and announcement belong to the same package because they expose assistive-technology semantics rather than visual component styling. `testing/accessibility/` owns Axe and Storybook configuration, `testing/fixtures/` owns the stable matrix, `tooling/accessibility/` owns map/report validation, and `docs/accessibility/` plus `specs/foundations/accessibility.md` document operation versus formal contract.
- Evidence: `testing/accessibility/coverage-map.json` tracks WCAG 2.2 AA areas and current `partial`/`planned` limitations. `testing/accessibility/known-limitations.generated.md` is generated by `pnpm a11y:report`; `pnpm a11y:check` verifies the map, evidence paths, checklist, and generated marker. `testing/accessibility/screen-reader-checklist.md` records the required NVDA/Chromium and VoiceOver/Safari manual evidence.
- Tests: `pnpm a11y:report`, `pnpm a11y:check`, `pnpm test:a11y` (66 files、100 tests), `pnpm --filter @depo-ui/accessibility build`, `pnpm test:visual -- accessibility.spec.ts` (3 Chromium tests)、`pnpm lint:deps`、`pnpm lint:raw-values`、`pnpm lint`、`pnpm typecheck` が通過した。Browser coverage includes keyboard/focus/name and relationship checks, 320 CSS px plus 200% text reflow, forced colors, reduced motion, and Axe WCAG A/AA tags.
- Lifecycle: Shared helpers and accessibility fixtures are `Trial` infrastructure until the Governance Stable gate has production usage, owner, manual screen-reader evidence, and the required API/visual/Figma parity. The automated suite is supporting evidence and does not declare WCAG conformance by itself.
- Known limitations: NVDA/Chromium and VoiceOver/Safari execution remains a manual maintainer responsibility; browser automation currently runs Chromium. The coverage map intentionally reports unfinished localization and manual evidence as `planned`/`partial`, so these gaps must be resolved or governed before a Stable transition.
- Commit: `feat(phase-7): complete accessibility infrastructure`
- Blocked items: none for the automated Phase 7 implementation; manual screen-reader evidence remains a documented Stable-gate prerequisite.

### Phase 8 — Figma Integration

**Goal**

Token、Component、Variant、Property、State、Lifecycle の Repo/Figma parity と同期 workflow を確立する。

**Dependencies**

Phase 1、Component Metadata、Phase 4A〜4C（最初は Phase 4A の mapping）。Figma file/plan/権限の決定が必要で、Phase 5 の Advanced Component は mapping が揃ったものから追加する。

**Files / directories**

figma/variables/、figma/components/、figma/mapping/、figma/sync/、tooling/figma-sync/、specs/decisions/ADR-006-figma-source-boundary.md。

**Tasks**

- Variables collection/mode、Component set、property、variant naming を作る。
- Repo→Figma push preview、Figma→Repo read-only pull、extra/missing diff、publish step を作る。
- Enterprise REST API が使えない場合の Plugin API fallback と secret policy を文書化する。

**Tests**

- token/variant/property/lifecycle parity、mode completeness、rename detection、dry-run sync、credential absence。

**Exit criteria**

Figma 側だけの秘密値がなく、push/pull の責任と権限が明確で、Parity report が CI と Docs から参照できる。

**Phase status**

- Status: Completed. Figma Variables collection/modes, Component naming/property policy, generated token and Component mappings, repository-first sync model, parity report, dry-run push, and read-only pull are implemented in `figma/` and `tooling/figma-sync/`.
- Placement decision: `figma/variables/collections.json`, `figma/components/naming.json`, and `figma/sync/policy.json` are human-maintained policy. `figma/mapping/tokens.json` and `figma/mapping/components.json` are generated from `packages/tokens/src/` and `specs/components/`; `figma/sync/parity-report.json` is generated evidence. Token values are resolved at runtime for comparison and are not copied into Figma mapping JSON.
- Sync boundary: `tooling/figma-sync/model.mjs` owns stable-key mapping, mode/type conversion, extra/missing/changed/rename diff, credential detection, and transport selection. `sync.mjs` emits a non-destructive push preview by default and a read-only pull report; no REST or Plugin API call is made without a future explicit adapter/publish implementation. Extra Figma objects are never auto-deleted.
- Tests: `pnpm figma:generate`, `pnpm figma:report`, `pnpm figma:check`, `pnpm figma:preview`, `pnpm figma:pull`, Figma-specific Vitest 7 tests, `pnpm test` (68 files、107 tests), `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm lint:deps`, and `pnpm lint:raw-values` passed. Coverage includes token/mode/property/lifecycle parity, rename detection, dry-run sync, read-only pull, and credential absence.
- Lifecycle: Mapping policy and generated parity evidence remain `Trial` until an owner-approved Figma file, production usage, manual visual review, and Governance Stable evidence exist. Figma mapping names use the same Component and property vocabulary as code.
- Known limitations: No live Figma credential or remote file is available in CI/local verification, so REST/Plugin publish and screen-level visual parity remain manual follow-up work. The repository can detect drift from an exported snapshot without allowing that snapshot to overwrite token or metadata source.
- Commit: `feat(phase-8): integrate figma architecture`
- Blocked items: none for repository-side Phase 8; live publish requires an external Figma file, credentials, adapter, and owner approval.

### Phase 9 — Documentation

**Goal**

仕様・Metadata・Story・Examples から、公式 Docs Site を読みやすく生成する。

**Dependencies**

Phase 1〜6 の主要 Source、Phase 8 の mapping。Docs shell は Phase 0 で先に置いてよい。

**Files / directories**

apps/docs/、tooling/docs-generator/、docs/、specs/、README.md。

**Tasks**

- Getting Started、Foundations、Components、Patterns、Accessibility、Content Design、API、Examples、Releases、Migration Guide の navigation を作る。
- Metadata から API/state/a11y/test/Figma tables を生成する。
- Dark/Light/High Contrast、RTL、long text、responsive の live examples を提供する。
- versioned docs、deprecated banner、migration/codemod link を release と結びつける。

**Tests**

- docs build、link check、generated marker、search/index、keyboard/heading/landmark、mobile/reflow、code example build。

**Exit criteria**

仕様と Docs の重複がなく、Component を一つ追加したとき Metadata/Story を通じて Docs reference の大部分が自動更新される。

### Phase 10 — Governance / Release

**Goal**

Lifecycle、ownership、Changesets、Migration、deprecation、production evidence を運用可能にする。

**Dependencies**

Phase 0〜9 の品質 gate。

**Files / directories**

governance/、.changeset/、.github/workflows/、tooling/codemods/、docs/releases/、specs/decisions/。

**Tasks**

- Proposal→Trial→Stable→Deprecated→Removed の checklist と approval route を CI/PR template に組み込む。
- Changesets の version PR、changelog、internal dependency、publish の workflow を構築する。
- deprecation warning、codemod、migration guide、release note、support window を整える。
- production usage、issue severity、adoption、A11y audit の evidence を Component metadata に記録する。

**Tests**

- changeset missing、version graph、packed package install、deprecation/codemod fixture、migration from previous version、release dry run。

**Exit criteria**

Stable package を安全に publish、upgrade、deprecate、remove でき、reproducible な release と rollback/migration の手順が Docs/CI で確認できる。

## 25. File-by-file Examples

ここでは代表的な実装予定を示す。これは今回の実装ではなく、Phase 以降のファイル責任と Source of Truth の例である。

### 25.1 Tokens

~~~text
packages/tokens/src/reference/color.json
packages/tokens/src/reference/spacing.json
packages/tokens/src/reference/typography.json
packages/tokens/src/reference/sizing.json
packages/tokens/src/reference/radius.json
packages/tokens/src/reference/border.json
packages/tokens/src/reference/elevation.json
packages/tokens/src/reference/motion.json
packages/tokens/src/semantic/color.json
packages/tokens/src/semantic/spacing.json
packages/tokens/src/semantic/typography.json
packages/tokens/src/semantic/sizing.json
packages/tokens/src/semantic/motion.json
packages/tokens/src/themes/dark.json
packages/tokens/src/themes/light.json
packages/tokens/src/themes/high-contrast.json
packages/tokens/generated/tokens.css
packages/tokens/generated/tokens.ts
packages/tokens/generated/tokens.d.ts
packages/tokens/generated/manifest.json
~~~

| File | 内容 |
|---|---|
| reference/color.json | Depo の palette anchor、追加 neutral/status/focus/overlay の raw value。alias は持たない |
| semantic/color.json | bg、fg、border、action、status、focus、overlay の role と説明。default alias または contract を定義 |
| themes/*.json | 同一 Semantic path の mode value。未定義 role と新規 public role を禁止 |
| reference/spacing.json 等 | 4px scale、2px hairline、size/radius/border/elevation/motion の raw value |
| generated/tokens.css | Theme selector、Semantic CSS Custom Property、必要な developer-only output。直接編集禁止 |
| generated/tokens.ts | 型付き token name、theme manifest、内部 tooling が使う map |
| generated/tokens.d.ts | consumer 向け declaration。source ではない |
| generated/manifest.json | resolved graph、version、hash、Figma mapping、generation metadata |

### 25.2 Button

~~~text
packages/components/src/actions/Button/
├─ Button.tsx
├─ Button.types.ts
├─ Button.styles.ts
├─ Button.tokens.ts
├─ Button.test.tsx
├─ Button.a11y.test.tsx
├─ Button.visual.tsx
├─ Button.stories.tsx
└─ index.ts

specs/components/actions/button.json
specs/components/actions/button.md
figma/mapping/components.json
~~~

| File | 内容 |
|---|---|
| Button.tsx | Native button、leading/trailing icon slot、loading の duplicate prevention、React 19+ の ref prop、event wiring |
| Button.types.ts | variant、size、tone、density、disabled、loading、必要な場合だけ公開する ref、content/slot、標準 button props、event 型 |
| Button.styles.ts | rest/hover/pressed/focus-visible/disabled/loading と variant/tone の style recipe。Semantic variable のみ参照 |
| Button.tokens.ts | button.primary.bg.rest 等の local alias。public global token は export しない |
| Button.test.tsx | click/keyboard、loading、disabled、controlled state、slot、native type、event の test |
| Button.a11y.test.tsx | accessible name、role、focus ring、axe、disabled/loading semantics、contrast fixture |
| Button.visual.tsx | 全 variant/size/tone/state、Theme、Density、long label、icon-only misuse fixture |
| Button.stories.tsx | Default、Primary、Secondary、Destructive、Loading、Disabled、With icons、Play interaction、Docs source |
| index.ts | Button と public types のみ export |
| button.json | Purpose、Anatomy、API、state precedence、ARIA、keyboard、responsive、lifecycle、Figma key、tests |
| button.md | なぜ/いつ使うか、content、do/don't、composition、migration の narrative |

Button の loading は label を視覚的に置き換えても accessible name と processing status を失わない。type="submit" の標準動作、Enter/Space、disabled の focus policy は Contract と test で固定する。

### 25.3 TextInput

~~~text
packages/components/src/forms/TextInput/
├─ TextInput.tsx
├─ TextInput.types.ts
├─ TextInput.styles.ts
├─ TextInput.tokens.ts
├─ TextInput.test.tsx
├─ TextInput.a11y.test.tsx
├─ TextInput.visual.tsx
├─ TextInput.stories.tsx
└─ index.ts

specs/components/forms/text-input.json
specs/components/forms/text-input.md
~~~

- Field と label/description/error/help ID を共有する。placeholder だけで label を省略できない。
- value/defaultValue/onValueChange、invalid、required、readOnly、disabled、loading を標準語彙で提供する。
- Contract が DOM input の公開を定める場合、React 19+ では ref を通常の prop として input に渡す。React 18 compatibility の実装は Phase 0 の strategy に従い、この Component の標準実装へ無条件に混ぜない。
- Error は aria-describedby/aria-errormessage の適用条件、message の優先順位、入力値保持を定義する。
- Test は IME/CJK、password manager/autocomplete、mobile input mode、long value、RTL、200% resize、form submit、screen reader announcement を含める。

### 25.4 Dialog

~~~text
packages/components/src/overlays/Dialog/
├─ Dialog.tsx
├─ Dialog.types.ts
├─ Dialog.styles.ts
├─ Dialog.tokens.ts
├─ Dialog.test.tsx
├─ Dialog.a11y.test.tsx
├─ Dialog.visual.tsx
├─ Dialog.stories.tsx
└─ index.ts

specs/components/overlays/dialog.json
specs/components/overlays/dialog.md
~~~

- open/defaultOpen/onOpenChange、modal、initialFocus、returnFocus、closeOnEscape、closeOnOutsidePress の責任を明示する。
- Dialog 自体に不要な imperative API は作らず、focusable な trigger/content の公開が必要な場合だけ Contract に定めた ref を受け取る。open/close は props で表現する。
- title/description/close action を accessible name/description に接続する。
- modal の inert/background、focus trap、Escape、close 後の focus return、scroll lock、nested overlay、exit animation を test する。
- narrow では full-screen/Drawer 的な layout に transform し、同じ semantics と recovery を保つ。

### 25.5 Combobox

~~~text
packages/components/src/forms/Combobox/
├─ Combobox.tsx
├─ Combobox.types.ts
├─ Combobox.styles.ts
├─ Combobox.tokens.ts
├─ Combobox.test.tsx
├─ Combobox.a11y.test.tsx
├─ Combobox.visual.tsx
├─ Combobox.stories.tsx
└─ index.ts

specs/components/forms/combobox.json
specs/components/forms/combobox.md
~~~

- Text input と listbox の relationship、aria-expanded、aria-controls、aria-activedescendant、selection の semantics を決める。
- async option、loading、no result、error、disabled option、freeform、single/multiple、IME、virtualized option を別 state として扱う。
- Arrow/Home/End/Escape/Enter/typeahead、focus restoration、screen reader result announcement を browser test と manual test で確認する。
- Select や Menu へ fallback する条件を docs に書き、Dropdown のような曖昧な API を作らない。

### 25.6 Table / DataGrid

~~~text
packages/components/src/data-display/Table/
├─ Table.tsx
├─ Table.types.ts
├─ Table.styles.ts
├─ Table.tokens.ts
├─ Table.test.tsx
├─ Table.a11y.test.tsx
├─ Table.visual.tsx
├─ Table.stories.tsx
└─ index.ts

packages/components/src/data-display/DataGrid/
├─ DataGrid.tsx
├─ DataGrid.types.ts
├─ DataGrid.styles.ts
├─ DataGrid.tokens.ts
├─ DataGrid.test.tsx
├─ DataGrid.a11y.test.tsx
├─ DataGrid.visual.tsx
├─ DataGrid.stories.tsx
└─ index.ts

specs/components/data-display/table.json
specs/components/data-display/data-grid.json
~~~

- Table は semantic table/thead/tbody/th/td/caption を基本にし、static sort/filter は Consumer/Pattern で組み合わせる。
- DataGrid は明示的に sorting、selection、row/column navigation、resize、pinning、virtualization、loading/error を Contract 化する。
- Column definition は domain-agnostic な accessor/render contract とし、Product の API model を持たない。
- large dataset performance、pagination/virtualization、focus cell、row selection announcement、bulk action、narrow alternate view、two-dimensional scroll を分離して test する。
- Column が隠れる場合は accessible な row detail、column chooser、priority order を提供し、CSS display:none だけで情報を捨てない。

### 25.7 Pattern

例として Search and Filter を次のように構成する。

~~~text
packages/patterns/src/search-filter/
├─ SearchFilter.tsx
├─ SearchFilter.types.ts
├─ SearchFilter.test.tsx
├─ SearchFilter.a11y.test.tsx
├─ SearchFilter.stories.tsx
└─ index.ts

specs/patterns/search-and-filter.json
specs/patterns/search-and-filter.md
examples/data-heavy-dashboard/src/search-filter-fixture.tsx
~~~

- SearchFilter.tsx は query/filter state の composition と callbacks を扱うが、fetch、cache、URL routing は受け取った adapter に委譲する。
- Metadata に idle/loading/results/empty/error、clear/retry、filter chip、responsive drawer、result count announcement を記録する。
- Example は fake data adapter、Component story は deterministic fixture、consumer は実際の server state adapter として責任を分ける。

### 25.8 Accessibility utility

~~~text
packages/accessibility/src/focus/focus-visible.ts
packages/accessibility/src/focus/focus-scope.ts
packages/accessibility/src/keyboard/roving-tabindex.ts
packages/accessibility/src/keyboard/typeahead.ts
packages/accessibility/src/ids/description-ids.ts
packages/accessibility/src/live-region/announce.ts
packages/accessibility/src/index.ts
testing/accessibility/axe.ts
testing/accessibility/screen-reader-checklist.md
~~~

- focus-visible.ts: input modality を判定し、focus ring を必要なときだけ state 化する。
- focus-scope.ts: dialog/menu/list の focus boundary、restore、nested scope の primitive contract。
- roving-tabindex.ts: tabs/menu/tree/grid 等で active item と tab stop を計算する純粋ロジック。
- typeahead.ts: locale/CJK を考慮した検索 buffer と timeout の policy。
- description-ids.ts: label/help/error の stable ID と relation を作る。
- announce.ts: status/live message の重要度と重複を扱う。必ず Component の context と一緒に利用する。
- testing/ は Axe config と manual checklist を共有するが、manual review を自動化済みと表現しない。

### 25.9 Figma mapping

~~~text
figma/mapping/tokens.json
figma/mapping/components.json
figma/mapping/properties.json
figma/mapping/exceptions.json
figma/variables/collections.json
figma/variables/modes.json
~~~

- tokens.json: canonical token path ↔ Figma collection/mode/variable name/key。
- components.json: Button、TextInput 等の canonical Component ↔ Figma component set/key/lifecycle。各 mapping に packages/components/src/<category>/<Component>/ の source path と public export を紐づける。
- properties.json: variant/size/tone/state/disabled と Figma property type/name/value の対応。
- exceptions.json: 既知の Figma API/asset 制約だけを owner、reason、expiry 付きで記録する。
- collections.json/modes.json: Reference/Semantic/Component と dark/light/high-contrast の manifest。値の Source ではない。

### 25.10 Docs

~~~text
apps/docs/content/guides/getting-started.mdx
apps/docs/content/foundations/color.mdx
apps/docs/content/components/button.mdx
apps/docs/content/components/generated/button-api.mdx
apps/docs/content/patterns/search-and-filter.mdx
apps/docs/src/generated/component-reference.ts
tooling/docs-generator/src/metadata-to-mdx.ts
tooling/docs-generator/src/validate-links.ts
~~~

- 手編集 MDX は why/when/how、Do/Don't、Content、migration、recipe を持つ。
- generated/button-api.mdx は specs/components/actions/button.json と packages/components/src/actions/Button/ の story/test manifest から生成する。Docs の source link はこの Component path と public export の両方を示す。
- Docs generator は generated marker、schema version、source hash を付ける。手編集の API 表は作らない。
- validate-links.ts は Figma、Story、Spec、Package export、Migration link の存在を検査する。

### 25.11 Testing

~~~text
testing/unit/render.tsx
testing/interaction/user.ts
testing/accessibility/axe.ts
testing/accessibility/focus.ts
testing/themes/theme-matrix.ts
testing/visual/screenshot.ts
testing/fixtures/long-text.ts
testing/fixtures/locales.ts
packages/components/src/<category>/<Component>/<Component>.test.tsx
packages/components/src/<category>/<Component>/<Component>.a11y.test.tsx
packages/components/src/<category>/<Component>/<Component>.visual.tsx
apps/visual-tests/tests/components.spec.ts
apps/visual-tests/snapshots/<browser>/<theme>/<component>/
playwright.config.ts
vitest.workspace.ts
~~~

- testing/ は fixture/harness の Source。個別 assertions は Component folder に置く。
- theme-matrix.ts は dark/light/high-contrast と density、reduced-motion、forced-colors の組み合わせを供給する。
- long-text.ts は英語長文、CJK、RTL、pseudo-localized string、複数行 error を供給する。
- Visual snapshots は固定 browser/font/container と一緒に管理し、baseline update は PR review を通す。

## 26. Risks

| Risk | 影響 | 対策 |
|---|---|---|
| Dark-first palette が Light/Status text で Contrast を満たさない | A11y failure、semantic role の乱立 | 追加の accessible ramp/role、Theme matrix、Contrast CI、brand fill と text value を分離 |
| Token 層が増えすぎる | 名前の混乱、Product の raw/reference 利用 | 3 層を固定、public は Semantic 中心、Component Token は local、追加は ADR |
| DTCG と外部ツールの対応差 | Figma/renderer の drift | custom normalize layer、schema version、round-trip fixture、DTCG update を ADR 化 |
| Figma が実質 Source になる | repo と design の二重管理 | repo→Figma を主経路、pull は read-only parity、secret/exception policy |
| Component API の prop 爆発 | 使い方が分からない、breaking change | Contract、slot、Pattern、common vocabulary、escape hatch の期限管理 |
| DataGrid/Tree/Combobox の scope が大きい | Phase の停滞、品質不足 | core と advanced を分け、Trial、manual SR、performance gate、virtualization boundary |
| Responsive を breakpoint の羅列で作る | narrow/zoom/embedded container で崩れる | container query、content minimum、input method、adaptive mode、fixture |
| Visual regression の flaky baseline | false positive、review fatigue | 固定 image/font/browser、deterministic data、差分 review、必要な screenshot のみ |
| generated drift | stale CSS/TS/Docs/Figma | build diff check、生成物 read-only、source hash、CI failure |
| dependency cycle | build order/AI 理解の破綻 | pnpm cycle fail、Turborepo graph、AST boundary、public exports |
| Docs の二重管理 | ルールの矛盾、更新漏れ | specs/metadata を Source、reference table を生成、links/schema check |
| SSR/hydration/FOUC | Theme 切替時のちらつき・不一致 | initial theme resolution、CSS-first token、hydration test |
| Font/license/locale | 文字崩れ、配布制約 | fallback contract、license ADR、CJK/RTL/pseudo-locale fixture |
| Screen reader 互換性 | 自動 test では見つからない欠陥 | NVDA/VoiceOver manual matrix、complex component の Trial、known limitation |
| AI が巨大な文書を読めない | 誤実装、context 消費 | 短い AGENTS、schema/metadata、task-specific Docs、生成 index |
| Release の internal dependency 不整合 | consumer build failure | Changesets、packed install smoke、semver policy、migration/codemod |

## 27. Decisions That Must Be Made Before Implementation

この PLAN で architecture の基本方向は決めるが、次の運用値は Phase 0 の最初に確定し、ADR に記録する。

1. npm scope（@depo-ui の可否）、registry、package の公開単位、license、private/public repository 方針。
2. Phase 0 時点の Active LTS Node、pnpm、React の support range、ref compatibility strategy、対象 browser/OS/assistive technology matrix。React support range と ref 方針は別々に決めず、一つの compatibility decision として ADR 化する。
3. Default font のライセンス、配布方法、Figma で利用できる font、font がない環境の fallback。
4. Docs の hosting、domain、versioned docs、検索、analytics、アクセス制御。
5. Figma の file/team/project、Variables REST API の plan/seat/scope、Plugin API を使えるか、push の承認者。
6. Visual regression の実行場所（Playwright snapshots のみか、Chromatic 等の review service を併用するか）、baseline owner。
7. 最初に Stable gate の Production usage を提供する pilot Product と owner。
8. Design review、API review、A11y review、Content review、Release approver の primary/backup。
9. Browser の最小対応範囲、touch target の product policy、virtualization の採用範囲。
10. 決定した React peer dependency の最小/最大 version を package exports と CI matrix にどう反映するか、将来の framework-neutral 出力をどこまで用意するか。
11. Figma Component の publish naming、component key/ID の保管場所、rename/deprecation の手順。
12. 対外的な SLA、support window、security fix と emergency removal の例外ルール。

これらが未決定でも Phase 0 の repository skeleton と schema 設計は進められるが、公開 Package の version、font、Figma push、Production Stable 昇格は実行しない。

## 28. Definition of Done

### PLAN の完了条件

- Depo UI の目的と non-goals が明確。
- Design Principles、Repository 構造、各 Folder の責任と境界が明確。
- Package の責任、依存方向、cycle/deep-import 検査方法が明確。
- Reference → Semantic → Component の Token architecture、DTCG JSON、Theme、generated policy が明確。
- Depo UI の指定色を anchor とし、追加色の理由と Contrast 方針が明確。
- Color、Typography、Spacing、Sizing、Radius、Border、Elevation、Layout、Grid、Responsive、Density、Icon、Motion、Layer の Foundation が設計されている。
- Component の分類、重複を避ける命名、内部 file structure、Contract、共通 API、State priority、React 19 ref-as-prop と React 18 compatibility strategy の境界が明確。
- Pattern の構造と、Form submission、Search/filter、List/detail、Create、Edit、Delete、Destructive、Async、Error recovery、Empty、Loading、Data management、Bulk action、Responsive navigation、Permission、Unavailable、Undo、Authentication、Command palette が設計されている。
- Content Design、Error 文、Button label、Localization、CJK、RTL、Truncation が Design System の一部として定義されている。
- WCAG 2.2 AA、Keyboard、Focus、Screen reader、Contrast、Forced colors、Target size、Reduced motion、Zoom/Reflow の要件が最初から Contract/Test に組み込まれている。
- Figma Variables、Component properties、Mapping、sync、parity、secret policy が明確。
- Specs、Docs Site、repo docs の責任と生成方法が明確。
- Unit、Interaction、Keyboard、A11y、Visual、Theme、Responsive、Localization、Consumer、manual review の Test 方針が明確。
- Token build/lint、raw value lint、Generator、Figma sync、Visual regression、Changesets、Migration/Codemod の tooling 方針が明確。
- Lifecycle、Stable gate、Owner、Production usage、Deprecation、Removal、Release governance が明確。
- AGENTS.md が入口として何を案内し、詳細をどこに置くかが明確。
- Phase 0〜3、Phase 4A〜4C、Phase 5〜10 の順序、Dependencies、Files/directories、Tasks、Tests、Exit criteria がある。Phase 4A〜4C の Component phase matrix で全 catalog の first implementation phase が一意に分かる。
- Token、Button、TextInput、Dialog、Combobox、Table/DataGrid、Pattern、A11y utility、Figma mapping、Docs、Testing の file-by-file 計画がある。
- 技術選定、採用理由、代替、交換可能性、Phase 0 時点で確認する version が明確。
- 主なリスク、mitigation、実装前に決める運用項目が明確。

### 実装完了時の全体条件

- Phase 0 から Phase 3、Phase 4A〜4C、Phase 5〜10 の Exit criteria を順番に満たしている。
- Stable Component が minimum matrix と Stable gate を通過している。
- pnpm build、pnpm typecheck、pnpm lint、pnpm test、pnpm test:a11y、pnpm test:visual、pnpm test:e2e、pnpm docs:generate、pnpm figma:check、pnpm release:check が clean checkout で再現可能である。
- Source、generated、Figma snapshot、Docs、Package exports の差分が説明可能で、未承認の raw value、cycle、deep import、Figma-only value がない。
- Consumer fixture で published/packed package を利用でき、Migration と rollback/recovery の案内が存在する。

## References

以下は設計時に確認した一次資料と、Depo UI に反映した考え方である。Depo UI はこれらの仕様・見た目・命名をコピーせず、Web application 向けに再設計する。

- [React 19 — ref as a prop](https://react.dev/blog/2024/12/05/react-19): React 19 以降の Function Component が ref を prop として受け取る方針。
- [React — forwardRef reference](https://react.dev/reference/react/forwardRef): 新規 Function Component では forwardRef が不要で将来 deprecated になること、imperative ref を props で表現できない操作に限定する考え方。
- [Material Design 3 — Canonical layout examples](https://m3.material.io/foundations/layout/canonical-examples/overview): compact/medium/expanded、feed、list-detail、supporting pane、adaptive scaffold。
- [Material Design — Responsive UI](https://m1.material.io/layout/responsive-ui.html): grid、reflow、reveal、transform、divide、surface behavior の考え方。
- [Material Design 3 — States](https://m3.material.io/foundations/interaction/states/overview): state の組み合わせと一貫した視覚表現。
- [Carbon Design System — Themes](https://carbondesignsystem.com/elements/themes/overview/): theme、role、token の分離。
- [Carbon Design System — Color overview](https://carbondesignsystem.com/elements/color/overview/): layer、surface hierarchy、contextual token。
- [Fluent 2 — Design tokens](https://fluent2.microsoft.design/design-tokens): global/reference と alias/semantic、theming。
- [Fluent 2 — Start designing](https://fluent2.microsoft.design/get-started/design): Figma Variables、Code aligned component properties。
- [GitHub Primer — Accessibility patterns](https://primer.style/accessibility/patterns/primer-components/): Component ごとの accessibility guidance。
- [Atlassian Design — Error messages](https://atlassian.design/foundations/content/designing-messages/error-messages): problem、action、recovery が分かる error content。
- [Atlassian Design — Release phases](https://atlassian.design/release-phases): experimental/beta/GA と deprecation の段階管理。
- [GOV.UK Design System — Component lifecycle statuses](https://design-system.service.gov.uk/community/component-lifecycle-statuses/): Trial/Stable を利用状況と contribution criteria で分ける考え方。
- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/): AA、contrast、resize、reflow、focus、target size、accessible authentication 等。
- [DTCG — Design Tokens Format Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/): JSON exchange format、$value、$type、$description、$extends 等。
- [Figma Developer Docs — Variables REST API](https://developers.figma.com/docs/rest-api/variables/): CI sync、publish、permission、Enterprise/Full seat の制約。
- [Figma Developer Docs — Working with Variables](https://developers.figma.com/docs/plugins/working-with-variables/): Plugin API、modes、aliases、bound variables。
- [pnpm — Workspace](https://pnpm.io/workspaces): workspace protocol、cycle policy、strict dependency。
- [pnpm — Catalogs](https://pnpm.io/catalogs): monorepo dependency version の一元化。
- [Turborepo — Introduction / caching](https://turborepo.dev/docs): package/task graph、parallelism、cache。
- [Vite — Library mode](https://vite.dev/guide/build): browser library build と public exports。
- [Storybook — Testing](https://storybook.js.org/docs/writing-tests/index): story を component、interaction、a11y、visual test の入力にする考え方。
- [Storybook — Accessibility tests](https://storybook.js.org/docs/writing-tests/accessibility-testing): Axe を使った自動検査と manual review の役割分担。
- [Playwright — Visual comparisons](https://playwright.dev/docs/test-snapshots): 固定 browser 環境での screenshot baseline。
- [Changesets — README](https://github.com/changesets/changesets): monorepo の version、changelog、internal dependency、publish workflow。
- [OpenAI — Introducing Codex](https://openai.com/index/introducing-codex/): AGENTS.md を repository navigation、commands、testing、working agreement の入口として使う考え方。
- [OpenAI — Harness engineering](https://openai.com/index/harness-engineering/): AGENTS.md を短い map とし、詳細な repository knowledge を structured docs に置く考え方。
