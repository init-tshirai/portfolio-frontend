import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

import LogoutButton from "../components/LogoutButton"

type TaskStatus = "not_started" | "in_progress" | "resolved" | "completed" | "feedback" | "rejected"

type TaskSearchParams = {
  title?: string | string[]
  status?: string | string[]
  due_date_from?: string | string[]
  due_date_to?: string | string[]
  user_id?: string | string[]
}

type Task = {
  id: number
  title: string
  status: TaskStatus
  due_date: string | null
  user: {
    id: number
    name: string
  }
}

const taskStatusLabels: Record<TaskStatus, string> = {
  not_started: "未着手",
  in_progress: "進行中",
  resolved: "解決済み",
  completed: "完了",
  feedback: "フィードバック",
  rejected: "却下",
}

const taskSearchKeys = ["title", "status", "due_date_from", "due_date_to", "user_id"] as const

function getSearchValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function buildTaskSearchParams(searchParams: TaskSearchParams) {
  const params = new URLSearchParams()

  taskSearchKeys.forEach((key) => {
    const value = getSearchValue(searchParams[key])?.trim()

    if(value) {
      params.set(key, value)
    }
  })

  return params
}

async function getTasks(searchParams: TaskSearchParams): Promise<Task[]> {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if(!token) {
    redirect("/login")
  }

  const query = buildTaskSearchParams(searchParams)
  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks`)
  url.search = query.toString()

  const res = await fetch(url, {
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

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<TaskSearchParams>
}) {
  const currentSearchParams = await searchParams
  const title = getSearchValue(currentSearchParams.title) ?? ""
  const status = getSearchValue(currentSearchParams.status) ?? ""
  const dueDateFrom = getSearchValue(currentSearchParams.due_date_from) ?? ""
  const dueDateTo = getSearchValue(currentSearchParams.due_date_to) ?? ""
  const userId = getSearchValue(currentSearchParams.user_id) ?? ""
  const tasks = await getTasks(currentSearchParams)

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

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-5" method="get">
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-zinc-700" htmlFor="title">
                タイトル
              </label>
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                defaultValue={title}
                id="title"
                name="title"
                placeholder="部分一致"
                type="search"
              />
            </div>

            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-zinc-700" htmlFor="status">
                ステータス
              </label>
              <select
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                defaultValue={status}
                id="status"
                name="status"
              >
                <option value="">すべて</option>
                {Object.entries(taskStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-zinc-700" htmlFor="due_date_from">
                期日 From
              </label>
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                defaultValue={dueDateFrom}
                id="due_date_from"
                name="due_date_from"
                type="date"
              />
            </div>

            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-zinc-700" htmlFor="due_date_to">
                期日 To
              </label>
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                defaultValue={dueDateTo}
                id="due_date_to"
                name="due_date_to"
                type="date"
              />
            </div>

            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-zinc-700" htmlFor="user_id">
                担当者ID
              </label>
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                defaultValue={userId}
                id="user_id"
                min="1"
                name="user_id"
                type="number"
              />
            </div>

            <div className="flex items-end gap-3 md:col-span-2 lg:col-span-5">
              <button
                className="rounded-lg border border-blue-700 bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                type="submit"
              >
                検索
              </button>
              <Link className="px-2 py-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900" href="/tasks">
                クリア
              </Link>
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
              <thead className="bg-zinc-100 text-xs font-semibold uppercase tracking-wide text-zinc-600">
                <tr>
                  <th className="px-4 py-3">タスクID</th>
                  <th className="px-4 py-3">タイトル</th>
                  <th className="px-4 py-3">ステータス</th>
                  <th className="px-4 py-3">期日</th>
                  <th className="px-4 py-3">担当者</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-zinc-50">
                      <td className="whitespace-nowrap px-4 py-3 font-medium">{task.id}</td>
                      <td className="px-4 py-3">{task.title}</td>
                      <td className="whitespace-nowrap px-4 py-3">{taskStatusLabels[task.status]}</td>
                      <td className="whitespace-nowrap px-4 py-3">{task.due_date ?? "-"}</td>
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
