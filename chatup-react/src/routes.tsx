import { createBrowserRouter } from "react-router-dom"

import Home from "./pages/Home"
import Contact from "./pages/Contact"
import About from "./pages/About"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Chat from "./pages/Chat"
import App from "./pages/App"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/auth/signup",
    element: <Signup />,
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/signup",
    element: <Signup />
  },
  {
    path: "/app",
    element: <App />
  }
])
