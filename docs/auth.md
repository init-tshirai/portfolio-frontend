## 認証・認可について

### 認証の流れ

1. `/login` でメール・パスワードを送信
2. `POST /api/auth/login`（Next.js Route Handler）が Rails の `POST /auth/sign_in` を呼ぶ
3. 返却された JWT を **httpOnly Cookie**（`access_token`）に保存
4. 以降、Server Component が Cookie からトークンを読み、Rails API をサーバー側で呼び出す
5. ログアウト時は `DELETE /api/auth/logout` 経由で Rails の sign_out を呼び、Cookie を削除

### 認可（フロントエンド側）

- `GET /api/v1/profile` で権限を取得
- 画面遷移時、権限が無ければ `/forbidden` にリダイレクト
- タスクの「新規作成」、「編集」、「削除」リンクは権限に応じて出し分け
