import Link from "next/link"
import { redirect } from "next/navigation"

import { requireAccessToken } from "../../lib/auth"
import { requireTaskCreatePermission } from "../../lib/currentUser"
import { getUserOptions } from "../../lib/users"
import NewTaskForm, { type CreateTaskState } from "./NewTaskForm"

async function createTask(_prevState: CreateTaskState, formData: FormData): Promise<CreateTaskState> {
  "use server"

  const token = await requireAccessToken()
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

  if(res.status === 403) {
    redirect("/forbidden")
  }

  if(res.status === 422) {
    const data = await res.json().catch(() => null) as { errors?: unknown } | null
    const errors = Array.isArray(data?.errors)
      ? data.errors.filter((error): error is string => typeof error === "string")
      : []

    return {
      errors: errors.length > 0 ? errors : ["入力内容を確認してください。"],
    }
  }

  if(!res.ok) {
    throw new Error("タスクの作成に失敗しました。")
  }

  redirect("/tasks")
}

export default async function NewTaskPage() {
  const token = await requireAccessToken()
  await requireTaskCreatePermission(token)
  const users = await getUserOptions(token)

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

        <NewTaskForm action={createTask} users={users} />
      </div>
    </main>
  )
}
