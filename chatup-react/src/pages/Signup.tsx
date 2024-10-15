import { Container } from "@radix-ui/themes";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

type signupForm = {
    name: string,
    password: string,
    repeatPass: string,
    email: string
}

export default function Signup() {
    const [signupForm, setSignupForm] = useState<signupForm>({
        name: "",
        password: "",
        repeatPass:"",
        email: ""
    })
    const[passwordType, setPasswordType] = useState<"text" | "password">("password")
    const handleChange =(e: React.ChangeEvent<HTMLInputElement>) => {
        setSignupForm({...signupForm, [e.target.name]: e.target.value})
    }
    // TODO: Make api call to the backend for signup using the signuForm
    return(
        <Container className="w-full min-h-screen bg-green-400 p-5 flex flex-col justify-center items-center">
            <form
                className="m-auto bg-white w-[335px] h-fit flex flex-col justify-start gap-5 items-center p-5 rounded-md"
            >
                <p className="text-2xl text-green-400 font-bold">Signup</p>
                <fieldset className="flex flex-col w-full">
                    <label>name</label>
                    <input
                        className="outline-emerald-400 w-full p-2 rounded-md border border-green-400 text-slate-500"
                        name="name"
                        placeholder="John Doe"
                        onChange={handleChange}>    
                    </input>
                </fieldset>
                <fieldset className="flex flex-col w-full">
                    <label>email</label>
                    <input
                        className="outline-emerald-400 w-full p-2 rounded-md border border-green-400 text-slate-500"
                        name="email"
                        placeholder="john@email.com"
                        onChange={handleChange}></input>
                </fieldset>
                <div className="flex flex-col w-full">
                    <label>password</label>
                    <div className="flex items-center gap-2 border-[1px] rounded-md border-green-400">
                        <input
                            className="outline-none w-full p-2 rounded-md text-slate-500"
                            name="password"
                            type={passwordType}
                            onChange={handleChange}></input>
                            {
                                passwordType === "text" ?
                                    <FaRegEye onClick={() => setPasswordType("password")} className="text-2xl mr-2 cursor-pointer"/>
                                    :
                                    <FaRegEyeSlash onClick={()=> setPasswordType("text")} className="text-2xl mr-2 cursor-pointer"/>
                            }
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="repeatPass">Repeat password</label>
                    <input
                        name="repeatPass"
                        type="password"
                        onChange={handleChange}
                        className="outline-emerald-400 w-full p-2 rounded-md border border-green-400 text-slate-500"></input>
                </div>
                <button
                    className="bg-green-400 hover:bg-green-500 w-full rounded-md p-2 text-white font-semibold"
                >Create account</button>

                <p className="text-sm text-green-400">Have an account? <Link className="font-bold" to={'/auth/login'}>Login</Link></p>

                <p>or</p>
                <button
                    className="outline outline-1 outline-green-400 hover:bg-green-300 hover:text-slate-100 hover:outline-slate-100 w-full rounded-md p-2 text-green-600 font-semibold"
                >Signup with google</button>
            </form>
        </Container>
    )
}