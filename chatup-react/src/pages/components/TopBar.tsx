import { Link } from "react-router-dom"

export default function TopBar() {
  return (
    <div className="fixed top-0 left-0 bg-transparent backdrop-blur-lg w-full py-2 px-4 flex justify-evenly">
      <div className="text-green-500 font-bold text-3xl">
        <Link to={"/"}>Chatup</Link>
      </div>
      <div className="flex gap-20 items-center justify-center">
        <div>
          <ul className="flex gap-8">
            <Link to={"/"}>Home</Link>
            <Link to={"/about"}>About</Link>
            <Link to={"/contact"}>Contact</Link>
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <Link to={"/auth/signup"}>Get started</Link>
          <Link
            to={"/auth/login"}
            className="px-8 py-2 bg-green-400 rounded-md text-white"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
