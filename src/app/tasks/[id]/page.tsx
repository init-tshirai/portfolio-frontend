import { cookies } from "next/headers"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { taskStatusLabels, type TaskStatus } from "../taskStatus"
import DeleteTaskButton from "./DeleteTaskButton"
import TaskEditForm, { type UpdateTaskState } from "./TaskEditForm"

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
  comments: {
    created_at: string
    id: number
    content: string
    task_update_info: string | null
    user: {
      id: number
      name: string
    }
  }[]
}

type UserOption = {
  id: number
  name: string
}

type TaskDetailSearchParams = {
  edit?: string | string[]
}

function getSearchValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
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

export default async function TaskDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<TaskDetailSearchParams>
}) {
  const { id } = await params
  const currentSearchParams = await searchParams
  const isEditing = getSearchValue(currentSearchParams.edit) === "1"
  const token = await getAccessToken()
  const [task, users] = await Promise.all([
    getTask(id, token),
    isEditing ? getUsers(token) : Promise.resolve([]),
  ])

  async function updateTask(_prevState: UpdateTaskState, formData: FormData): Promise<UpdateTaskState> {
    "use server"

    const token = await getAccessToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task: {
          status: formData.get("status"),
          due_date: formData.get("due_date"),
          user_id: formData.get("user_id"),
        },
        comment: {
          content: formData.get("comment"),
        },
      }),
    })

    if(res.status === 401) {
      redirect("/login")
    }

    if(res.status === 404) {
      notFound()
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
      throw new Error("タスクの更新に失敗しました。")
    }

    redirect(`/tasks/${id}`)
  }

  async function deleteTask() {
    "use server"

    const token = await getAccessToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if(res.status === 401) {
      redirect("/login")
    }

    if(res.status === 404) {
      notFound()
    }

    if(!res.ok) {
      throw new Error("タスクの削除に失敗しました。")
    }

    redirect("/tasks")
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="mx-auto grid max-w-3xl gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">Tasks</p>
            <h1 className="mt-1 text-3xl font-bold">タスク詳細</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link className="text-sm font-semibold text-blue-600 hover:text-blue-700" href={`/tasks/${task.id}?edit=1`}>
              編集
            </Link>
            <DeleteTaskButton action={deleteTask} />
            <Link className="text-sm font-semibold text-zinc-600 hover:text-zinc-900" href="/tasks">
              一覧へ戻る
            </Link>
          </div>
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

        <div className="grid gap-4">
          <h2 className="text-xl font-bold">コメント</h2>

          {task.comments.length > 0 ? (
            task.comments.map((comment) => (
              <section
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
                key={comment.id}
              >
                <div className="border-b border-zinc-200 p-6">
                  <p className="text-sm font-semibold text-zinc-500">
                    {comment.user.name}（ID: {comment.user.id}） が {comment.created_at} に更新。
                  </p>
                </div>

                <dl className="grid divide-y divide-zinc-100">
                  <div className="grid gap-1 p-6 md:grid-cols-[160px_1fr] md:gap-4">
                    <dt className="text-sm font-semibold text-zinc-500">更新内容</dt>
                    <dd className="text-sm">{comment.task_update_info || "コメントしました"}</dd>
                  </div>

                  <div className="grid gap-1 p-6 md:grid-cols-[160px_1fr] md:gap-4">
                    <dt className="text-sm font-semibold text-zinc-500">コメント</dt>
                    <dd className="whitespace-pre-wrap text-sm leading-6">{comment.content}</dd>
                  </div>
                </dl>
              </section>
            ))
          ) : (
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-sm">
              コメントはまだありません。
            </section>
          )}
        </div>

        {isEditing && <TaskEditForm action={updateTask} task={task} users={users} />}
      </div>
    </main>
  )
}
