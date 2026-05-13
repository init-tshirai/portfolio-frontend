"use client"

import { useRouter } from "next/navigation"
import React, { useState } from "react"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()  // formのsubmitを押したとき、ページがリロードされることを防ぐ

    setErrorMessage("")
    setIsSubmitting(true)

    const res = await fetch("api/autho/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    setIsSubmitting(false)

    if(!res.ok) {
      // review: エラーメッセージの内容について。サーバから受け取った内容をそのまま表示してよいのか。
      const data = await res.json().catch(() => null)
      setErrorMessage(data?.message ?? "ログインに失敗しました。")
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <main>
      <h1>ログイン</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMessage && <p>{errorMessage}</p>}

        <button type="submit" disabled={isSubmitting || email === "" || password === ""}>
          {isSubmitting ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </main>
  )
}