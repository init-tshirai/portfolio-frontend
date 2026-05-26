import { redirectIfAuthenticated } from "../lib/auth"
import LoginForm from "./LoginForm"

export default async function LoginPage() {
  await redirectIfAuthenticated()

  return <LoginForm />
}
