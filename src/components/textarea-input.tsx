import { memo } from "react"
import throughEvent from "../utils/through-event"
import Label from "./label"

const TextareaInput = ({
  label,
  htmlFor,
  value,
  changeHandler,
  autoFocus = false,
}: {
  label: string
  htmlFor: string
  value: string
  changeHandler: (_: string) => void
  autoFocus?: boolean
}) => {
  return (
    <div className="flex flex-col">
      <Label htmlFor={htmlFor}>{label}</Label>
      <textarea
        autoFocus={autoFocus}
        id={htmlFor}
        value={value}
        onChange={throughEvent(changeHandler)}
        className="bg-background border border-border rounded-md shadow-sm shadow-shadow sm:px-3.5 sm:py-2 px-3 py-1.5 text-sm sm:text-base focus-visible:outline-none outline-none focus-visible:ring-2 focus-visible:ring-cyan-900 focus-visible:border-transparent duration-[50ms]"
      ></textarea>
    </div>
  )
}

export default memo(TextareaInput)
