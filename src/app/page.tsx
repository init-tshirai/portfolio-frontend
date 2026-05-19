import Link from "next/link"
import { redirect } from "next/navigation"

import LogoutButton from "./components/LogoutButton"
import { requireAccessToken } from "./lib/auth"
import { getCurrentUser } from "./lib/currentUser"

export default async function HomePage() {
  const token = await requireAccessToken()
  const currentUser = await getCurrentUser(token)

  if(currentUser.role === "normal") {
    redirect("/tasks")
  } // todo: adminならユーザー一覧へリダイレクト。

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
