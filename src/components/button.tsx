import { memo, ReactNode } from "react"

const Button = ({
  children,
  onClick,
}: {
  children: ReactNode
  onClick: () => void
}) => {
  return (
    <button
      className="px-3.5 py-2 border border-border rounded-md shadow-sm shadow-shadow font-semibold outline-none focus-visible:ring-2 ring-cyan-900 duration[50ms] focus-visible:border-transparent"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default memo(Button)
