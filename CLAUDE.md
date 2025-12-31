# CLAUDE.md

<!-- textlint-disable ja-technical-writing/max-comma -->

## Core Principles

### Project Status

- TypeScript library template → os2shell module active development
- Deckrd workflow: Requirements → Specifications → Implementation → Tasks execution
- Implementation started: `src/_internal/types/`, `shared/types/` created
- Task tracking: `docs/.deckrd/command-runner/os2shell/tasks/tasks.md` (568 tasks, T01-01 completed)

### AI Collaboration Rules

- コミット: コミットメッセージは **自動生成必須** (手動作成禁止)
  - `git add <files>` → `git commit` で hook が自動生成
  - 生成エラー時のみ手動対応

- メモリー活用: serena-mcp の 5 つのメモリーを参照
  - project_overview, code_style_conventions, suggested_commands など
  - `mcp__plugin_claude-idd-framework_serena-mcp__read_memory` でアクセス

- ドキュメント優先:
  - 詳細情報は `docs/` 配下に記載
  - CLAUDE.md は指針のみ (繰り返しなし)

- 無視すべき自動化:
  - dprint/ESLint で自動化可能な手動修正は不要
  - CRLF 改行の手動変更不要 (LF 設定完了)
  - 改行・スペース調整は dprint に任せる

### Non-Negotiable Standards

- 改行: LF (Unix-style) 必須
- エンコーディング: UTF-8 必須
- シークレット: `pnpm lint:secrets` で検出・排除 (重要)
- ファイル配置:
  - 共有型 → `shared/types/*.types.ts`
  - テスト → テストする対象に応じてファイル名設定 (例: `RawOSPlatformType.spec.ts`)

---

## Technical Context

### Tech Stack

- Language: TypeScript 5.9+ (ES2022, strict mode)
- Runtime: Node.js ≥ 20, pnpm ≥ 10.24.0
- Build: tsup (ESM)
- Test: Vitest 4.x (unit, functional, integration, e2e)
- Quality: ESLint 9.x, dprint, gitleaks, secretlint, commitlint

### Project Structure

```bash
.
├── src/                              # 実装コード
│   └── _internal/types/              # 内部型定義
│       └── __tests__/unit/           # ユニットテスト (.spec.ts)
├── shared/types/                     # 共有型定義
├── docs/
│   ├── dev-standards/               # 開発標準 (01-06-*.md)
│   ├── projects/                    # プロジェクト詳細
│   └── .deckrd/command-runner/os2shell/
│       ├── tasks/tasks.md           # 実装タスク 568 件
│       ├── requirements/
│       ├── specifications/
│       ├── implementation/
│       └── DecisionRecords.md
├── configs/                         # ツール設定 (eslint, vitest など)
├── scripts/                         # 開発スクリプト
└── CLAUDE.md                        # このファイル
```

### Essential Commands

```bash
# コミットワークフロー
git add <files>
git commit              # 自動メッセージ生成

# 品質チェック
pnpm format:dprint     # コード整形
pnpm check:types       # 型チェック
pnpm lint:secrets      # シークレット検出 (重要)
pnpm lint:filenames    # ファイル名規約

# テスト実行
pnpm test:develop      # ユニットテスト
pnpm test:functional   # 関数テスト

# ビルド
pnpm clean && pnpm exec tsup --config ./configs/tsup.config.esm.ts
```

### Implementation Guidelines

- テスト実装パターン:
  - Format: BDD (Given-When-Then comments)
  - Coverage: 正常系 (normal) / 異常系 (invalid) / エッジケース (edge cases)
  - File extension: `.spec.ts` (unit), `.test.ts` (functional/integration/e2e)

- ファイル命名:
  - テストは対象に合わせる (例: `RawOSPlatformType.spec.ts`)
  - 型ファイルは用途で分類 (例: `raw-os-platform.types.ts`)

---

## Documentation References

### Detailed Information (外部ドキュメント)

Development standards (`docs/dev-standards/`):

- 01-onboarding.md: セットアップ手順
- 02-development-workflow.md: 開発フロー詳細
- 03-commit-message-conventions.md: コミットメッセージ規約
- 04-quality-assurance.md: 品質保証・ゲート
- 05-coding-conventions.md: コーディング規約
- 06-ai-assisted-development.md: AI 支援開発

Project-specific (`docs/projects/`):

- mcp_servers.md: MCP サーバー統合
- development_tools.md: ツールインストール
- using_template.md: テンプレート初期化

### Deckrd Workflow Status

- Active Module: os2shell
- Current Phase: Tasks execution → T01-02～T01-12 next
- Task Location: `docs/.deckrd/command-runner/os2shell/tasks/tasks.md`
- Completed: Section 01 T01-01

---

**Last Updated**: 2025-12-31 (T01-01 implementation & CLAUDE.md refactoring)
