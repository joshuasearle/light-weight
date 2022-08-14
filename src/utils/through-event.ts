import { ChangeEvent, Dispatch, SetStateAction } from "react"

type Setter = Dispatch<SetStateAction<string>> | ((_: string) => void)

const throughEvent = (f: Setter) => {
  return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    f(e.target.value)
  }
}

export default throughEvent
