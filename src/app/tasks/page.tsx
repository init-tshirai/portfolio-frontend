import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import LogoutButton from "../components/LogoutButton"

type Task = {
  id: number
  title: string
  status: string
  user_id: number
  user: {
    name: string | null
  }
}

async function getTasks(): Promise<Task[]> {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if(!token) {
    redirect("/login")
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if(res.status === 401) {
    redirect("/login")
  }

  if(!res.ok) {
    throw new Error("タスク一覧の取得に失敗しました。")
  }

  return res.json()
}

export default async function TasksPage() {
  const tasks = await getTasks()

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="mx-auto grid max-w-6xl gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">Tasks</p>
            <h1 className="mt-1 text-3xl font-bold">タスク一覧</h1>
          </div>
          <LogoutButton />
        </div>

        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
              <thead className="bg-zinc-100 text-xs font-semibold uppercase tracking-wide text-zinc-600">
                <tr>
                  <th className="px-4 py-3">tasks.id</th>
                  <th className="px-4 py-3">tasks.title</th>
                  <th className="px-4 py-3">tasks.status</th>
                  <th className="px-4 py-3">tasks.user_id</th>
                  <th className="px-4 py-3">tasks.user.name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-zinc-50">
                      <td className="whitespace-nowrap px-4 py-3 font-medium">{task.id}</td>
                      <td className="px-4 py-3">{task.title}</td>
                      <td className="whitespace-nowrap px-4 py-3">{task.status}</td>
                      <td className="whitespace-nowrap px-4 py-3">{task.user_id}</td>
                      <td className="whitespace-nowrap px-4 py-3">{task.user.name ?? "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-8 text-center text-zinc-500" colSpan={5}>
                      タスクはまだありません。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
