"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LogoutButton() {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleLogout() {
    setIsSubmitting(true)

    const res = await fetch("/api/auth/logout",{
      method: "DELETE",
    })

    setIsSubmitting(false)

    if(!res.ok) {
      alert("ログアウトに失敗しました。")
      return
    }

    router.push("/login")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      className="rounded border border-black bg-white px-4 py-2 text-black text-sm font-semibold"
    >
      {isSubmitting ? "ログアウト中..." : "ログアウト"}
    </button>
  )
}