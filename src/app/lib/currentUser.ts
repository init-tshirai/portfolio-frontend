import { redirect } from "next/navigation"

export type CurrentUser = {
  id: number
  name: string
  role: "normal" | "admin" | "viewer"
  permissions: {
    tasks: {
      read: boolean
      create: boolean
      update: boolean
      destroy: boolean
    }
  }
}

export async function getCurrentUser(token: string): Promise<CurrentUser> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if(res.status === 401) {
    redirect("/login")
  }

  if(!res.ok) {
    throw new Error("ログインユーザー情報の取得に失敗しました。")
  }

  return res.json()
}

export function getDefaultLandingPath(user: CurrentUser): string {
  if(user.permissions.tasks.read) {
    return "/tasks"
  }

  return "/forbidden"
}

export async function requireTaskReadPermission(token: string): Promise<CurrentUser> {
  const user = await getCurrentUser(token)

  if(!user.permissions.tasks.read) {
    redirect("/forbidden")
  }

  return user
}

export async function requireTaskCreatePermission(token: string): Promise<CurrentUser> {
  const user = await getCurrentUser(token)

  if(!user.permissions.tasks.create) {
    redirect("/forbidden")
  }

  return user
}
