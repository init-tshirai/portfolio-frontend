import Link from "next/link"
import { redirect } from "next/navigation"

import LogoutButton from "./components/LogoutButton"
import { requireAccessToken } from "./lib/auth"

type CurrentUser = {
  id: number
  name: string
  role: "normal" | "admin" | number
}

async function getCurrentUser(token: string): Promise<CurrentUser> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if(res.status === 401) {
    redirect("/login")
  }

  if(!res.ok) {
    throw new Error("ログインユーザー情報の取得に失敗しました。")
  }

  return res.json()
}

export default async function HomePage() {
  const token = await requireAccessToken()
  const currentUser = await getCurrentUser(token)

  if(currentUser.role === "normal" || currentUser.role === 0) {
    redirect("/tasks")
  }

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-50 p-6 text-zinc-900">
      <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1>Home</h1>
        <Link className="font-semibold text-blue-600 hover:text-blue-700" href="/tasks">
          タスク一覧へ
        </Link>
        <LogoutButton />
      </div>
    </main>
  )
}
