---
title: Init Command - Session Initialization
description: Deckrd セッションを初期化し、タスクファイルからメタデータを抽出してセッションファイルを生成
meta:
  author: atsushifx
  license: MIT
  changed:
    - v1.0.0: 初版作成
---

## 概要

指定されたタスクファイル (`tasks.md`) から Deckrd セッション情報を抽出し、セッション設定ファイル (`docs/.deckrd/coder.session`) を初期化します。メタデータの自動抽出と初期タスクの自動検出により、セッション初期化を効率化します。

## 使用方法

```bash
# パターン1: ファイルパス直接指定
/deckrd-coder init docs/.deckrd/command-runner/os2shell/tasks/tasks.md

# パターン2: namespace/module パターン指定（推奨）
/deckrd-coder init command-runner/os2shell

# 既存セッション上書き（--force フラグ）
/deckrd-coder init command-runner/os2shell --force

# 実行例
$ /deckrd-coder init command-runner/os2shell
✓ Session initialized: docs/.deckrd/coder.session
  Title: Tasks: os2shell Module Implementation
  Status: Active
  Task File: docs/.deckrd/command-runner/os2shell/tasks/tasks.md
  Active Task: T01-08
  Total Tasks: 568

Next steps:
  /deckrd-coder coding T01-08
  # or simply: /deckrd-coder
```

## パラメータ

### `<path>` (required)

- 説明: タスクファイルへのパスまたは namespace/module パターン
- 形式:
  - ファイルパス: `docs/.deckrd/<namespace>/<module>/tasks/tasks.md` の完全パス
  - `<namespace>/<module>`: `<namespace>/<module>` パターン → 自動解決される

- 例:
  - ファイルパス: `docs/.deckrd/command-runner/os2shell/tasks/tasks.md`
  - namespace/module: `command-runner/os2shell`
  - 別プロジェクト: `analytics/report-generator`

### `--force` (optional)

- 説明: 既存セッションファイルを上書きする
- デフォルト値: false（既存ファイルがある場合はエラー）
- 使用例:

  ```bash
  /deckrd-coder init command-runner/os2shell --force
  ```

## 実装フロー

セッション初期化は以下の 8 ステップで実行されます。

1. **パラメータ解析**: コマンドラインから `<path>` と `--force` フラグを抽出
2. **パス解決**: ファイルパス vs namespace/module を判定し、フルパスを構築
3. **ファイル検証**: タスクファイルの存在確認と読み取り権限確認
4. **上書き保護**: 既存セッションファイルのチェック（`--force` フラグなしとき）
5. **メタデータ抽出**: YAML frontmatter から `title`, `based_on`, `status`, `task_count` を抽出
6. **初タスク検出**: 最初の pending タスク ID (`- [ ] **T##-##`) を検出
7. **セッション生成**: `.env` 形式でセッションファイルを作成
8. **完了報告**: 生成されたセッション情報を表示

## 重要原則

### 1. Path Pattern Auto-Resolution

`<namespace>/<module>`、は自動的に以下のパスのように解決されます。

```bash
# Input: command-runner/os2shell
# Resolution: docs/.deckrd/command-runner/os2shell/tasks/tasks.md

# Input: analytics/report-generator
# Resolution: docs/.deckrd/analytics/report-generator/tasks/tasks.md
```

判定方法:

- `<namespace>/<module>` → `<namespace>/<module>` パターン
- それ以外 - パス指定

### 2. Overwrite Protection

既存セッションファイルは上書きされません。
上書きには、`--force`オプションが必要です。

```bash
# エラー: 既存セッションは上書きされない
$ /deckrd-coder init command-runner/os2shell
Error: Session file already exists: docs/.deckrd/coder.session
  Use --force to overwrite

# 成功: --force フラグで上書き
$ /deckrd-coder init command-runner/os2shell --force
✓ Session initialized: docs/.deckrd/coder.session
```

### 3. Metadata Extraction from Frontmatter

YAML frontmatter は以下の形式とします。

```yaml
---
title: "Tasks: os2shell Module Implementation"
based_on: "implementation.md v1.1"
status: "Active"
task_count: 568
---
```

抽出されるフィールド:

- `title` → `DECKRD_SESSION_TITLE`
- `based_on` → `DECKRD_SESSION_BASED_ON`
- `status` → `DECKRD_SESSION_STATUS`
- `task_count` → `DECKRD_TASK_COUNT`

## エラーハンドリング

### パラメータが指定されていない

```bash
$ /deckrd-coder init
Error: Path parameter is required
```

→ 原因: `<path>` パラメータが省略されている。
→ 対応: パラメータを指定して再実行。

### タスクファイルが見つからない

```bash
$ /deckrd-coder init command-runner/nonexistent
Error: Task file not found: docs/.deckrd/command-runner/nonexistent/tasks/tasks.md
```

→ 原因: 指定されたパスにタスクファイルが存在しない。
→ 対応: パスを確認して正しい namespace/module を指定。

### 不正な YAML frontmatter

```bash
$ /deckrd-coder init command-runner/os2shell
Error: Missing required field 'title'
```

→ 原因: tasks.md の frontmatter に必須フィールドがない。
→ 対応: tasks.md の frontmatter に `title`, `based_on`, `status`, `task_count` が存在することを確認。

### pending タスクが見つからない

```bash
$ /deckrd-coder init command-runner/completed-module
Error: No pending tasks found in tasks.md
```

→ 原因: タスクファイルのすべてのタスクが完了している (`[x]`)。
→ 対応: 新しいタスクを追加、または別のプロジェクトを初期化。

### セッションファイル既存（--force フラグなし）

```bash
$ /deckrd-coder init command-runner/os2shell
Error: Session file already exists: docs/.deckrd/coder.session
  Use --force to overwrite
```

→ 原因: セッションファイルがすでに存在し、`--force` フラグが指定されていない。
→ 対応: `--force` フラグを付けて再実行、または既存セッションを確認。

## セッション自動更新

初期化により、`docs/.deckrd/coder.session`を生成します。

```bash
# Deckrd Coder Session Configuration
# Generated from: docs/.deckrd/command-runner/os2shell/tasks/tasks.md

DECKRD_SESSION_TITLE=Tasks: os2shell Module Implementation
DECKRD_SESSION_BASED_ON=implementation.md v1.1
DECKRD_SESSION_STATUS=Active
DECKRD_TASK_COUNT=568

# Task Source File
DECKRD_TASK_FILE=docs/.deckrd/command-runner/os2shell/tasks/tasks.md

# Active Session: Next pending task (T01-08)
DECKRD_ACTIVE_SESSION=T01-08
```

セッション初期化後、以下のコマンドで作業を開始できます。

```bash
# アクティブセッションを使用（T01-08）
/deckrd-coder

# または明示的に指定
/deckrd-coder coding T01-08
```

## 関連リソース

- [SKILL.md](../../SKILL.md) - スキル定義と概要
- [coding.md](./coding.md) - タスク実装コマンド（init 後に使用）
- [status.md](./status.md) - セッション進捗確認コマンド
- [WORKFLOW.md](../workflow.md) - 全体的なワークフロー
- [IMPLEMENTATION.md](../implementation.md) - 実装詳細（Step 1～8）
- [TROUBLESHOOTING.md](../troubleshooting.md) - トラブルシューティング

## License

MIT License
