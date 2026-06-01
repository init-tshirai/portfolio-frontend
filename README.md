# タスク管理アプリ（フロントエンド）

Next.js フロントエンドです。[バックエンド（Rails API）](https://github.com/init-tshirai/portfolio-backend) と組み合わせて利用します。

**システム全体の説明（デモ URL・使用技術・認証・API 設計など）は [portfolio-backend/docs/system.md](https://github.com/init-tshirai/portfolio-backend/blob/master/docs/system.md) を参照してください。**

---

## 目次
- [タスク管理アプリ（フロントエンド）](#タスク管理アプリフロントエンド)
  - [目次](#目次)
  - [ローカル環境でのセットアップ](#ローカル環境でのセットアップ)
    - [前提](#前提)
    - [手順](#手順)

---

## ローカル環境でのセットアップ

### 前提

- Node.js のインストール
- [portfolio-backend](https://github.com/init-tshirai/portfolio-backend) のセットアップおよび起動（`http://localhost:3001`）

### 手順

```bash
cd (portfolio-frontend のディレクトリ)
npm install
cp env.local.example .env.local
npm run dev
```

ブラウザで http://localhost:3000 を開きます。<br>
以下でログインできたら成功です。<br>
メールアドレス: normal@example.com<br>
パスワード: password
