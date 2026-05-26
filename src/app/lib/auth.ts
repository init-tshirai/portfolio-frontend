import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get("access_token")?.value
}

export async function requireAccessToken() {
  const token = await getAccessToken()

  if(!token) {
    redirect("/login")
  }

  return token
}

export async function redirectIfAuthenticated(redirectTo = "/") {
  const token = await getAccessToken()

  if(token) {
    redirect(redirectTo)
  }
}
