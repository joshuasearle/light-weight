import { memo } from "react"
import { Toaster as RHToaster } from "react-hot-toast"

const Toaster = () => {
  return (
    <RHToaster
      position="bottom-center"
      toastOptions={{
        success: {
          duration: 2000,
        },
        error: {
          duration: 4000,
        },
        style: {
          borderRadius: "0.375rem",
          boxShadow: "0 1px 2px 0 #141417",
          border: "1px solid #52525b",
          backgroundColor: "#18181b",
          color: "#f4f4f5",
          fontWeight: 600,
        },
      }}
    />
  )
}

export default memo(Toaster)
