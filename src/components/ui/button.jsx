import { forwardRef } from "react"
import { cn } from "../../lib/utils"

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-primary/25 active:scale-[0.98] transition-all duration-200",
    destructive: "bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 hover:shadow-destructive/25 active:scale-[0.98] transition-all duration-200",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-[0.98] transition-all duration-200",
    secondary: "bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80 hover:shadow-secondary/20 active:scale-[0.98] transition-all duration-200",
    ghost: "hover:bg-accent hover:text-accent-foreground active:scale-[0.98] transition-all duration-200",
    link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 transition-colors duration-200",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3 text-sm",
    lg: "h-11 rounded-md px-8 text-base",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium",
        "ring-offset-background transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export { Button }