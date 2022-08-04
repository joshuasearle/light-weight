import { ChevronRightIcon, SelectorIcon } from "@heroicons/react/solid"
import { useLiveQuery } from "dexie-react-hooks"
import { useCallback, useState, useRef, useEffect, memo } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import Button from "../components/button"
import TextInput from "../components/text-input"
import TextareaInput from "../components/textarea-input"
import { db, Exercise } from "../data/db"
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd"

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

const useAddExercise = (onSuccess?: () => void) => {
  return useCallback(
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
        // TODO: Testing needed here
        if (onSuccess) setTimeout(onSuccess, 150)
      } catch (e) {
        toast.error("Failed to add exercise")
      }
    },
    [onSuccess]
  )
}

const useMoveExercise = (exercises: Exercise[]) => {
  return useCallback(
    async (result: DropResult) => {
      if (!result.destination) {
        return
      }

      if (result.destination.index === result.source.index) {
        return
      }

      const newExercises = [...exercises]
      const [removed] = newExercises.splice(result.source.index, 1)
      newExercises.splice(result.destination.index, 0, removed)

      const promises = newExercises.map((exercise, i) => {
        return db.exercises.update(exercise.id, { orderNumber: i })
      })

      await Promise.all(promises)
    },
    [exercises]
  )
}

const AddExerciseForm = memo(
  ({
    closeForm,
    exercises,
  }: {
    closeForm: () => void
    exercises: Exercise[] | undefined
  }) => {
    const addExercise = useAddExercise()
    const firstArrayRenderDone = useRef(false)

    useEffect(() => {
      if (!firstArrayRenderDone.current) {
        if (Array.isArray(exercises)) firstArrayRenderDone.current = true
      } else {
        closeForm()
      }
    }, [exercises])

    return (
      <ExerciseForm
        {...{
          submitMessage: "Add exercise",
          onSubmit: addExercise,
          closeForm,
        }}
      />
    )
  }
)

const ExerciseForm = memo(
  ({
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
      if (nameInput.current) nameInput.current.focus()
    }, [])

    return (
      <div className="border border-border shadow shadow-shadow rounded-md p-4 flex flex-col space-y-4">
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
        />
        <div className="flex flex-row space-x-4">
          <Button onClick={() => onSubmit({ name, notes })}>
            {submitMessage}
          </Button>
          <Button onClick={closeForm}>Cancel</Button>
        </div>
      </div>
    )
  }
)

const ExerciseList = memo(({ exercises }: { exercises: Exercise[] }) => {
  return (
    <>
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </>
  )
})

const ExerciseCard = memo(
  ({
    exercise,
    reorderModeOn = false,
  }: {
    exercise: Exercise
    reorderModeOn?: boolean
  }) => {
    const className =
      "bg-background w-full border border-border shadow shadow-shadow rounded-md px-3.5 py-2 flex flex-row justify-between items-center outline-none group"

    if (reorderModeOn) {
      return (
        <div className={className}>
          <span className="font-semibold">{exercise.name}</span>
          <SelectorIcon className="h-6 w-6" />
        </div>
      )
    }

    return (
      <Link to={`/exercises/${exercise.id}`} className={className}>
        <span className="font-semibold">{exercise.name}</span>
        <ChevronRightIcon className="h-6 w-6 group-focus-visible:ring-2 group-focus-visible:ring-cyan-900 rounded-md" />
      </Link>
    )
  }
)

const ReorderableExerciseList = memo(
  ({ exercises }: { exercises: Exercise[] }) => {
    const moveExercise = useMoveExercise(exercises)

    const [exercisesCopy, setExercisesCopy] = useState([...exercises])

    useEffect(() => {
      setExercisesCopy([...exercises])
    }, [exercises])

    return (
      <DragDropContext
        onDragEnd={(result) => {
          if (!result.destination) return
          moveExercise(result)
          const newExercises = [...exercises]
          const [removed] = newExercises.splice(result.source.index, 1)
          newExercises.splice(result.destination.index, 0, removed)
          setExercisesCopy(newExercises)
        }}
      >
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {exercisesCopy.map((exercise, i) => (
                <Draggable
                  key={exercise.id}
                  draggableId={exercise.id}
                  index={i}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="py-2"
                    >
                      <ExerciseCard exercise={exercise} reorderModeOn={true} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
)

enum PageState {
  NORMAL,
  ADDING_EXERCISE,
  REORDERING,
}

const Exercises = memo(() => {
  const exercises = useExercises()
  const [pageState, setPageState] = useState<PageState>(PageState.NORMAL)

  const exercisesExist = !!exercises && exercises.length !== 0

  return (
    <div
      className={
        pageState === PageState.REORDERING ? "space-y-2 -mb-2" : "space-y-4"
      }
    >
      {pageState !== PageState.ADDING_EXERCISE && (
        <div className="flex flex-row justify-between w-full">
          <Button onClick={() => setPageState(PageState.ADDING_EXERCISE)}>
            Add exercise
          </Button>
          {exercisesExist && (
            <Button
              onClick={() =>
                setPageState(
                  pageState === PageState.REORDERING
                    ? PageState.NORMAL
                    : PageState.REORDERING
                )
              }
            >
              {pageState === PageState.REORDERING ? "Save" : "Reorder"}
            </Button>
          )}
        </div>
      )}
      {pageState === PageState.ADDING_EXERCISE && (
        <AddExerciseForm
          exercises={exercises}
          closeForm={() => setPageState(PageState.NORMAL)}
        />
      )}
      {exercisesExist && pageState !== PageState.REORDERING && (
        <ExerciseList exercises={exercises} />
      )}
      {exercisesExist && pageState === PageState.REORDERING && (
        <ReorderableExerciseList exercises={exercises} />
      )}
    </div>
  )
})

export default Exercises
