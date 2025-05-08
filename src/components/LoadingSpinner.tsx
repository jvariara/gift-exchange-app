import { cva, VariantProps } from "class-variance-authority"

const spinnerVariants = cva(
  "border-4 rounded-full border-primary border-t-primary animate-spin duration-700",
  {
    variants: {
      size: {
        sm: "size-4 border-2",
        md: "size-6 border-4",
        lg: "size-8 border-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
}

const LoadingSpinner = ({ size, className }: LoadingSpinnerProps) => {
  return (
    <div className="flex justify-center items-center">
      <div className={spinnerVariants({ size, className })} />
    </div>
  )
}

export default LoadingSpinner
