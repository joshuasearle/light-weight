import { memo } from "react"
import throughEvent from "../utils/through-event"

const DateInput = ({
  label,
  htmlFor,
  value,
  changeHandler,
}: {
  label: string
  htmlFor: string
  value: string
  changeHandler: (_: string) => void
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={htmlFor} className="font-semibold">
        {label}
      </label>
      <input
        type="datetime-local"
        id={htmlFor}
        value={value}
        onChange={throughEvent(changeHandler)}
        className="w-full text-default bg-background border border-border rounded-md shadow-sm shadow-shadow px-3.5 py-2 text-xs xs:text-base sm:text-lg outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-900 focus-visible:border-transparent duration-[50ms]"
      />
    </div>
  )
}

export default memo(DateInput)
