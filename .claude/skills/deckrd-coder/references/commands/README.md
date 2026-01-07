---
title: Command Reference - deckrd-coder コマンド一覧
description: deckrd-coder スキルが提供するすべてのコマンドのドキュメント管理ガイド
meta:
  author: atsushifx
  license: MIT
---

## コマンドリファレンス

このディレクトリは、`deckrd-coder` スキルが提供するすべてのコマンドのドキュメントを管理します。

## コマンド一覧

### [coding](./coding.md) - BDD タスク実装（デフォルト）

概要: Deckrd セッションで定義されたタスクを BDD (Behavior-Driven Development) 厳格プロセスに従って実装します。

使用例:

```bash
/deckrd-coder coding T01-02
/deckrd-coder T01-02              # coding は省略可能
/deckrd-coder coding              # アクティブセッションを使用
/deckrd-coder                      # 全省略
```

詳細: [coding.md](./coding.md) を参照してください。

### [status](./status.md) - セッション進捗確認

概要: Deckrd セッションの現在の進捗状況を表示します。

完了状況、進捗率、次のタスク予定などを一覧表示します。

使用例:

```bash
/deckrd-coder status
/deckrd-coder st                  # 省略形
```

詳細: [status.md](./status.md) を参照してください。

## コマンド追加ガイド

新しいコマンドを追加する手順:

### 1. ドキュメント作成

`<command-name>.md` というファイルを作成し、以下を作成:

- 概要: コマンドの説明
- 使用方法: 基本構文と具体例
- パラメータ: 各パラメータの説明
- 実装フロー: コマンド実行時の処理ステップ
- 重要原則: コマンド固有のルール
- エラーハンドリング: 予想されるエラーケースと対応
- 関連リソース: 参照ドキュメント

テンプレートは [COMMAND_TEMPLATE.md](./COMMAND_TEMPLATE.md) を参照してください。

### 2. SKILL.md を更新

`SKILL.md` の「基本的な使い方」セクションにある「コマンド一覧」テーブルを更新し、新しいコマンドを追加:

```markdown
| コマンド        | 説明                             | 参照                                                   |
| --------------- | -------------------------------- | ------------------------------------------------------ |
| `coding`        | BDD タスク実装（**デフォルト**） | [coding.md](./references/commands/coding.md)           |
| `[new-command]` | [説明]                           | [new-command.md](./references/commands/new-command.md) |
```

### 3. README.md を更新

スキルの `README.md` にあるコマンド一覧表を更新してください。

## コマンド設計原則

- 1 責任: 各コマンドは 1 つの責任を担う
- 明示性: コマンド名はその機能を明確に示す
- 拡張性: 新しいコマンドを簡単に追加できる構造
- ドキュメント優先: コマンドの動作は必ずドキュメントに記載

## 関連リソース

- [SKILL.md](../SKILL.md) - スキル定義
- [README.md](../README.md) - スキル概要
- [WORKFLOW.md](../workflow.md) - 実装ワークフロー
- [IMPLEMENTATION.md](../implementation.md) - 実装詳細
- [TROUBLESHOOTING.md](../troubleshooting.md) - トラブルシューティング
