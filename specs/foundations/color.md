# Color

## Purpose

Depo UI の Color は、ブランドの識別、情報の階層、操作状態、エラー回復を表現する。Product は Reference Palette の値を直接指定せず、Semantic Token を利用する。色だけを状態の唯一の手掛かりにしない。

## Required palette anchors

次の値は Depo UI の Reference Palette の不変アンカーである。変更には、色差分、Contrast 結果、Migration note を含む ADR が必要になる。

| Role                   | Reference Token   | Value   |
| ---------------------- | ----------------- | ------- |
| Primary                | color.brand.600   | #6C6FF6 |
| Primary hover          | color.brand.500   | #8588FF |
| Primary container      | color.brand.900   | #262A5F |
| On primary             | color.neutral.950 | #05060A |
| On primary container   | color.brand.100   | #C8CBFF |
| Secondary / Info       | color.accent.600  | #4B8DFF |
| Secondary hover        | color.accent.500  | #72A6FF |
| Secondary container    | color.accent.900  | #14345F |
| On secondary container | color.accent.100  | #C7DCFF |
| Success                | color.success.600 | #35B779 |
| Success container      | color.success.900 | #153B2A |
| On success container   | color.success.100 | #BEF4D8 |
| Warning                | color.warning.600 | #C79240 |
| Warning container      | color.warning.900 | #3C2F18 |
| On warning container   | color.warning.100 | #F5D7A3 |
| Danger                 | color.danger.600  | #E06A6A |
| Danger container       | color.danger.900  | #461F25 |
| On danger container    | color.danger.100  | #FFC4C4 |
| Surface                | color.neutral.950 | #05060A |
| Surface sunken         | color.neutral.925 | #08090D |
| Surface panel          | color.neutral.900 | #0D0F14 |
| Surface raised         | color.neutral.850 | #14161D |
| Surface hover          | color.neutral.800 | #1D2029 |
| Surface inverse        | color.neutral.50  | #F8FAFC |
| On surface             | color.neutral.50  | #F8FAFC |
| On surface secondary   | color.neutral.200 | #D8DDE6 |
| On surface muted       | color.neutral.400 | #858C9B |
| On surface inverse     | color.neutral.925 | #08090D |
| Border subtle          | color.neutral.750 | #20232D |
| Border                 | color.neutral.700 | #2C303B |
| Border strong          | color.neutral.600 | #414753 |

## Supporting values

Phase 1 では、指定アンカーだけでは Light、High Contrast、Disabled、Focus、Status text を安全に表現できないため、次の補助値を追加した。

- neutral.0、neutral.25、neutral.100、neutral.300、neutral.500: Light Theme の canvas、field、hover、divider、disabled を段階的に表現する。
- brand.700、brand.800、accent.700、accent.800: Light Theme の action/link と hover で AA を満たすための中間 ramp。
- focus、overlay、disabled: semantic role を opacity や shadow だけに依存させない。
- High Contrast の Canvas、CanvasText、ButtonFace、ButtonText、LinkText、Highlight、GrayText など: OS の forced-colors 設定に追従する。

補助値は Reference に置き、Product に直接公開しない。Semantic role と Contrast test が不要になった補助値は追加しない。

## Theme and contrast rules

- dark、light、high-contrast は同じ Semantic Token contract を共有する。
- high-contrast は system color を使い、色相差、透過、shadow を情報伝達の唯一の手段にしない。
- Light の filled primary action は brand.700 と neutral.50 を使い、白文字の contrast を維持する。
- Light の status container は対応する 100 ramp、status text は対応する 900 ramp を使う。
- Token build は通常文字について 4.5:1 の contrast pair を検証する。大きな文字、非テキスト、focus indicator の基準は Foundation と Component のテストで追加検証する。
- 状態は icon、label、border、text、layout などの冗長な手掛かりを併用する。
