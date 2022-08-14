import { memo, useCallback, useState } from "react"
import throughEvent from "../utils/through-event"

const NumberInput = ({
  label,
  htmlFor,
  value,
  changeHandler,
  min,
  max,
  fractionDigits,
}: {
  label: string
  htmlFor: string
  value: number | null
  changeHandler: (_: number) => void
  min?: number
  max?: number
  fractionDigits?: number
}) => {
  const [string, setString] = useState(value ? value.toString() : "")

  const handleNumberChange = useCallback(
    (value: string) => {
      const converted = +value

      if (isNaN(converted)) {
        setString("")
        return null
      }

      const rounded =
        fractionDigits !== undefined
          ? +converted.toFixed(fractionDigits)
          : converted

      if (max !== undefined && rounded > max) {
        setString(max.toString())
        return max
      }

      if (min !== undefined && rounded < min) {
        setString(min.toString())
        return min
      }

      changeHandler(rounded)
      setString(rounded.toString())
    },
    [changeHandler, min, max, fractionDigits]
  )

  return (
    <div className="flex flex-col">
      <label htmlFor={htmlFor} className="font-semibold">
        {label}
      </label>
      <input
        type="number"
        id={htmlFor}
        value={string}
        onChange={throughEvent(setString)}
        onBlur={throughEvent(handleNumberChange)}
        className="w-full text-default bg-background border border-border rounded-md shadow-sm shadow-shadow px-3.5 py-2 text-xs xs:text-base sm:text-lg outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-900 focus-visible:border-transparent duration-[50ms]"
      />
    </div>
  )
}

export default memo(NumberInput)
