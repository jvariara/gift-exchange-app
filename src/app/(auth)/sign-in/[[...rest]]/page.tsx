"use client"
import { SignIn } from "@clerk/nextjs"
import React from "react"

const Page = () => {
  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <SignIn signUpFallbackRedirectUrl="/welcome" signUpForceRedirectUrl="/welcome" />
    </div>
  )
}

export default Page
