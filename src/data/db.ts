import Dexie, { Table } from "dexie"

interface Exercise {
  id: string
  name: string
  notes?: string
}

interface Set {
  id: string
  exerciseId: string
  performedAt: Date
  weight: number
  reps: number
  rpe?: number
}

class LightWeightDatabase extends Dexie {
  exercises!: Table<Exercise>
  sets!: Table<Set>

  constructor() {
    super("LightWeightDatabase")
    this.version(1).stores({
      exercises: "&id",
      sets: "&id,exerciseId,performedAt",
    })
  }
}

export const db = new LightWeightDatabase()
