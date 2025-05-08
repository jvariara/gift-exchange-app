import { cn } from "@/utils"

const MaxWidthWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn("h-full mx-auto w-full max-w-(--breakpoint-xl) px-2.5 md:px-20", className)}>
      {children}
    </div>
  )
}

export default MaxWidthWrapper
