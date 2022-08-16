import { Link, Route, Routes, useLocation } from "react-router-dom"
import Toaster from "./components/toaster"
import Exercises from "./pages/exercises"
import { MenuIcon, UserIcon } from "@heroicons/react/solid"
import ExercisePage from "./pages/exercise"
import * as Popover from "@radix-ui/react-popover"
import { memo, useMemo, useState } from "react"
import Dashboard from "./pages"
import { isUuid } from "./utils/is-uuid"
import { capitalizeFirstLetter } from "./utils/caps-first-letter"

const menuOptions = [
  { label: "Dashboard", path: "/" },
  { label: "Exercises", path: "/exercises" },
]

const Menu = memo(() => {
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
                  onClick={() => setOpen(false)}
                  to={path}
                  className="text-sm sm:text-base font-semibold rounded-md block sm:px-3.5 sm:py-2 px-3 py-1.5 outline-none focus-visible:ring ring-cyan-900 duration-[50ms] "
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
})

const Breadcrumbs = memo(() => {
  const { pathname } = useLocation()

  const breadcrumbs = useMemo(() => {
    const breadcrumbs = []

    let currentPath = "/"

    breadcrumbs.push({ path: "/", label: "Home" })

    pathname
      .split("/")
      .filter((chunk) => !!chunk)
      .forEach((chunk, i) => {
        currentPath += `${i === 0 ? "" : "/"}${chunk}`
        breadcrumbs.push({ path: currentPath, label: chunk })
      })

    return breadcrumbs
  }, [pathname])

  return (
    <div className="w-fit border border-border rounded-md shadow-sm shadow-shadow flex flex-row">
      {breadcrumbs.map(({ path, label }, i) => (
        <Link
          to={path}
          key={path}
          className={`text-xs font-semibold px-2.5 py-1 border-border ${
            i !== 0 && "border-l"
          }`}
        >
          {isUuid(label) ? label.slice(0, 8) : capitalizeFirstLetter(label)}
        </Link>
      ))}
    </div>
  )
})

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
      <div className="mt-4 max-w-xl mx-auto">
        <div className="ml-4 sm:ml-0">
          <Breadcrumbs />
        </div>

        <div className="border-border sm:shadow-sm shadow-shadow sm:border sm:rounded-md p-4 sm:pt-4 pt-0 mt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/exercises/:id" element={<ExercisePage />} />
          </Routes>
        </div>
      </div>

      <Toaster />
    </div>
  )
}

export default App
