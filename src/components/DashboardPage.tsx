"use client"
import React from "react"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
import Heading from "./Heading"
import { useRouter } from "next/navigation"

interface DashboardPageProps {
  title: string
  children?: React.ReactNode
  hideBackButton?: boolean
  cta?: React.ReactNode // call to action
  cta2?: React.ReactNode // call to action
}

const DashboardPage = ({
  title,
  children,
  cta,
  cta2,
  hideBackButton,
}: DashboardPageProps) => {
  const router = useRouter()

  return (
    <section className="flex-1 h-full w-full flex flex-col">
      <div className="p-6 sm:p-8 flex justify-between border-b border-gray-200">
        <div className="w-full flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="flex items-center gap-8">
            {hideBackButton ? null : (
              <Button
                className="w-fit bg-white"
                variant="outline"
                onClick={() => router.back()}
              >
                <ArrowLeft className="size-4" />
              </Button>
            )}

            <Heading>{title}</Heading>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {cta ? <div>{cta}</div> : null}
            {cta2 ? <div>{cta2}</div> : null}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-8 flex flex-col overflow-y-auto">
        {children}
      </div>
    </section>
  )
}

export default DashboardPage
