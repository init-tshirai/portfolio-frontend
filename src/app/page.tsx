import Link from "next/link"
import { redirect } from "next/navigation"

import LogoutButton from "./components/LogoutButton"
import { requireAccessToken } from "./lib/auth"
import { getCurrentUser } from "./lib/currentUser"

export default async function HomePage() {
  const token = await requireAccessToken()
  // ログインチェック
  await getCurrentUser(token)
  redirect("/tasks")
}
