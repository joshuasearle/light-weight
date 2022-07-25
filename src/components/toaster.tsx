import { Toaster as RHToaster } from "react-hot-toast"

const Toaster = () => {
  return (
    <RHToaster
      position="bottom-center"
      toastOptions={{
        className:
          "rounded-md shadow-sm border border-zinc-300 text-zinc-700 font-semibold",
        style: {
          // Removes default shadow of toast, and sets it to `shadow-sm`
          boxShadow: " 0 1px 2px 0 rgb(0 0 0 / 0.05)",
        },
        success: {
          duration: 2000,
        },
        error: {
          duration: 4000,
        },
      }}
    />
  )
}

export default Toaster
