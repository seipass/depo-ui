# ADR-005: Depo UI color palette

- Status: Accepted
- Date: 2026-09-01
- Owners: Depo UI Design System maintainers
- Review date: Any supplied anchor change or Phase 10 governance review

## Context

Depo UI のブランドと状態表現には、指定された Primary、Secondary、Success、Warning、Danger、Surface、Foreground、Border の色を保持する必要がある。一方で、Light Theme、High Contrast、Disabled、Focus、Status text には supplied palette だけでは十分な役割分離がない。

## Decision

- 指定された色を Reference Palette の required anchors として固定する。tooling/token-build/model.mjs が値の変更または欠落を build failure にする。
- Semantic Color は bg、fg、border、action、status、focus、overlay、disabled の role に分ける。
- Light Theme の action と status は必要な 700、800、100、900 ramp を使って AA pair を作る。これは supplied anchor の置換ではなく、Theme 用の role mapping である。
- High Contrast Theme は OS system color を利用し、forced-colors 環境で border、focus、text、button state が認識できることを browser test で確認する。
- Color token の追加は、明確な Semantic role、利用 Component、Contrast または forced-colors の検証結果を同時に追加する。

## Consequences

- supplied anchor はブランド変更の影響範囲を明確にする。
- Light/Dark で同じ hex を無理に再利用せず、役割ごとに読みやすさを優先できる。
- Contrast の自動検証だけでは非テキスト、透過合成、system color を完全には判定できないため、Phase 2 以降の visual、forced-colors、Component test が必要になる。
