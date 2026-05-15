import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function getAccessToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if(!token) {
    redirect("/login")
  }

  return token
}
