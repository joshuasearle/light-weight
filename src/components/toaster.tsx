import { Toaster as RHToaster } from "react-hot-toast"

const Toaster = () => {
  return (
    <RHToaster
      position="bottom-center"
      toastOptions={{
        className:
          "rounded-md shadow-sm shadow-shadow border font-semibold bg-background border-border text-default",
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
