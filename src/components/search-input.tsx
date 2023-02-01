import React from "react"

export default function ({
  defaultValue = "",
  inputCallback,
}: {
  defaultValue?: string
  inputCallback: (value: string) => void
}) {
  const [value, setValue] = React.useState(defaultValue)

  const onInput = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    setValue(value)
    inputCallback(value)
  }

  return (
    <div className="flex flex-col">
      <input
        value={value}
        placeholder={"Search or add exercises"}
        onInput={onInput}
        className="bg-background border border-border rounded-md shadow-sm shadow-shadow sm:px-3.5 sm:py-2 px-3 py-1.5 text-sm sm:text-base outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-900 focus-visible:border-transparent duration-[50ms]"
      />
    </div>
  )
}
