import { DotsHorizontalIcon } from "@heroicons/react/solid"
import * as AlertDialog from "@radix-ui/react-alert-dialog"
import * as Popover from "@radix-ui/react-popover"
import { useLiveQuery } from "dexie-react-hooks"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import Button from "../components/button"
import DateInput from "../components/datetime-input"
import ExerciseForm from "../components/exercise-form"
import Label from "../components/label"
import NumberInput from "../components/number-input"
import { db, Exercise, Set } from "../data/db"

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

const useSets = (exerciseId: string | null) => {
  return useLiveQuery(async () => {
    if (!exerciseId) return undefined

    const sets = await db.sets
      .where("exerciseId")
      .equals(exerciseId)
      .reverse()
      .sortBy("performedAt")
      .catch(() => {
        toast.error("Could not fetch sets")
        return undefined
      })

    if (!sets || sets.length === 0) return undefined

    const setGroups: Set[][] = []

    let currentSetGroup: Set[] = [sets[0]]

    sets.forEach((current, i) => {
      if (i === 0) return

      const previous = currentSetGroup[currentSetGroup.length - 1]
      const msDifference =
        previous.performedAt.getTime() - current.performedAt.getTime()
      const minDifference = msDifference / (1000 * 60)

      const MAX_RESTTIME_THRESHOLD = 15

      if (minDifference < MAX_RESTTIME_THRESHOLD) {
        currentSetGroup.push(current)
      } else {
        setGroups.push([...currentSetGroup])
        currentSetGroup = [current]
      }
    })

    setGroups.push([...currentSetGroup])

    return setGroups
  }, [exerciseId])
}

const useCreateSet = () => {
  return useCallback(
    async ({
      exerciseId,
      performedAt,
      weight,
      reps,
      rpe,
    }: {
      exerciseId: string
      performedAt: Date
      weight: number
      reps: number
      rpe: number
    }) => {
      try {
        await db.sets.add({
          id: crypto.randomUUID(),
          exerciseId,
          performedAt,
          weight,
          reps,
          rpe,
        })
        toast.success("Set logged")
      } catch (e) {
        toast.error("Failed to log set")
      }
    },
    []
  )
}

const useUpdateSet = () => {
  return useCallback(
    (setId: string) =>
      async ({
        date,
        weight,
        reps,
        rpe,
      }: {
        date: Date
        weight: number
        reps: number
        rpe: number
      }) => {
        try {
          await db.sets.update(setId, {
            performedAt: date,
            weight,
            reps,
            rpe,
          })
          toast.success("Set updated")
        } catch (e) {
          toast.error("Failed to update set")
        }
      },
    []
  )
}

const useDeleteSet = () => {
  return useCallback(async (setId: string) => {
    try {
      await db.sets.delete(setId)
      toast.success("Set deleted")
    } catch (e) {
      toast.error("Failed to delete set")
    }
  }, [])
}

const SetForm = memo(
  ({
    submitMessage,
    onSubmit,
    closeForm,
    initialDate,
    initialWeight,
    initialReps,
    initialRpe,
    roundedTop = true,
    roundedBottom = true,
  }: {
    submitMessage: string
    onSubmit: (_: {
      date: Date
      weight: number
      reps: number
      rpe: number
    }) => void
    closeForm: () => void
    initialDate?: Date
    initialWeight?: number
    initialReps?: number
    initialRpe?: number
    roundedTop?: boolean
    roundedBottom?: boolean
  }) => {
    const [date, setDate] = useState(initialDate || new Date())
    const [weight, setWeight] = useState<number | null>(initialWeight || null)
    const [reps, setReps] = useState<number | null>(initialReps || null)
    const [rpe, setRpe] = useState<number | null>(initialRpe || null)

    return (
      <div
        className={`border-x border-t border-border shadow-shadow p-4 ${
          roundedTop && "rounded-t"
        } ${roundedBottom && "rounded-b border-b"}`}
      >
        <div className="flex flex-col justify-between space-y-4">
          <div className="w-full">
            <DateInput
              label="Date"
              htmlFor="setDate"
              value={date}
              changeHandler={setDate}
            />
          </div>
          <div className="flex flex-row space-x-4">
            <NumberInput
              label="Weight"
              htmlFor="setWeight"
              value={weight}
              changeHandler={setWeight}
              fractionDigits={2}
            />
            <NumberInput
              label="Reps"
              htmlFor="setReps"
              value={reps}
              changeHandler={setReps}
              min={0}
              fractionDigits={0}
            />
            <NumberInput
              label="RPE"
              htmlFor="setRpe"
              value={rpe}
              changeHandler={setRpe}
              min={0}
              max={10}
              fractionDigits={0}
            />
          </div>
          <div className="flex flex-row space-x-4">
            <Button
              onClick={() => {
                if (date && weight && reps && rpe) {
                  onSubmit({ date, weight, reps, rpe })
                }
              }}
            >
              {submitMessage}
            </Button>
            <Button onClick={closeForm}>Cancel</Button>
          </div>
        </div>
      </div>
    )
  }
)

const SetCard = memo(
  ({
    set: { id, performedAt, weight, reps, rpe },
    first,
    last,
    selectSetToEdit,
  }: {
    set: Set
    first: boolean
    last: boolean
    selectSetToEdit: (_: string | null) => void
  }) => {
    const timeString = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
    }).format(performedAt)
    const [modalOpen, setModalOpen] = useState(false)

    const deleteSet = useDeleteSet()

    return (
      <div
        className={`relative sm:text-base text-sm flex flex-row justify-between border-x border-t border-border sm:px-3.5 sm:py-2 px-3 py-1.5 ${
          first && last
            ? "rounded border-b"
            : first
            ? "rounded-t-md"
            : last
            ? "rounded-b-md border-b"
            : ""
        }`}
      >
        <span className="w-1/4">{timeString}</span>
        <span className="w-1/4">{weight}kg</span>
        <span className="w-1/4">{reps} reps</span>
        <span className="w-1/4">{rpe ? `RPE ${rpe}` : ""}</span>
        <span className="absolute right-4 top-1/2 -translate-y-1/2">
          <Popover.Root open={modalOpen} onOpenChange={setModalOpen}>
            <Popover.Trigger asChild>
              <DotsHorizontalIcon className="sm:h-5 sm:w-5 h-[18px] w-[18px] cursor-pointer" />
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content>
                <div className="font-semibold bg-background flex flex-col items-start z-10 shadow-sm shadow-shadow rounded-md">
                  <div className="border-border border rounded-t w-full">
                    <button
                      onClick={() => {
                        selectSetToEdit(id)
                        setModalOpen(false)
                      }}
                      className="text-sm sm:text-base sm:px-3.5 sm:py-2 px-3 py-1.5 w-full text-left outline-none focus-visible:ring-2 ring-cyan-900 rounded-md duration-[50ms]"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="border-x border-b border-border rounded-b">
                    <button
                      onClick={async () => {
                        await deleteSet(id)
                        setModalOpen(false)
                      }}
                      className="text-sm sm:text-base sm:px-3.5 sm:py-2 px-3 py-1.5 outline-none focus-visible:ring-2 ring-cyan-900 duration-[50ms] rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </span>
      </div>
    )
  }
)

const SetGroup = memo(
  ({
    setGroup,
    selectSetToEdit,
    selectedSetId,
  }: {
    setGroup: Set[]
    selectSetToEdit: (_: string | null) => void
    selectedSetId: string | null
  }) => {
    if (setGroup.length === 0) return <></>

    const { performedAt } = setGroup[0]
    const dateString = new Intl.DateTimeFormat("en-US", {
      month: "short",
      weekday: "short",
      day: "numeric",
    }).format(performedAt)

    const updateSet = useUpdateSet()

    return (
      <div>
        <Label>{dateString}</Label>
        <div className="shadow-sm shadow-shadow rounded-md">
          {setGroup.map((set, i) =>
            set.id === selectedSetId ? (
              <SetForm
                key={set.id}
                submitMessage="Update"
                onSubmit={updateSet(set.id)}
                closeForm={() => selectSetToEdit(null)}
                roundedTop={i === 0}
                roundedBottom={i === setGroup.length - 1}
                initialDate={set.performedAt}
                initialWeight={set.weight}
                initialReps={set.reps}
                initialRpe={set.rpe}
              />
            ) : (
              <SetCard
                key={set.id}
                set={set}
                first={i === 0}
                last={i === setGroup.length - 1}
                selectSetToEdit={selectSetToEdit}
              />
            )
          )}
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

  const firstExerciseEditingRenderDone = useRef(false)

  // Set page state to normal when live query updates
  useEffect(() => {
    if (pageState !== PageState.EDITING_EXERCISE) {
      firstExerciseEditingRenderDone.current = false
      return
    }

    if (!firstExerciseEditingRenderDone.current) {
      firstExerciseEditingRenderDone.current = true
    } else {
      setPageState(PageState.NORMAL)
    }
  }, [pageState, exercise?.name, exercise?.notes])

  const createSet = useCreateSet()
  const setGroups = useSets(exercise ? exercise.id : null)

  const firstSetEditingRenderDone = useRef(false)

  useEffect(() => {
    if (
      pageState !== PageState.CREATING_SET &&
      pageState !== PageState.EDITTING_SET
    ) {
      firstSetEditingRenderDone.current = false
      return
    }

    if (!firstSetEditingRenderDone.current) {
      firstSetEditingRenderDone.current = true
    } else {
      setPageState(PageState.NORMAL)
    }
  }, [pageState, setGroups])

  const [setEditingId, setSetEditingId] = useState<string | null>(null)

  const selectSetToEdit = useCallback((setId: string | null) => {
    setPageState(setId === null ? PageState.NORMAL : PageState.EDITTING_SET)
    setSetEditingId(setId)
  }, [])

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
        <div>
          <h2 className="font-semibold text-xl">{exercise.name}</h2>
          {!!exercise.notes && (
            <div className="mt-3 whitespace-pre border border-border rounded-md shadow-sm shadow-shadow sm:px-3.5 sm:py-2 px-3 py-1.5 text-sm sm:text-base">
              {exercise.notes}
            </div>
          )}
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
              <div className="max-w-md w-5/6 absolute left-1/2 -translate-x-1/2 flex justify-center bg-background z-10">
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
          onSubmit={({ date, weight, reps, rpe }) => {
            if (!exercise) return
            createSet({
              exerciseId: exercise.id,
              performedAt: date,
              weight,
              reps,
              rpe,
            })
          }}
          closeForm={() => setPageState(PageState.NORMAL)}
          initialWeight={
            Array.isArray(setGroups) &&
            setGroups.length !== 0 &&
            setGroups[0].length !== 0
              ? setGroups[0][0].weight
              : undefined
          }
        />
      )}
      {Array.isArray(setGroups) &&
        setGroups.map((setGroup, i) => (
          <SetGroup
            selectSetToEdit={selectSetToEdit}
            key={i}
            setGroup={setGroup}
            selectedSetId={
              pageState === PageState.EDITTING_SET ? setEditingId : null
            }
          />
        ))}
    </div>
  )
}

export default memo(ExercisePage)
