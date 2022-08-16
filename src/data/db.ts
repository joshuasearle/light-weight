import Dexie, { Table } from "dexie"

interface Exercise {
  id: string
  orderNumber: number
  name: string
  notes: string
}

interface Set {
  id: string
  exerciseId: string
  performedAt: Date
  weight: number
  reps: number
  rpe?: number
}

interface Measurement {
  id: string
  orderNumber: number
  name: string
  notes: string
  units: string
  isNumber: boolean
}

interface Record {
  id: string
  measurementId: string
  value: number | string
  recordedAt: Date
}

class LightWeightDatabase extends Dexie {
  exercises!: Table<Exercise>
  sets!: Table<Set>
  measurements!: Table<Measurement>
  records!: Table<Record>

  constructor() {
    super("LightWeightDatabase")
    this.version(1).stores({
      exercises: "&id,&name,orderNumber",
      sets: "&id,exerciseId,performedAt",
      measurements: "&id,&name,orderNumber",
      records: "&id,measurementId,recordedAt",
    })
  }
}

export const db = new LightWeightDatabase()
export type { Exercise, Set }
