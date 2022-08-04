import { Navigate, Route, Routes } from "react-router-dom"
import Toaster from "./components/toaster"
import Exercises from "./pages/exercises"
import { MenuIcon, UserIcon } from "@heroicons/react/solid"
import ExercisePage from "./pages/exercise"

function App() {
  return (
    <div>
      <div className="border-b border-border shadow-sm  shadow-shadow">
        <nav className="px-4 text-zinc-100 flex flex-row justify-between max-w-xl mx-auto items-center py-2">
          <MenuIcon className="w-6 h-6" />
          <h1 className="font-bold text-2xl">LightWeight</h1>
          <UserIcon className="w-6 h-6" />
        </nav>
      </div>
      <div className="sm:mt-6 max-w-xl mx-auto border-border sm:shadow-sm shadow-shadow sm:border sm:rounded-md p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/exercises" />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/exercises/:id" element={<ExercisePage />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  )
}

export default App
