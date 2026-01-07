---
name: deckrd-coder
description: An agent that codes tasks in BDD-style. Automatically does not commit.
allowed-tools: Task, Bash, Read, Grep, Glob
license: MIT
meta:
  author: atsushifx
  version: 0.0.3
  changed:
    - v0.0.4: コマンドベースアーキテクチャへの移行。`coding` コマンドをデフォルトに設定。各コマンドの詳細仕様を `references/commands/<command>.md` に集約
    - v0.0.1: 初版
---

<!-- textlint-disable ja-technical-writing/no-exclamation-question-mark -->

# /deckrd-coder スキル - Deckrd タスク実装ガイド

**このスキルは、Deckrd セッションで定義されたタスクを BDD 厳格プロセスに従って実装します。**

---

## ⚠️ 重要事項

### コミット除外

このスキルは **実装まで行いますが、コミットはしません**。実装後のコミットはユーザーが手動で実施してください。

```bash
(NG) git add .
(NG) git commit -m "..."
(NG) /idd-pr  # PR 生成も禁止
```

### テスト・品質ゲート必須

実装は2段階の品質ゲートで検証されます：

1. **Phase 4 (bdd-coderエージェント内)** - 簡略版
   - 全テストが PASS
   - 型チェック合格
   - Lint合格

2. **ステップ 7 (coding コマンド全体)** - 完全版
   - テスト・型・Lint加えて、セキュリティ・ファイル命名規約・スペルチェック・テキスト品質など全項目合格

---

## 概要

### What (何をするのか)

Deckrd セッションで定義されたタスクを、**BDD (Behavior-Driven Development) の厳格プロセス** に従って実装します。
**1つのスキル呼び出し = 1つのタスク実装** という原則を厳守します。

### Why (なぜこの方法を使うのか)

- 品質保証: Red-Green-Refactor サイクルで高品質なコードを実現
- 追跡可能性: 各ステップが記録され、何をいつなぜ実装したかが明確
- トークン効率化: プロジェクトメモリ & serena-mcp により不要な説明を削減

### How (どのように実装するのか)

9 つのステップ (Step 1～9) で構成される実装フロー:

1. **Step 1**: 品質ゲート用コマンド取得
2. **Step 2**: 実装タスクリスト取得
3. **Step 3**: 未実装タスク抽出
4. **Step 4**: bdd-coderエージェントへ委譲 (Red-Green-Refactor + 簡略版品質ゲート)
5. **Step 5**: 完了タスク記録
6. **Step 6**: 繰り返し判定
7. **Step 7**: 品質ゲート実行 (全項目検証) ← 全タスク完了後
8. **Step 8**: Refactor フェーズ (全体コード整理)
9. **Step 9**: 完了判定

詳細は [IMPLEMENTATION.md](./references/implementation.md) を参照。

---

## 基本的な使い方

### コマンド形式

deckrd-coder はコマンドベースアーキテクチャで動作します。

```bash
# 推奨: 明示的なコマンド指定
/deckrd-coder coding T01-02

# コマンド省略（デフォルトで coding を実行）
/deckrd-coder T01-02

# コマンド + パラメータ省略（アクティブセッション使用）
/deckrd-coder coding

# 全省略（アクティブセッション + coding コマンド）
/deckrd-coder
```

### コマンド一覧

| コマンド   | 説明                           | 参照                                         |
| ---------- | ------------------------------ | -------------------------------------------- |
| `coding`   | **デフォルト** BDD タスク実装  | [coding.md](./references/commands/coding.md) |
| `status`   | セッション進捗確認             | [status.md](./references/commands/status.md) |
| `init`     | セッション初期化               | [init.md](./references/commands/init.md)     |
| (拡張予定) | 他のコマンドは必要に応じて追加 | TBD                                          |

> 注意
>
> 複数タスク指定は非推奨 (1 message = 1 task の原則)

### Task ID 指定形式

| ID 形式       | 例          | 説明                              |
| ------------- | ----------- | --------------------------------- |
| セクション ID | `T01-02`    | **推奨** (単一テストケース対応)   |
| 詳細 ID       | `T01-02-01` | **非推奨** (テストケース詳細指定) |

詳細な使用方法とよくある質問は [FAQ.md](./references/faq.md) を参照。

---

## 全体的な戦略

### 6 つの Phase で構成

```bash
Phase 0: 開発環境の初期化
    ↓
Phase 1: deckrd セッション・タスク情報の取得
    ↓
Phase 2: 実装タスクリスト (細分化) の作成
    ↓
Phase 3: Red-Green-Refactor による実装
    ↓
Phase 4: 品質ゲート (Lint・型チェック・テスト) の実行
    ↓
Phase 5: 完了確認
```

### 各 Phase の概要

| Phase | 役割         | 詳細                                         |
| ----- | ------------ | -------------------------------------------- |
| 0     | 開発環境確認 | Node.js、npm、テストフレームワークなどの確認 |
| 1     | 情報取得     | セッション・タスク定義から実装内容を抽出     |
| 2     | タスク細分化 | 実装タスクを小さなステップに分割             |
| 3     | BDD 実装     | Red-Green-Refactor サイクルで実装            |
| 4     | 品質ゲート   | Lint・型チェック・テスト実行                 |
| 5     | 完了確認     | すべての条件が満たされたか確認               |

詳細は [WORKFLOW.md](./references/workflow.md) を参照してください。

---

## リファレンス

### 参照ドキュメント一覧

このスキルは以下のドキュメントを厳密に参照・遵守します。

#### 0. コマンドリファレンス

各コマンドの詳細仕様は `references/commands/` 配下に管理されています。

- [coding.md](./references/commands/coding.md) - BDD タスク実装コマンド（**デフォルト**）
- [status.md](./references/commands/status.md) - セッション進捗確認コマンド
- [init.md](./references/commands/init.md) - セッション初期化コマンド
- 拡張コマンド: あとで追加予定

#### 1. [WORKFLOW.md](./references/workflow.md)

**対象**: Phase 0～5 の全体フロー
**用途**: スキル実行前に全体を理解したいとき。

#### 2. [IMPLEMENTATION.md](./references/implementation.md)

**対象**: Step 1～8 の詳細手順
**用途**: 実装中に困ったとき、エラーが発生したとき。

**主要な原則**:

- 1 message = 1 test: 複数タスクは実装しない
- Step 順序の厳密性: ステップをスキップしない
- 最小実装の遵守: Green フェーズは過剰実装を禁止
- 品質ゲート必須: Step 5 は必ず実行、失敗時は 3 回まで対応

#### 3. [TROUBLESHOOTING.md](./references/troubleshooting.md)

**対象**: WORKFLOW・IMPLEMENTATION から逸脱した場合の対応
**用途**: エラー発生時、フロー判定に迷ったとき。

#### 4. [FAQ.md](./references/faq.md)

**対象**: よくある質問と回答
**用途**: 実装方法の詳細、Q&A 確認。

---

### 外部エージェント: bdd-coder

**概要**: 指定したタスク実装を専門に行う独立した専用エージェント

**役割**: deckrd-coder スキルの **Step 3** から呼び出され、以下の実装業務を担当:

- Red フェーズ: テスト実装 → テスト失敗確認
- Green フェーズ: 最小実装 → テスト合格確認
- Refactor フェーズ: 軽微な整理 (ユーザー相談なし)
- 品質ゲート確認: Lint・型チェック合格確認

**独立起動**: deckrd-coder 経由でなく直接起動も可能

詳細は bdd-coder エージェントのドキュメントを参照。

---

## セッション設定

このスキルは `docs/.deckrd/coder.session` でセッション情報を管理します。

### セッションファイル形式 (`.env`)

```bash
# セッション メタデータ
DECKRD_SESSION_TITLE=Tasks: os2shell Module Implementation
DECKRD_SESSION_BASED_ON=implementation.md v1.1
DECKRD_SESSION_STATUS=Active
DECKRD_TASK_COUNT=568

# タスク ソースファイル
DECKRD_TASK_FILE=docs/.deckrd/command-runner/os2shell/tasks/tasks.md

# アクティブ セッション
DECKRD_ACTIVE_SESSION=T01-07
```

### セッション自動読み込み

パラメータなしで `/deckrd-coder` を実行:

1. `docs/.deckrd/coder.session` を読み込む
2. `DECKRD_ACTIVE_SESSION` の値を取得 (例: `T01-08`)
3. そのタスク ID で coding コマンドを自動実行

例:

```bash
# セッションファイルが DECKRD_ACTIVE_SESSION=T01-08 を持つ場合
/deckrd-coder          # → /deckrd-coder coding T01-08 と同じ動作
```

### セッション更新

セッションファイルの更新は、専用スクリプトで実施:

#### 通常実行（直接）

```bash
# タスク ID を更新
./.claude/skills/deckrd-coder/scripts/update-deckrd-session.sh DECKRD_ACTIVE_SESSION T01-09

# セッションステータスを更新
./.claude/skills/deckrd-coder/scripts/update-deckrd-session.sh DECKRD_SESSION_STATUS Paused

# タスクファイルパスを更新
./.claude/skills/deckrd-coder/scripts/update-deckrd-session.sh DECKRD_TASK_FILE docs/.deckrd/.../another-tasks.md
```

#### Plugin / Agent での実行（`${CLAUDE_PLUGIN_ROOT}` 参照）

```bash
# Plugin 環境での実行
bash "${CLAUDE_PLUGIN_ROOT}/.claude/skills/deckrd-coder/scripts/update-deckrd-session.sh" DECKRD_ACTIVE_SESSION T01-09
bash "${CLAUDE_PLUGIN_ROOT}/.claude/skills/deckrd-coder/scripts/update-deckrd-session.sh" DECKRD_SESSION_STATUS Paused
bash "${CLAUDE_PLUGIN_ROOT}/.claude/skills/deckrd-coder/scripts/update-deckrd-session.sh" DECKRD_TASK_FILE docs/.deckrd/.../another-tasks.md

# セッションファイルカスタマイズ
export DECKRD_SESSION_FILE="docs/.deckrd/custom.session"
bash "${CLAUDE_PLUGIN_ROOT}/.claude/skills/deckrd-coder/scripts/update-deckrd-session.sh" DECKRD_ACTIVE_SESSION T01-09
```

> 重要:
> セッションファイルは直接編集を避け、`update-deckrd-session.sh` スクリプトを使用してください。
> これにより一貫性と追跡可能性が確保されます。
> Plugin 環境では `${CLAUDE_PLUGIN_ROOT}` を使用することで、プロジェクトルートに依存しない動作が実現できます。

---

## トークン効率化メカニズム

### 1. プロジェクトメモリ活用

スキル実行時に以下のメモリを自動参照:

- `code_style_and_conventions`: コーディング規約
- `project_overview`: プロジェクト概要
- `project_structure`: プロジェクト構成
- `suggested_commands`: 実行コマンド

### 2. serena-mcp による高速検索

- シンボル検索、型情報取得を効率化
- 不要なファイル全文読み込みを削減

### 3. bdd-coder エージェント連携

- deckrd-coder スキルが高レベル指示をし、bdd-coder が実装を担当
- bdd-coder が TodoWrite で詳細な進捗管理を実施
- 専用エージェントによるコンテキスト分割でメモリ効率化

## License

MIT License
