"use client"
import { SignIn } from "@clerk/nextjs"
import React from "react"
import { useSearchParams } from "next/navigation"

const Page = () => {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect_url")

  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <SignIn 
        signUpFallbackRedirectUrl={redirectUrl || "/welcome"} 
        signUpForceRedirectUrl={redirectUrl || "/welcome"} 
        redirectUrl={redirectUrl || "/welcome"}
      />
    </div>
  )
}

export default Page
