---
name: deckrd-coder
description: An agent that codes tasks in BDD-style. Automatically does not commit.
license: MIT
meta:
  author: atsushifx
  version: 0.0.3
---

<!-- textlint-disable ja-technical-writing/sentence-length -->

# deckrd-coder

deckrd マーケットプレイスの BDD コーディングプラグイン。

## 概要

Deckrd ワークフローの tasks.md から指定したタスク（例:`T01-02`）を読み込み、BDD（Behavior-Driven Development）厳格プロセスで実装を自動化する deckrd 専用プラグインです。

## 特徴

- deckrd 前提: deckrd ワークフローと完全統合
- Red-Green-Refactor 厳密実装: テスト駆動開発の原則を厳守
- マルチ言語対応: TypeScript/Vitest、Python/pytest など、任意の言語とテストフレームワークに対応
- TodoWrite 統合: タスク進捗を自動追跡
- 品質ゲート統合: 型チェック、リント、テスト、ビルドの自動実行

## 使用方法

### 基本構文

`deckrd-coder` はコマンドベースアーキテクチャで動作:

```bash
# 推奨:明示的なコマンド指定
/deckrd-coder coding <TASK_ID>

# コマンド省略（デフォルトで coding コマンドを実行）
/deckrd-coder <TASK_ID>

# パラメータ省略（アクティブセッション自動使用）
/deckrd-coder coding
/deckrd-coder
```

### 実行例

```bash
# 推奨的な指定方法
/deckrd-coder coding T01-02

# 簡潔な指定方法（coding は省略可能）
/deckrd-coder T01-02

# アクティブセッションを使用
/deckrd-coder
```

### コマンド一覧

| コマンド | 説明                          | リファレンス                                 |
| -------- | ----------------------------- | -------------------------------------------- |
| `coding` | **デフォルト** BDD タスク実装 | [coding.md](./references/commands/coding.md) |
| `status` | セッション進捗確認            | [status.md](./references/commands/status.md) |

詳細は各コマンドのドキュメント（`references/commands/<command>.md`）を参照してください。

## 統合コンポーネント

### スキル

- **deckrd-coder**: deckrd タスク解析と BDD 実装自動化スキル

### 外部エージェント

- **bdd-coder**: 指定タスク実装の専用エージェント（独立起動）
  - Red-Green-Refactor サイクルで実装を推進
  - deckrd-coder スキルから呼び出されて動作

## インストール

このプラグインは deckrd マーケットプレイスに組み込まれています。

### Claude Code での利用

```bash
# deckrd-coder スキルを使用
/deckrd-coder <TASK_ID>
```

## 構成

```bash
deckrd-coder/
├── SKILL.md                 # 実装スキル定義
├── manifest.json            # プラグインメタデータ
├── README.md               # このファイル
├── assets/                 # アセット（テンプレートなど）
├── references/             # リファレンスドキュメント
└── scripts/                # ユーティリティスクリプト
```

## 実行フェーズ

スキル内で以下のフェーズを自動管理:

1. **Phase 1**: セッション・タスク情報取得
   - `docs/.deckrd/coder.session` からアクティブセッション確認
   - tasks.md から指定タスク ID のテストケース一覧を抽出

2. **Phase 2**: プロジェクト情報・コード規約参照
   - code_style_conventions.md で命名規約・ファイル配置ルール確認
   - project_overview.md で技術スタック・プロジェクト構造確認

3. **Phase 3**: Red-Green-Refactor サイクル実装（各テストケースごとに繰り返し）
   - `[Red]`テストを書く
   - テスト失敗確認（エラーメッセージを確認）
   - `[Green]` 最小限の実装追加
   - テスト成功確認
   - `[Refactor]` ソースを簡潔なもの、読みやすいものに修正
   - Todo を更新
   - 次のテストケースへ

4. **Phase 4**: 品質ゲート実行（bdd-coderエージェント内）
   - ユニットテスト実行
   - 型チェック
   - Lintチェック

5. **Phase 5**: 実装完了
   - 全テスト PASS、型エラーなし確認
   - tasks.md の該当タスクをチェック
   - コミットは実行しない（ユーザーが手動で実施）

## 関連リソース

- [deckrd マーケットプレイス](https://github.com/atsushifx/deckrd)
- [親プロジェクト: aglabo-command-runner](https://github.com/atsushifx/aglabo-command-runner)

## ライセンス

MIT License - Copyright (c) 2025 atsushifx

## サポート

問題報告や機能リクエストは GitHub Issues をご利用ください。

- GitHub Issues: <https://github.com/aglabo/deckrd/issues>
