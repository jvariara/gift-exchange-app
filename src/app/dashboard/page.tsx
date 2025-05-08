import DashboardPage from "@/components/DashboardPage"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import React from "react"
import DashboardPageContent from "./DashboardPageContent"
import CreateGroupModal from "@/components/modals/CreateGroupModal"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

const Page = async () => {
  const auth = await currentUser()

  if (!auth) {
    redirect("/sign-in")
  }

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })

  if (!user) redirect("/sign-in")

  return (
    <DashboardPage
      hideBackButton
      cta={
        <CreateGroupModal>
          <Button className="w-full sm:w-fit hover:cursor-pointer">
            <PlusIcon className="size-4 mr-1.5" /> Create Group
          </Button>
        </CreateGroupModal>
      }
      title="Dashboard"
    >
      <DashboardPageContent userId={user.id} />
    </DashboardPage>
  )
}

export default Page
