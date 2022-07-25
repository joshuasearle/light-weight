import { useLiveQuery } from "dexie-react-hooks"
import { useCallback, useState, useMemo } from "react"
import toast from "react-hot-toast"
import { db, Exercise } from "../data/db"
import throughEvent from "../utils/throughEvent"

const useExercises = () => {
  return useLiveQuery(() =>
    db.exercises
      .orderBy("orderNumber")
      .toArray()
      .catch(() => {
        toast.error("Could not fetch exercises")
        return undefined
      })
  )
}

const useAddExercise = () => {
  const [addingExercise, setAddingExercise] = useState(false)

  const toggleAddingExercise = useCallback(
    () => setAddingExercise((b) => !b),
    []
  )

  const addExercise = useCallback(
    async ({ name, notes }: { name: string; notes: string }) => {
      try {
        if (name.trim().length === 0) {
          toast.error("Exercise needs a name")
          return
        }

        const sameNameExercises = await db.exercises
          .where("name")
          .equals(name)
          .toArray()

        if (sameNameExercises.length !== 0) {
          toast.error("Exercise already exists")
          return
        }

        const firstOrderNumber =
          (await db.exercises.orderBy("orderNumber").limit(1).toArray())[0]
            ?.orderNumber || 0

        await db.exercises.add({
          id: crypto.randomUUID(),
          name,
          notes,
          orderNumber: firstOrderNumber - 1,
        })
        toast.success("Exercise created")
        setAddingExercise(false)
      } catch (e) {
        toast.error("Failed to add exercise")
      }
    },
    []
  )

  return useMemo(
    () => ({ addExercise, addingExercise, toggleAddingExercise }),
    [addExercise, addingExercise, toggleAddingExercise]
  )
}

const useEditExercise = () => {
  const [exerciseId, setExerciseId] = useState<string | null>(null)

  const setExercise = useCallback((exercise: Exercise) => {
    setExerciseId(exercise.id)
  }, [])

  const stopEditting = useCallback(() => setExerciseId(null), [])

  const updateExercise = useCallback(
    ({ name, notes }: { name: string; notes: string }) => {
      if (!exerciseId) {
        toast.error("Exercise needs a name")
        return
      }

      db.exercises
        .update(exerciseId, { name, notes })
        .then((updatedCount) => {
          if (updatedCount === 0) throw new Error("Failed to update exercise")
          else toast.success("Exercise updated")
        })
        .catch(() => {
          toast.error("Failed to update exercise")
        })
        .finally(() => {
          setExerciseId(null)
        })
    },
    [exerciseId]
  )

  return useMemo(
    () => ({
      exerciseId,
      updateExercise,
      setExercise,
      stopEditting,
    }),
    [exerciseId, updateExercise, setExercise, stopEditting]
  )
}

const useDeleteExercise = () => {
  return useCallback((exerciseId: string) => {
    db.exercises
      .where("id")
      .equals(exerciseId)
      .delete()
      .then((deletedCount) => {
        if (deletedCount === 0) throw new Error("Failed to delete exercise")
        else toast.success("Exercise deleted")
      })
      .catch(() => {
        toast.error("Failed to delete exercise")
      })
  }, [])
}

const AddExerciseForm = () => {
  const { addingExercise, addExercise, toggleAddingExercise } = useAddExercise()

  return (
    <>
      {addingExercise ? (
        <ExerciseForm
          {...{
            submitMessage: "Add exercise",
            onSubmit: addExercise,
            onCancel: toggleAddingExercise,
          }}
        />
      ) : (
        <button onClick={toggleAddingExercise}>Add exercise</button>
      )}
    </>
  )
}

const ExerciseForm = ({
  submitMessage,
  onSubmit,
  onCancel,
}: {
  submitMessage: string
  onSubmit: ({ name, notes }: { name: string; notes: string }) => void
  onCancel: () => void
}) => {
  const [name, setName] = useState("")
  const [notes, setNotes] = useState("")

  return (
    <div>
      <input value={name} onChange={throughEvent(setName)} />
      <input value={notes} onChange={throughEvent(setNotes)} />
      <button onClick={() => onSubmit({ name, notes })}>{submitMessage}</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}

const ExerciseList = ({ exercises }: { exercises: Exercise[] }) => {
  const { exerciseId, setExercise, stopEditting, updateExercise } =
    useEditExercise()
  const deleteExercise = useDeleteExercise()

  return (
    <>
      {exercises.map((exercise) =>
        exercise.id === exerciseId ? (
          <ExerciseForm
            {...{
              submitMessage: "Update exercise",
              onSubmit: updateExercise,
              onCancel: stopEditting,
            }}
          />
        ) : (
          <div key={exercise.id}>
            <pre>{JSON.stringify(exercise, null, 2)}</pre>
            <button onClick={() => deleteExercise(exercise.id)}>Delete</button>
            <button
              onClick={() => {
                setExercise(exercise)
              }}
            >
              Edit
            </button>
          </div>
        )
      )}
    </>
  )
}

const Exercises = () => {
  const exercises = useExercises()

  return (
    <div>
      <AddExerciseForm />
      {!!exercises && <ExerciseList exercises={exercises} />}
    </div>
  )
}

export default Exercises
