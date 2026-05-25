# タスク管理アプリ（フロントエンド）

## 概要

タスク管理アプリのフロントエンド(Next.js)です。<br>
[バックエンド](https://github.com/init-tshirai/portfolio-backend) と組み合わせて利用します。

URL: https://portfolio-frontend-self-psi.vercel.app/ <br>
ログイン情報<br>
メールアドレス: normal@example.com <br>
パスワード: faipheiz4ieY

---

## 目次

- [タスク管理アプリ（フロントエンド）](#タスク管理アプリフロントエンド)
  - [概要](#概要)
  - [目次](#目次)
  - [使用技術](#使用技術)
  - [インフラ構成](#インフラ構成)
  - [認証・認可について](#認証認可について)
  - [画面構成](#画面構成)
  - [ER図・API設計](#er図api設計)
  - [環境変数](#環境変数)
    - [ローカル（`.env.local`）](#ローカルenvlocal)
  - [技術選定理由](#技術選定理由)
  - [ローカル環境でのセットアップ](#ローカル環境でのセットアップ)
    - [前提](#前提)
    - [手順](#手順)
  - [ディレクトリ構成（主要）](#ディレクトリ構成主要)
  - [最後に](#最後に)

---

## 使用技術

フロントエンド: Next.js, Tailwind CSS <br>
バックエンド: Ruby on Rails, PostgreSQL <br>
インフラ: Vercel(Next.js), Render(Ruby on Rails), Supabase(PostgreSQL)

---

## インフラ構成

[インフラ構成](https://github.com/init-tshirai/portfolio-frontend/docs/infrastructure_architecture.md)

---

## 認証・認可について

[認証・認可について](https://github.com/init-tshirai/portfolio-frontend/docs/auth.md)


---

## 画面構成

| パス | 説明 |
|------|------|
| `/login` | ログイン |
| `/` | ログイン後の振り分け（権限に応じて `/tasks` または `/forbidden`） |
| `/tasks` | タスク一覧（検索・ページネーション） |
| `/tasks/new` | タスク新規作成 |
| `/tasks/[id]` | タスク詳細・更新・削除 |
| `/forbidden` | 権限不足（リダイレクトの終端） |

## ER図・API設計

[ER図](https://github.com/init-tshirai/portfolio-backend/docs/entity_relationship_diagram.md)

[API設計](https://github.com/init-tshirai/portfolio-backend/docs/api_design.md)

---

## 環境変数

### ローカル（`.env.local`）

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

- 末尾スラッシュや`/api/v1` は付けない
- Rails APIを別ポート（3001）で起動している前提

---

## 技術選定理由

| 技術 | 選定理由 |
|------|----------|
| **Next.js** | React ベースで画面とサーバー処理をまとめて書ける。API 連携や認証（Cookie）をサーバー側で扱いやすく、Vercel へのデプロイも容易 |
| **TypeScript** | オブジェクトの型を明示するため、保守性に優れる |
| **Tailwind CSS** | CSSフレームワークを利用することで、デザインの標準化が図れる。 |

---

## ローカル環境でのセットアップ

### 前提

- Node.js v24.14.1 のインストール
- [portfolio-backend](https://github.com/init-tshirai/portfolio-backend) のセットアップおよび起動（`http://localhost:3001`）

### 手順

※先頭の$マークは一般ユーザーで操作することを意味します。コマンドには含めないでください。
```bash
$ cd (portfolio-frontend のディレクトリ)
$ npm install
$ cp env.local.example .env.local
$ npm run dev
```

ブラウザで `http://localhost:3000` を開きます。 <br>
ログイン画面が表示されたらフロントエンドの起動は成功です。

以下でログインに成功したらバックエンドとの連携も成功です。 <br>
メールアドレス: normal@example.com <br>
パスワード: password

---

## ディレクトリ構成（主要）

```
src/app/
  page.tsx              # ログイン後の遷移先振り分け
  login/                # ログイン画面
  forbidden/            # 権限不足時に表示する画面
  tasks/                # タスク CRUD 画面
  api/auth/             # ログイン・ログアウト
  lib/
    auth.ts             # Cookie からトークン取得
    currentUser.ts      # ログイン中ユーザーとその権限を取得
```

---

## 最後に

本アプリケーションは、機能規模だけで言えばRails単体で十分実現可能ですが、 <br>
実務で多い「Rails API + フロントエンド」の構成を一通り設計・実装することを目的として作成しました。

認証、認可の実装方法や、フロントとバックエンドの責務の組み立てに苦労しました。 <br>
将来的に別のクライアント（モバイルアプリなど）が追加された場合も再利用ように、基本的にバックエンドに任せるようにしています。

「Rais API + フロントエンド」の構成はRails単体に比べて環境や言語が分かれるため、デメリットもあると考えます。 <br>
・運用負担向上（環境変数の管理、セキュリティ設定の複雑化） <br>
・可用性低下の危険 <br>
・開発要員確保の難易度増（組織による） <br>
アプリケーションの目的・性質によってはRails単体での開発が最適となる可能性もあるため、実務においては柔軟に判断したいと考えます。
