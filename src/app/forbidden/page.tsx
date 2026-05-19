import LogoutButton from "../components/LogoutButton"
import { requireAccessToken } from "../lib/auth"
import { getCurrentUser } from "../lib/currentUser"
import Link from "next/link"

export default async function ForbiddenPage() {
  const token = await requireAccessToken()
  await getCurrentUser(token)

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-50 p-6 text-zinc-900">
      <div className="grid max-w-md gap-4 rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">アクセス権限がありません</h1>
        <p className="text-sm text-zinc-600">
          権限の追加についてはシステム管理者にお問い合わせください。
        </p>
        <div className="flex justify-center">
          <Link className="text-sm font-semibold text-zinc-600 hover:text-zinc-900" href="/">トップ画面へ</Link>
        </div>
        <div className="flex justify-center pt-2">
          <LogoutButton />
        </div>
      </div>
    </main>
  )
}
