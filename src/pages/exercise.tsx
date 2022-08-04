import * as AlertDialog from "@radix-ui/react-alert-dialog"
import { useLiveQuery } from "dexie-react-hooks"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import Button from "../components/button"
import TextInput from "../components/text-input"
import TextareaInput from "../components/textarea-input"
import { db, Exercise } from "../data/db"

const useExercise = (id: string | undefined) => {
  return useLiveQuery(() => {
    if (!id) return undefined
    return db.exercises.get(id)
  }, [id])
}

const useUpdateExercise = (
  exercise: Exercise | undefined,
  noUpdate: () => void
) => {
  const [name, setName] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    setName(exercise?.name ? exercise.name : "")
    setNotes(exercise?.notes ? exercise.notes : "")
  }, [exercise])

  const valid = name.length !== 0 && !!exercise

  const updateExercise = useCallback(async () => {
    if (name === exercise?.name && notes === exercise.notes) {
      toast.success("Exercise updated")
      noUpdate()
      return
    }

    if (!exercise) {
      toast.error("Failed to update exercise")
      return
    }

    const sameName = await db.exercises.where({ name }).toArray()

    if (sameName.length !== 0 && name !== exercise.name) {
      toast.error("Exercise with that name already exists")
      return
    }

    db.exercises
      .update(exercise.id, { name, notes })
      .then((updatedCount) => {
        if (updatedCount === 0) throw new Error("Failed to update exercise")
        else toast.success("Exercise updated")
      })
      .catch(() => {
        toast.error("Failed to update exercise")
      })
  }, [exercise, name, notes])

  return useMemo(
    () => ({ name, setName, notes, setNotes, valid, updateExercise }),
    [name, notes, updateExercise]
  )
}

const useDeleteExercise = (onSuccess: () => void) => {
  return useCallback((exerciseId: string) => {
    db.exercises
      .delete(exerciseId)
      .then(() => {
        toast.success("Exercise deleted")
        onSuccess()
      })
      .catch(() => {
        toast.error("Failed to delete exercise")
      })
  }, [])
}

const ExercisePage = () => {
  const [editing, setEditing] = useState(false)

  const { id } = useParams<{ id: string }>()

  const exercise = useExercise(id)
  const { name, setName, notes, setNotes, updateExercise } = useUpdateExercise(
    exercise,
    () => setEditing(false)
  )
  const navigate = useNavigate()
  const deleteExercise = useDeleteExercise(() => navigate("/exercises"))

  const firstEditingRenderDone = useRef(false)

  useEffect(() => {
    if (!editing) {
      firstEditingRenderDone.current = false
      return
    }

    if (!firstEditingRenderDone.current) {
      firstEditingRenderDone.current = true
    } else {
      setEditing(false)
    }
  }, [editing, exercise?.name, exercise?.notes])

  if (!exercise) return null

  return (
    <div className="space-y-4">
      {!editing ? (
        <h2 className="font-semibold text-xl">{exercise.name}</h2>
      ) : (
        <TextInput
          label="Exercise name"
          value={name}
          changeHandler={setName}
          htmlFor="exerciseName"
        />
      )}
      {!editing ? (
        !!exercise.notes && (
          <div className="whitespace-pre border border-border rounded-md shadow-sm shadow-shadow p-3.5 py-2.5">
            {exercise.notes}
          </div>
        )
      ) : (
        <TextareaInput
          label="Exercise notes"
          value={notes}
          changeHandler={setNotes}
          htmlFor="exerciseNotes"
        />
      )}
      {!editing ? (
        <div className="space-x-4">
          <Button onClick={() => null}>Log set</Button>
          <Button onClick={() => setEditing((b) => !b)}>Edit</Button>
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <Button onClick={() => null}>Delete</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <div className="fixed h-full w-full top-0 left-0 bg-background opacity-60"></div>
              <div className="absolute left-1/2 -translate-x-1/2 flex justify-center">
                <div className="max-w-md w-5/6 space-y-4 p-4 border border-border rounded-md shadow-sm shadow-shadow bg-background">
                  <AlertDialog.Title>
                    <h2 className="font-semibold text-xl">Are you sure?</h2>
                  </AlertDialog.Title>
                  <AlertDialog.Description>
                    Deleting an exercise will also delete all recorded sets for
                    the exercise. Alternatively, you can change the name and
                    notes of the exercise using the{" "}
                    <span className="font-semibold">Edit</span> button.
                  </AlertDialog.Description>
                  <div className="space-x-4">
                    <AlertDialog.Action asChild>
                      <Button onClick={() => deleteExercise(exercise.id)}>
                        Delete
                      </Button>
                    </AlertDialog.Action>
                    <AlertDialog.Cancel asChild>
                      <Button onClick={() => null}>Cancel</Button>
                    </AlertDialog.Cancel>
                  </div>
                </div>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </div>
      ) : (
        <div className="space-x-4">
          <Button onClick={updateExercise}>Save</Button>
          <Button onClick={() => setEditing(false)}>Cancel</Button>
        </div>
      )}
    </div>
  )
}

export default ExercisePage
