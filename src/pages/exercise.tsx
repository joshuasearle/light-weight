import * as AlertDialog from "@radix-ui/react-alert-dialog"
import { useLiveQuery } from "dexie-react-hooks"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import Button from "../components/button"
import DateInput from "../components/date-input"
import ExerciseForm from "../components/exercise-form"
import TimeInput from "../components/time-input"
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
  const updateExercise = useCallback(
    async ({ name, notes }: { name: string; notes: string }) => {
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
    },
    [exercise]
  )

  return updateExercise
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

const SetForm = memo(
  (x: {
    submitMessage: string
    onSubmit: ({ name, notes }: { name: string; notes: string }) => void
    closeForm: () => void
  }) => {
    console.log(x)

    return (
      <div className="border border-border rounded-md shadow-shadow p-4">
        <div className="flex flex-row justify-between space-x-4">
          <div className="w-full">
            <DateInput
              label="Date"
              htmlFor="setDate"
              value={""}
              changeHandler={() => null}
            />
          </div>
          <div className="w-full">
            <TimeInput
              label="Time"
              htmlFor="setTime"
              value={""}
              changeHandler={() => null}
            />
          </div>
        </div>
      </div>
    )
  }
)

enum PageState {
  NORMAL,
  EDITING_EXERCISE,
  CREATING_SET,
  EDITTING_SET,
}

const ExercisePage = () => {
  const [pageState, setPageState] = useState<PageState>(PageState.NORMAL)

  const { id } = useParams<{ id: string }>()

  const exercise = useExercise(id)
  const updateExercise = useUpdateExercise(exercise, () =>
    setPageState(PageState.NORMAL)
  )
  const navigate = useNavigate()
  const deleteExercise = useDeleteExercise(() => navigate("/exercises"))

  const firstEditingRenderDone = useRef(false)

  // Set page state to normal when live query updates
  useEffect(() => {
    if (pageState !== PageState.EDITING_EXERCISE) {
      firstEditingRenderDone.current = false
      return
    }

    if (!firstEditingRenderDone.current) {
      firstEditingRenderDone.current = true
    } else {
      setPageState(PageState.NORMAL)
    }
  }, [pageState, exercise?.name, exercise?.notes])

  if (!exercise) return null

  return (
    <div className="space-y-4">
      {pageState === PageState.EDITING_EXERCISE && (
        <ExerciseForm
          submitMessage="Save"
          onSubmit={updateExercise}
          closeForm={() => setPageState(PageState.NORMAL)}
          initialName={exercise.name}
          initialNotes={exercise.notes}
        />
      )}
      {pageState !== PageState.EDITING_EXERCISE && (
        <h2 className="font-semibold text-xl">{exercise.name}</h2>
      )}
      {pageState !== PageState.EDITING_EXERCISE && !!exercise.notes && (
        <div className="whitespace-pre border border-border rounded-md shadow-sm shadow-shadow p-3.5 py-2.5">
          {exercise.notes}
        </div>
      )}
      {pageState === PageState.NORMAL && (
        <div className="space-x-4">
          <Button onClick={() => setPageState(PageState.CREATING_SET)}>
            Log set
          </Button>
          <Button onClick={() => setPageState(PageState.EDITING_EXERCISE)}>
            Edit
          </Button>
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <Button onClick={() => null}>Delete</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <div className="fixed h-full w-full top-0 left-0 bg-background opacity-70"></div>
              <div className="max-w-md w-5/6 absolute left-1/2 -translate-x-1/2 flex justify-center">
                <div className="space-y-4 p-4 border border-border rounded-md shadow-sm shadow-shadow bg-background">
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
      )}
      {pageState === PageState.CREATING_SET && (
        <SetForm
          submitMessage="Log"
          onSubmit={() => null}
          closeForm={() => setPageState(PageState.NORMAL)}
        />
      )}
    </div>
  )
}

export default memo(ExercisePage)
