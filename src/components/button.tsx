import { memo, ReactNode } from "react"

const Button = ({
  children,
  onClick,
  type = "button",
}: {
  children: ReactNode
  onClick: () => void
  type?: "button" | "submit"
}) => {
  return (
    <button
      className="text-sm sm:text-base sm:px-3.5 sm:py-2 px-3 py-1.5 border border-border rounded-md shadow-sm shadow-shadow font-semibold outline-none focus-visible:ring-2 ring-cyan-900 duration[50ms] focus-visible:border-transparent"
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}

export default memo(Button)
