"use client"
import { SignUp } from "@clerk/nextjs"
import { useSearchParams } from "next/navigation"

const Page = () => {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect_url")

  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <SignUp 
        fallbackRedirectUrl={redirectUrl || "/welcome"} 
        forceRedirectUrl={redirectUrl || "/welcome"} 
      />
    </div>
  )
}

export default Page
