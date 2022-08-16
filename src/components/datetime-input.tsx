import { memo, useCallback } from "react"
import throughEvent from "../utils/through-event"
import Label from "./label"

const dateToString = (date: Date) => {
  return date.toISOString().split(".")[0]
}

const DateInput = ({
  label,
  htmlFor,
  value,
  changeHandler,
}: {
  label: string
  htmlFor: string
  value: Date
  changeHandler: (_: Date) => void
}) => {
  const handleDateChange = useCallback(
    (value: string) => {
      changeHandler(new Date(value))
    },
    [changeHandler]
  )

  return (
    <div className="flex flex-col">
      <Label htmlFor={htmlFor}>{label}</Label>
      <input
        type="datetime-local"
        id={htmlFor}
        value={dateToString(value)}
        onChange={throughEvent(handleDateChange)}
        className="w-full text-default bg-background border border-border rounded-md shadow-sm shadow-shadow px-3.5 py-2 text-sm sm:text-base outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-900 focus-visible:border-transparent duration-[50ms]"
      />
    </div>
  )
}

export default memo(DateInput)
