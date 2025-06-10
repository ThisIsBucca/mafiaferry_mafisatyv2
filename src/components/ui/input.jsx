import { forwardRef } from "react"
import { cn } from "../../lib/utils"

const Input = forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input",
        "bg-background/50 backdrop-blur-sm",
        "px-3 py-2 text-sm text-foreground/90",
        "shadow-sm transition-all duration-200",
        "placeholder:text-muted-foreground/60",
        "hover:border-primary/50 hover:bg-background/80",
        "focus:border-primary focus:bg-background",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "dark:bg-background/30 dark:hover:bg-background/50 dark:focus:bg-background/70",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }