import { useLiveQuery } from "dexie-react-hooks"
import { useCallback } from "react"
import { db } from "../data/db"
import getId from "../utils/id"

const useExercises = () => {
  const exercises = useLiveQuery(() => {
    return db.exercises.toArray()
  })

  const createExercise = useCallback(() => {
    db.exercises.add({ id: getId(), name: "Pushups" })
  }, [])

  return { exercises, createExercise }
}

export default useExercises
