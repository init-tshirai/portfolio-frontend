import { cookies } from "next/headers"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

type TaskStatus = "not_started" | "in_progress" | "resolved" | "completed" | "feedback" | "rejected"

type Task = {
  id: number
  title: string
  description: string | null
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

async function getAccessToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if(!token) {
    redirect("/login")
  }

  return token
}

async function getTask(id: string, token: string): Promise<Task> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if(res.status === 401) {
    redirect("/login")
  }

  if(res.status === 404) {
    notFound()
  }

  if(!res.ok) {
    throw new Error("タスク詳細の取得に失敗しました。")
  }

  return res.json()
}

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const token = await getAccessToken()
  const task = await getTask(id, token)

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="mx-auto grid max-w-3xl gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">Tasks</p>
            <h1 className="mt-1 text-3xl font-bold">タスク詳細</h1>
          </div>
          <Link className="text-sm font-semibold text-zinc-600 hover:text-zinc-900" href="/tasks">
            一覧へ戻る
          </Link>
        </div>

        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 p-6">
            <p className="text-sm font-semibold text-zinc-500">タスクID: {task.id}</p>
            <h2 className="mt-2 text-2xl font-bold">{task.title}</h2>
          </div>

          <dl className="grid divide-y divide-zinc-100">
            <div className="grid gap-1 p-6 md:grid-cols-[160px_1fr] md:gap-4">
              <dt className="text-sm font-semibold text-zinc-500">説明</dt>
              <dd className="whitespace-pre-wrap text-sm leading-6">
                {task.description || "説明はありません。"}
              </dd>
            </div>

            <div className="grid gap-1 p-6 md:grid-cols-[160px_1fr] md:gap-4">
              <dt className="text-sm font-semibold text-zinc-500">ステータス</dt>
              <dd className="text-sm">{taskStatusLabels[task.status]}</dd>
            </div>

            <div className="grid gap-1 p-6 md:grid-cols-[160px_1fr] md:gap-4">
              <dt className="text-sm font-semibold text-zinc-500">期日</dt>
              <dd className="text-sm">{task.due_date ?? "-"}</dd>
            </div>

            <div className="grid gap-1 p-6 md:grid-cols-[160px_1fr] md:gap-4">
              <dt className="text-sm font-semibold text-zinc-500">担当者</dt>
              <dd className="text-sm">
                {task.user.name}（ID: {task.user.id}）
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  )
}
