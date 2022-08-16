import { forwardRef, memo, Ref } from "react"
import throughEvent from "../utils/through-event"
import Label from "./label"

const TextInput = (
  {
    label,
    htmlFor,
    value,
    changeHandler,
  }: {
    label: string
    htmlFor: string
    value: string
    changeHandler: (_: string) => void
  },
  ref: Ref<HTMLInputElement>
) => {
  return (
    <div className="flex flex-col">
      <Label htmlFor={htmlFor}>{label}</Label>
      <input
        ref={ref}
        id={htmlFor}
        value={value}
        onChange={throughEvent(changeHandler)}
        className="bg-background border border-border rounded-md shadow-sm shadow-shadow sm:px-3.5 sm:py-2 px-3 py-1.5 text-sm sm:text-base outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-900 focus-visible:border-transparent duration-[50ms]"
      />
    </div>
  )
}

export default memo(forwardRef(TextInput))
