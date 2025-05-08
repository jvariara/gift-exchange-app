import { cn } from "@/utils"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { AnchorHTMLAttributes } from "react"

// allows this compionent to take any props as an anchor tag
interface ShinyButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string
  children: React.ReactNode
}

const ShinyButton = ({
  className,
  children,
  href,
  ...props
}: ShinyButtonProps) => {
  return (
    <Link
      href={href ?? "#"}
      className={cn(
        "group relative flex transform items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md border border-white bg-primary px-8 text-base/7 font-medium text-white transition-all duration-300 hover:ring-2 hover:ring-primary hover:ring-offset-2 focus:outline-hidden focus:ring-2 focus:ring-offset-2",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <ArrowRight className="size-4 shrink-0 text-white transition-transform ease-in-out group-hover:translate-x-[2px]" />
      </span>

      <div className="ease-[cubic-bezier(0.19, 1, 0.22, 1)] absolute -left-[75px] -z-10 h-[155px] w-8 rotate-[35deg] bg-white opacity-20 transition-all duration-500 group-hover:left-[120%]"></div>
    </Link>
  )
}

export default ShinyButton
