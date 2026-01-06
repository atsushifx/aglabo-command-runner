---
title: Coding Command - BDD Task Implementation
description: タスク実装コマンド - BDD 厳格プロセスに従って実装を実行
meta:
  author: atsushifx
  license: MIT
---

<!-- textlint-disable ja-technical-writing/no-exclamation-question-mark -->

## 概要

このコマンドは **2 つのモード** で動作します。

- 検索モード: アクティブセッションが空白または実装済みの場合、最初の未実装タスクを検出
- 実装モード: 未実装のタスク ID を指定されたとき、**BDD (Behavior-Driven Development) 厳格プロセス** に従って実装

通常のタスク実装は実装モードで実行されます。実装の詳細なステップ、品質ゲート、チェックリストは [IMPLEMENTATION.md](./implementation.md) を参照してください。

## 使用方法

```bash
# 検索モード: アクティブセッションが空白の場合
/deckrd-coder coding
# → 最初の未実装タスクを検索し表示、また未実装タスクをアクティブセッションに保存

# 実装モード: タスク ID を指定
/deckrd-coder coding T01-02
# → 指定されたタスクを実装

# 実装モード: アクティブセッションが未実装の場合
/deckrd-coder coding
# → アクティブセッションのタスクを実装

# coding キーワードは省略可能
/deckrd-coder T01-02
/deckrd-coder
```

## パラメータ

### タスク ID (optional)

- 形式: `T<Section(2-digit)>-<Subsection(2-digit)>`
- 例: `T01-02`, `T01-08`, `T02-03`
- 省略時: `DECKRD_ACTIVE_SESSION` で指定されたアクティブタスクを自動実装

### 詳細 ID (非推奨)

- 形式: `T<Section(2-digit)>-<Subsection(2-digit)>-<TestCase(2-digit)>`
- 例: `T01-02-01`
- 注意: 通常はセクション ID での指定を推奨

## 動作モード

coding コマンドは以下のモード判定ロジックに従って **2 つのモード** で動作します。

### モード判定ロジック

```text
IF パラメータでタスク ID が指定されている THEN
    実装モード（指定されたタスクを実装、実装済みかどうかはチェックしない）
ELSE IF DECKRD_ACTIVE_SESSION が空白 THEN
    検索モード（最初の未実装タスクを検出）
ELSE IF タスクファイル内で DECKRD_ACTIVE_SESSION が [x] THEN
    検索モード（次の未実装タスクを検出）
ELSE
    実装モード（アクティブセッションのタスク実装）
END IF
```

### 検索モード (Search Mode)

**起動条件**:

- アクティブセッション (`DECKRD_ACTIVE_SESSION`) が空白の場合
- アクティブセッションのタスクがすでに実装済み（`[x]`）の場合

**動作**:

1. セッションファイル (`docs/.deckrd/coder.session`) から `DECKRD_TASK_FILE` を取得
2. タスクファイルを`rg`で、`- [ ]`を検索
3. 検出されたタスク ID を表示 (実装は行わない)
4. 検出されたタスク ID をアクティブセッションに登録

**出力例**:

```plaintext
🔍 Search Mode: Next pending task detected

Task ID: T01-08
Title: Create shared/types/os2shell.types.ts File
Status: Pending

Next steps:
  - Update session file: DECKRD_ACTIVE_SESSION=T01-08
  - Run implementation: /deckrd-coder coding T01-08
```

### 実装モード (Implementation Mode)

**起動条件**:

- パラメータで明示的にタスク ID が指定されている場合
- アクティブセッションのタスクが未実装（`[ ]`）の場合

**動作**:

1. implementation.md に従って BDD 厳格プロセスで実装
2. Step 1～8 の実装フローを実行
3. 実装完了後、次のタスク ID をアクティブセッションに設定

## 実装フロー

```text
Step 0: モード判定（検索 or 実装）
    ↓
[検索モード]
Step 1: タスクファイル読み込み
Step 2: 最初の未実装タスク検出
Step 3: タスク情報表示
Step 4: 終了

[実装モード]
Step 1: 品質ゲート用コマンド取得
Step 2: 実装タスクリスト取得
Step 3-4: BDD サイクル (Red-Green-Refactor)
Step 5: 品質ゲート実行 (全体検証)
Step 6: 進捗記録
Step 7: Refactor フェーズ (全体コード整理)
Step 8: 完了判定
```

**詳細**:

- 検索モード: このドキュメントの「## 検索モード詳細」を参照
- 実装モード: [IMPLEMENTATION.md](./implementation.md) - 各ステップの目的、実行内容、チェックリスト

## 検索モード詳細

### タスク検出アルゴリズム

1. セッション情報取得:

   ```bash
   # docs/.deckrd/coder.session から取得
   DECKRD_TASK_FILE=docs/.deckrd/command-runner/os2shell/tasks/tasks.md
   DECKRD_ACTIVE_SESSION=T01-08  # または空白
   ```

2. タスクファイル読み込み:
   - `DECKRD_TASK_FILE` のパスからタスクファイルを読み込み
   - YAML frontmatter をスキップ

3. 未実装タスク検索:

   ```regex
   Pattern: ^- \[ \] \*\*T(\d{2})-(\d{2})(-\d{2})?\*\*
   ```

   - 先頭から順にマッチング
   - 最初に見つかったタスクで停止

4. タスク情報抽出:
   - Task ID: `T01-08` または `T01-08-01` 形式
   - Title: `**T##-##** Given:... / When:... / Then:...` から抽出
   - Status: `Pending`（未チェックのため）

5. 結果表示:
   - Task ID、Title、Status を表示
   - 次のステップ（セッション更新、実装開始）を提示
   - 終了（実装は行わない）

### エラーハンドリング

#### 未実装タスクが見つからない場合

```plaintext
⚠️  All tasks completed

All tasks in the task file are marked as completed.

Next steps:
  - Review completed tasks
  - Create new task file for next module
  - Update session status to "Completed"
```

#### タスクファイルが見つからない場合

```plaintext
❌ Error: Task file not found

File: docs/.deckrd/command-runner/os2shell/tasks/tasks.md

Fix:
  - Check DECKRD_TASK_FILE value in session file
  - Verify task file exists at specified path
```

## セッション自動更新

実装完了後、セッションファイルを自動更新:

```bash
# 実装前
DECKRD_ACTIVE_SESSION=T01-08

# T01-08 実装後
DECKRD_ACTIVE_SESSION=T01-09
```

## 関連リソース

- [init.md](./init.md) - セッション初期化コマンド
- [status.md](./status.md) - セッション進捗確認
- [IMPLEMENTATION.md](./implementation.md) - Step 1～8 の詳細ステップ、品質ゲート、チェックリスト
- [WORKFLOW.md](./workflow.md) - Phase 0～5 の全体フロー
- [TROUBLESHOOTING.md](./troubleshooting.md) - エラー時の対応
- [FAQ.md](./faq.md) - よくある質問

## 更新履歴

- v1.1: 簡素化版へ更新 (詳細は IMPLEMENTATION.md に集約)
- v1.0.0: コマンドベースアーキテクチャへの移行に伴い作成
