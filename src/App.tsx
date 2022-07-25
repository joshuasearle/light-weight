import { Route, Routes } from "react-router-dom"
import Toaster from "./components/toaster"
import Exercises from "./pages/exercises"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Exercises />} />
        <Route path="/exercises" element={<Exercises />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
