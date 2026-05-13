import LogoutButton from "./components/LogoutButton"

/*
type Profile = {
  name: string
  role: string
  message: string
}
  */

export default async function HomePage() {
  /*
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/profile`,
    {
      cache: "no-store",
    }
  )

  const profile: Profile = await res.json()

  return (
    <main>
      <h1>{profile.name}</h1>
      <p>{profile.role}</p>
      <p>{profile.message}</p>
    </main>
  );
  */

  return (
    <main>
      <h1>Home</h1>
      <LogoutButton />
    </main>
  )
}
