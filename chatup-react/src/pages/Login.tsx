import { Container } from "@radix-ui/themes"
import { Link, useNavigate } from "react-router-dom"
import React, { useState } from "react"
import { api } from "../lib/requestHandler"

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
    api
      .post("/auth/login", user)
      .then((response) => {
        if (response.status === 200) {
          setLoading(false)
          sessionStorage.setItem("token", JSON.stringify(response.data.token))
          sessionStorage.setItem(
            "user_id",
            JSON.stringify(response.data.user.id)
          )

          console.log(response.data)
          return navigate("/app/chats")
        }
      })
      .catch((error) => {
        if (error.response && error.status.response) {
          setLoading(false)
          return alert("An error occurred")
        }
        setLoading(false)
        return alert("An error occurred please try again later")
      })
  }

  return (
    <Container className="w-full h-screen bg-green-400 p-5 flex flex-col justify-center items-center">
      <div className="m-auto bg-white w-[335px] md:w-[400px] h-fit flex flex-col gap-4 items-center p-5 rounded-md">
        <form onSubmit={handleLogin} className="flex flex-col gap-2 w-full">
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
          {error && (
            <p className="text-red-500 text-sm font-semibold">{error}</p>
          )}
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
        </form>
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
      </div>
    </Container>
  )
}
