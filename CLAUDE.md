# CLAUDE.md

## コア原則

### プロジェクト状態

- TypeScriptライブラリ用テンプレートプロジェクト
- `src/`ディレクトリ未作成（実装コードなし）
- テンプレート段階 - 設定/ドキュメント/スクリプトに注力

### AI協働ルール

- **コミットメッセージ**: 自動生成必須（手動作成禁止）
- **メモリー活用**: serena-mcpの5つのメモリーを優先参照
- **ドキュメント優先**: 詳細は `docs/` 配下を参照
- **品質ゲート**: コミット前に自動実行（手動も可）

### 絶対禁止事項

- 手動でのコミットメッセージ作成
- CRLF改行の使用（LF必須）
- シークレット情報のコミット
- dprint/ESLintで自動化可能な手動修正

## 技術コンテキスト

### スタック

- TypeScript 5.9+ (ES2022, strict)
- Node.js >= 20, pnpm >= 10.24.0
- Build: tsup, Test: Vitest 4.x
- Lint: ESLint 9.x, textlint, markdownlint
- Format: dprint (120文字, 2スペース, LF)
- Security: gitleaks, secretlint

### 必須コマンド

コミットワークフロー:

```bash
git add <files>
git commit              # 自動メッセージ生成
```

品質チェック（コミット前推奨）:

```bash
pnpm format:dprint      # コード整形
pnpm lint:filenames     # ファイル名
pnpm lint:text          # テキスト
pnpm lint:markdown      # Markdown
pnpm lint:secrets       # シークレットスキャン（重要）
pnpm check:spells       # スペルチェック
pnpm check:types        # 型チェック（src/作成後）
```

### プロジェクト構造

```text
.
├── src/                    # 未作成（実装予定）
├── configs/                # プロジェクト固有設定
├── base/configs/           # ベース設定（継承用）
├── scripts/                # 開発スクリプト
│   └── prepare-commit-msg.sh
├── docs/
│   ├── dev-standards/      # 開発標準
│   └── projects/           # プロジェクト固有ドキュメント
├── lefthook.yml            # Git hooks設定
└── package.json
```

### Git Hooks（自動実行）

1. pre-commit: gitleaks, secretlint（並列）
2. prepare-commit-msg: AIコミットメッセージ生成
3. commit-msg: commitlint（形式検証）

### テンプレート固有の注意

- `check:types` は src/ 作成後に有効
- シンボル検索は src/ 作成後に有効
- build/test コマンドは package.json に追加が必要

## ドキュメント参照

### serena-mcp メモリー

詳細情報が格納されたメモリー（優先参照）:

- `project_overview` - プロジェクト全体概要
- `code_style_conventions` - コーディング規約
- `suggested_commands` - 推奨コマンド集
- `task_completion_checklist` - タスク完了チェックリスト
- `windows_environment` - Windows環境情報

### 開発標準（docs/dev-standards/）

- `01-onboarding.md` - 新規参加者向けセットアップ
- `02-development-workflow.md` - 開発ワークフロー
- `03-commit-message-conventions.md` - コミットメッセージ規約
- `04-quality-assurance.md` - 品質保証とゲート
- `05-coding-conventions.md` - コーディング規約
- `06-ai-assisted-development.md` - AI支援開発

### プロジェクト固有（docs/projects/）

- `commit_message_system.md` - コミットメッセージ生成の実装
- `git_hooks.md` - Git hooks設定詳細
- `mcp_servers.md` - MCPサーバー統合
- `development_tools.md` - ツールインストール
- `repository_structure.md` - リポジトリ構造詳細
- `plugin_integration.md` - Claude Codeプラグイン
- `using_template.md` - テンプレート初期化手順

### MCP サーバー

- **serena-mcp**: セマンティックコード操作
  - シンボル検索・編集（src/作成後）
  - 上記5つのメモリー管理
- **lsmcp**: LSPベースIDE機能
  - 定義ジャンプ、ホバー、診断
  - 設定ファイルで現在利用可能

詳細: `docs/projects/mcp_servers.md`

## 重要な環境設定

- **改行**: LF (Unix-style) 必須
- **エンコーディング**: UTF-8 必須
- **プラットフォーム**: Windows最適化（クロスプラットフォーム対応）
- **初回セットアップ**: `pnpm install && pnpm prepare`
