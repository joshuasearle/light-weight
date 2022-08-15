import { Link, Route, Routes, useLocation } from "react-router-dom"
import Toaster from "./components/toaster"
import Exercises from "./pages/exercises"
import { MenuIcon, UserIcon } from "@heroicons/react/solid"
import ExercisePage from "./pages/exercise"
import * as Popover from "@radix-ui/react-popover"
import { useMemo, useState } from "react"
import Dashboard from "./pages"

const menuOptions = [
  { label: "Dashboard", path: "/" },
  { label: "Exercises", path: "/exercises" },
]

const Menu = () => {
  const [open, setOpen] = useState(false)

  const { pathname } = useLocation()

  const filteredOptions = useMemo(
    () => menuOptions.filter((option) => option.path !== pathname),
    [pathname]
  )

  return (
    <div>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            className="flex items-center outline-none focus-visible:ring ring-cyan-900 duration-[50ms] rounded-md p-1"
            onClick={() => setOpen((b) => !b)}
          >
            <MenuIcon className="w-6 h-6 cursor-pointer" />
          </button>
        </Popover.Trigger>
        <Popover.Content asChild>
          <div className="rounded-md shadow-sm shadow-shadow flex flex-col outline-none bg-background">
            {filteredOptions.map(({ label, path }, i) => (
              <div
                key={path}
                className={`border-border border-b border-x ${
                  i === 0 && i === filteredOptions.length - 1
                    ? "rounded-md border-t"
                    : i === 0
                    ? "rounded-t-md border-t"
                    : i === filteredOptions.length - 1
                    ? "rounded-b-md"
                    : ""
                }`}
              >
                <Link
                  to={path}
                  className="rounded-md block px-3.5 py-2 outline-none focus-visible:ring ring-cyan-900 duration-[50ms] "
                >
                  {label}
                </Link>
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  )
}

function App() {
  return (
    <div>
      <div className="border-b border-border shadow-sm  shadow-shadow">
        <nav className="px-4 text-zinc-100 flex flex-row justify-between max-w-xl mx-auto items-center py-2">
          <Menu />
          <h1 className="font-bold text-2xl">LightWeight</h1>
          <UserIcon className="w-6 h-6" />
        </nav>
      </div>
      <div className="sm:mt-6 max-w-xl mx-auto border-border sm:shadow-sm shadow-shadow sm:border sm:rounded-md p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/exercises/:id" element={<ExercisePage />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  )
}

export default App
