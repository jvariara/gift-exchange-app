import JoinGroupModal from "@/components/modals/JoinGroupModal"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import React from "react"
import { headers } from "next/headers"

const Page = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const auth = await currentUser()

  if (!auth) {
    // Get the current URL to redirect back after sign-in
    const headersList = headers()
    const host = headersList.get("host") || "localhost:3000"
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
    
    // Create the redirect URL with the same path and search params
    const redirectUrl = new URL(`${protocol}://${host}/dashboard/join-group`)
    
    // Add the search params from the current request
    if (searchParams.token) {
      redirectUrl.searchParams.set("token", searchParams.token as string)
    }
    
    // Redirect to sign-in with the redirect URL
    redirect(`/sign-in?redirect_url=${encodeURIComponent(redirectUrl.toString())}`)
  }

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <>
      <JoinGroupModal />
    </>
  )
}

export default Page
