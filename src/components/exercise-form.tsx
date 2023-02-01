import { memo, useEffect, useRef, useState } from "react"
import Button from "./button"
import TextInput from "./text-input"
import TextareaInput from "./textarea-input"

const ExerciseForm = ({
  submitMessage,
  onSubmit,
  closeForm,
  initialName,
  initialNotes,
}: {
  submitMessage: string
  onSubmit: ({ name, notes }: { name: string; notes: string }) => void
  closeForm: () => void
  initialName?: string
  initialNotes?: string
}) => {
  const [name, setName] = useState(initialName || "")
  const [notes, setNotes] = useState(initialNotes || "")

  const nameInput = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (nameInput.current && !initialName) nameInput.current.focus()
  }, [])

  return (
    <form className="border border-border shadow shadow-shadow rounded-md p-4 flex flex-col space-y-4">
      <TextInput
        ref={nameInput}
        value={name}
        changeHandler={setName}
        label="Exercise name"
        htmlFor="exerciseName"
      />
      <TextareaInput
        value={notes}
        changeHandler={setNotes}
        label="Exercise notes"
        htmlFor="exerciseNotes"
        autoFocus={!!initialName}
      />
      <div className="flex flex-row space-x-4">
        <Button onClick={() => onSubmit({ name, notes })}>
          {submitMessage}
        </Button>
        <Button onClick={closeForm}>Cancel</Button>
      </div>
    </form>
  )
}

export default memo(ExerciseForm)
