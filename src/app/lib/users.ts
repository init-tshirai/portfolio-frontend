import { redirect } from "next/navigation"

export type UserOption = {
  id: number
  name: string
}

export async function getUserOptions(token: string): Promise<UserOption[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/options`, {
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
