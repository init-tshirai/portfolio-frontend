import Link from "next/link"

import LogoutButton from "./components/LogoutButton"

export default async function HomePage() {
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
