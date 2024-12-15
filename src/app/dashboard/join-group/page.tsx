import JoinGroupModal from "@/components/modals/JoinGroupModal"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import React from "react"

const Page = async () => {
  const auth = await currentUser()

  if (!auth) return notFound()

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })

  if (!user) return notFound()

  return (
    <>
      <JoinGroupModal />
    </>
  )
}

export default Page
