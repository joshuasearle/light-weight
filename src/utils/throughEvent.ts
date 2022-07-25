import { ChangeEvent, Dispatch, SetStateAction } from "react"

const throughEvent = (f: Dispatch<SetStateAction<string>>) => {
  return (e: ChangeEvent<HTMLInputElement>) => {
    f(e.target.value)
  }
}

export default throughEvent
