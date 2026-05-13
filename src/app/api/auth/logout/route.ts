import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// ログアウトAPI
export async function DELETE() {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if(token){
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/sign_out`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
  }

  cookieStore.delete("access_token")

  return NextResponse.json({ message: "ログアウトしました" })
}
