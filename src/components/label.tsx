import { ReactNode } from "react"

const Label = ({
  children,
  htmlFor,
}: {
  children?: ReactNode
  htmlFor?: string
}) => {
  return (
    <label htmlFor={htmlFor} className="font-semibold text-sm sm:text-base">
      {children}
    </label>
  )
}

export default Label
