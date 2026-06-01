import { forwardRef, useId } from "react"
import { cn } from "../../lib/utils"

const Checkbox = forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  const id = useId()

  return (
    <label
      htmlFor={props.id || id}
      className={cn(
        "relative inline-flex items-center justify-center cursor-pointer",
        "h-5 w-5 shrink-0 rounded-md border-2 transition-all duration-200",
        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background",
        checked
          ? "bg-primary border-primary"
          : "border-gray-300 dark:border-gray-600 hover:border-primary/50 dark:hover:border-primary/50",
        className
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className="absolute inset-0 opacity-0 cursor-pointer"
        {...props}
      />
      {checked && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ stroke: "white", strokeWidth: 3 }}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </label>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
