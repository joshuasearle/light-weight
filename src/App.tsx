import useExercises from "./hooks/useExercises"

function App() {
  const { exercises, createExercise } = useExercises()

  return (
    <div>
      <pre>{JSON.stringify(exercises, null, 2)}</pre>
      <button onClick={createExercise}>click</button>
    </div>
  )
}

export default App
