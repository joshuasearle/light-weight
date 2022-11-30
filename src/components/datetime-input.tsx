import { memo, useCallback } from "react"
import throughEvent from "../utils/through-event"
import Label from "./label"

const dateToString = (date: Date) => {
  const newDate = new Date(date)
  newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset())
  return newDate.toISOString().split(".")[0]
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
      const date = new Date(value)
      // date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
      changeHandler(date)
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
        className="w-full text-default bg-background border border-border rounded-md shadow-sm shadow-shadow sm:px-3.5 sm:py-2 px-3 py-1.5 text-sm sm:text-base outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-900 focus-visible:border-transparent duration-[50ms]"
      />
    </div>
  )
}

export default memo(DateInput)
