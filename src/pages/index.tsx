import { Link } from "react-router-dom"
import Button from "../components/button"

const Dashboard = () => {
  return (
    <div>
      <h2 className="font-semibold">Quick links</h2>
      <Link to="/exercises">
        <Button onClick={() => null}>Exercises</Button>
      </Link>
    </div>
  )
}

export default Dashboard
