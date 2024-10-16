import { Container } from "@radix-ui/themes"
import { Link, useNavigate } from "react-router-dom"
import React, { useState } from "react"

export default function Login() {
  const [user, setUser] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  // Handle login
  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    navigate('/app/chats')
  }

  return (
    <Container className="w-full h-screen bg-green-400 p-5 flex flex-col justify-center items-center">
      <form
        onSubmit={handleLogin}
        className="m-auto bg-white sm:max-h-[700px] w-[335px] h-[500px] flex flex-col justify-start gap-5 items-center p-5 rounded-md"
      >
        <h1 className="text-2xl text-green-400 font-bold">Login</h1>
        <input
          className="outline-emerald-400 w-full p-2 rounded-md border border-green-400 text-slate-500"
          type="email"
          name="email"
          placeholder="email"
          required
          onChange={handleChange}
        />
        <input
          className="outline-emerald-400 w-full p-2 rounded-md border border-green-400 text-slate-500"
          type="password"
          name="password"
          placeholder="password"
          onChange={handleChange}
        />
        {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
        <p className="text-sm text-green-400">
          <Link to={"/auth/signup"} className="text-green-500">
            Forgot password?
          </Link>
        </p>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-400 hover:bg-green-500 w-full rounded-md p-2 text-white font-semibold"
        >
          {loading ? "Loading..." : "Login"}
        </button>
        <p className="text-sm text-green-400">
          Don't have an account?{" "}
          <Link to={"/auth/signup"} className="text-green-500">
            Register
          </Link>
        </p>
        <p className="text-sm text-slate-500 font-light">or</p>
        <button className="outline outline-1 outline-green-400 hover:bg-green-300 hover:text-slate-100 hover:outline-slate-100 w-full rounded-md p-2 text-green-600 font-semibold">
          Login with Google
        </button>
      </form>
    </Container>
  )
}
