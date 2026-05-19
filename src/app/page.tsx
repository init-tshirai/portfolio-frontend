import { redirect } from "next/navigation"

import { requireAccessToken } from "./lib/auth"
import { getCurrentUser, getDefaultLandingPath } from "./lib/currentUser"

export default async function HomePage() {
  const token = await requireAccessToken()
  const currentUser = await getCurrentUser(token)

  redirect(getDefaultLandingPath(currentUser))
}
