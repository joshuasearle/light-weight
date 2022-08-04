import throughEvent from "../utils/throughEvent"

const TextareaInput = ({
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
      <textarea
        id={htmlFor}
        value={value}
        onChange={throughEvent(changeHandler)}
        className="bg-background border border-border rounded-md shadow-sm shadow-shadow px-3.5 py-2 text-base focus-visible:outline-none outline-none focus-visible:ring-2 focus-visible:ring-cyan-900 focus-visible:border-transparent duration-[50ms]"
      ></textarea>
    </div>
  )
}

export default TextareaInput
