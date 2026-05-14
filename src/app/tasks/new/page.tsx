import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

type TaskStatus = "not_started" | "in_progress" | "resolved" | "completed" | "feedback" | "rejected"

type UserOption = {
  id: number
  name: string
}

const taskStatusLabels: Record<TaskStatus, string> = {
  not_started: "未着手",
  in_progress: "進行中",
  resolved: "解決済み",
  completed: "完了",
  feedback: "フィードバック",
  rejected: "却下",
}

async function getAccessToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if(!token) {
    redirect("/login")
  }

  return token
}

async function getUsers(token: string): Promise<UserOption[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if(res.status === 401) {
    redirect("/login")
  }

  if(!res.ok) {
    throw new Error("担当者一覧の取得に失敗しました。")
  }

  return res.json()
}

async function createTask(formData: FormData) {
  "use server"

  const token = await getAccessToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task: {
        title: formData.get("title"),
        description: formData.get("description"),
        status: formData.get("status"),
        due_date: formData.get("due_date"),
        user_id: formData.get("user_id"),
      },
    }),
  })

  if(res.status === 401) {
    redirect("/login")
  }

  if(!res.ok) {
    throw new Error("タスクの作成に失敗しました。")
  }

  redirect("/tasks")
}

export default async function NewTaskPage() {
  const token = await getAccessToken()
  const users = await getUsers(token)

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="mx-auto grid max-w-3xl gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">Tasks</p>
            <h1 className="mt-1 text-3xl font-bold">タスク新規作成</h1>
          </div>
          <Link className="text-sm font-semibold text-zinc-600 hover:text-zinc-900" href="/tasks">
            一覧へ戻る
          </Link>
        </div>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <form action={createTask} className="grid gap-5">
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-zinc-700" htmlFor="title">
                タイトル
              </label>
              <input
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                id="title"
                name="title"
                required
                type="text"
              />
            </div>

            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-zinc-700" htmlFor="description">
                説明
              </label>
              <textarea
                className="min-h-32 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                id="description"
                name="description"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="grid gap-1.5">
                <label className="text-sm font-semibold text-zinc-700" htmlFor="status">
                  ステータス
                </label>
                <select
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  defaultValue="not_started"
                  id="status"
                  name="status"
                  required
                >
                  {Object.entries(taskStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-semibold text-zinc-700" htmlFor="due_date">
                  期日
                </label>
                <input
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  id="due_date"
                  name="due_date"
                  type="date"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-semibold text-zinc-700" htmlFor="user_id">
                  担当者
                </label>
                <select
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  id="user_id"
                  name="user_id"
                  required
                >
                  <option value="">選択してください</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="rounded-lg border border-blue-700 bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                type="submit"
              >
                作成
              </button>
              <Link className="px-2 py-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900" href="/tasks">
                キャンセル
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
