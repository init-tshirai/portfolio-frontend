"use client"

import { useRouter } from "next/navigation"
import React, { useState } from "react"

export default function LoginForm() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()  // formのsubmitを押したとき、ページがリロードされることを防ぐ

    setErrorMessage("")
    setIsSubmitting(true)

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    setIsSubmitting(false)

    if(!res.ok) {
      const data = await res.json().catch(() => null)
      setErrorMessage(data?.message ?? "ログインに失敗しました。")
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <section className="w-full max-w-[420px] rounded-2xl border border-zinc-300 bg-white p-8 shadow-[0_16px_40px_rgb(15_23_42_/_8%)]">
        <h1 className="mb-6 text-[28px] font-bold text-zinc-900">ログイン</h1>
        <form className="grid gap-[18px]" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-zinc-700" htmlFor="email">
              メールアドレス
            </label>
            <input
              className="w-full rounded-lg border border-zinc-400 bg-white px-3 py-2.5 text-base text-zinc-900 outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgb(37_99_235_/_16%)]"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-zinc-700" htmlFor="password">
              パスワード
            </label>
            <input
              className="w-full rounded-lg border border-zinc-400 bg-white px-3 py-2.5 text-base text-zinc-900 outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgb(37_99_235_/_16%)]"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <button
            className="cursor-pointer rounded-lg border border-blue-700 bg-blue-600 px-4 py-[11px] text-base font-bold text-white enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:border-zinc-300 disabled:bg-zinc-200 disabled:text-zinc-500"
            type="submit"
            disabled={isSubmitting || email === "" || password === ""}
          >
            {isSubmitting ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </section>
    </main>
  )
}
