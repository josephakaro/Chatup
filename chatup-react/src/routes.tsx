import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Signup from "./pages/Signup";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/contact',
        element: <Contact />
    },
    {
        path: '/about',
        element: <About />
    },
    {
        path: '/auth/signup',
        element: <Signup />
    },
]
)