"use client"

import Link from "next/link"
import { useActionState } from "react"

import { taskStatusLabels } from "../taskStatus"

export type CreateTaskState = {
  errors: string[]
}

type UserOption = {
  id: number
  name: string
}

type NewTaskFormProps = {
  action: (prevState: CreateTaskState, formData: FormData) => Promise<CreateTaskState>
  users: UserOption[]
}

const initialState: CreateTaskState = {
  errors: [],
}

export default function NewTaskForm({ action, users }: NewTaskFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState)

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <form action={formAction} className="grid gap-5">
        {state.errors.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">作成できませんでした。</p>
            <ul className="mt-2 list-disc pl-5">
              {state.errors.map((error, index) => (
                <li key={`${error}-${index}`}>{error}</li>
              ))}
            </ul>
          </div>
        )}

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
            className="rounded-lg border border-blue-700 bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "作成中..." : "作成"}
          </button>
          <Link className="px-2 py-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900" href="/tasks">
            キャンセル
          </Link>
        </div>
      </form>
    </section>
  )
}
