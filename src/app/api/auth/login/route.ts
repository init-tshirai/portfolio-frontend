import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// ログインAPI
export async function POST(request: Request) {
  const body = await request.json()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/sign_in`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: {
          email: body.email,
          password: body.password,
        }
      }),
    }
  )

  if(!res.ok) {
    return NextResponse.json(
      { message: "メールアドレスまたはパスワードが正しくありません。" },
      { status: 401 }, // 401はUnauthorizedを示すステータスコード
    )
  }

  const authorization = res.headers.get("Authorization")
  if(!authorization) {
    return NextResponse.json(
      { message: "認証情報を取得できませんでした。" },
      { status: 500 }, // 想定外のエラー。プログラムのバグ等が疑われるため500を返す。
    )
  }

  const token = authorization.replace("Bearer ", "")

  const cookieStore = await cookies()

  // jwtをcookieに保存
  cookieStore.set("access_token", token, {
    httpOnly: true,  // JavaScriptからアクセスできないよう、httpOnlyをtrueにする。
    secure: process.env.NODE_ENV === "production",  // httpsの場合のみcookieを送信。本番環境のみ有効化する。
    sameSite: "lax",  // 別サイトからのリクエストでcookieを送信するかどうかの設定。 外部遷移なし、同一domainで完結する、メールリンク等からのアクセスが無い場合、strictにすることを検討する。
    path: "/", // 同じドメインのすべてのパスでcookieを送信。
    maxAge: 60 * 60 * 24 // 24時間有効とする。
  })

  return NextResponse.json({ message: "ログインしました。" })
}