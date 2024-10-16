import { Container } from "@radix-ui/themes";
import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { api } from "../lib/requestHandler";

type signupForm = {
    name: string,
    password: string,
    repeatPass: string,
    email: string
}

export default function Signup() {
    const navigate = useNavigate()
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
    const [passwordMatch, setPasswordMatch] = useState<boolean>(true)

    const handleSignup = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        // Checks for password match and return if they do not match
        if (!passwordMatch || signupForm.email.length < 6 || signupForm.repeatPass.length < 4 || signupForm.password.length < 4 || signupForm.name < 4) {
            return alert('Please fill out the form with valid details')
        }
        // TODO: call backend signup api from here
        const payload = {
            "name": signupForm.name,
            "email": signupForm.email,
            "password": signupForm.password
        }
        api.post('auth/register', payload)
        .then((response) => {
            if (response.status === 201) {
                navigate('/auth/login')
            }
        }).catch((error) => {
            if (error.response && error.status.response) {
                return alert(`${error}`)
            }
            return alert('Something went wrong please try again later')
        })
    }

    const handleGoogleSSo = () => {
        alert("Signing up with google sso")
    }
    // TODO: Make api call to the backend for signup using the signuForm
    return(
        <Container className="w-full min-h-screen bg-green-400 p-5 flex flex-col justify-center items-center">
            <div className="m-auto bg-white w-[335px] md:w-[400px] h-fit flex flex-col gap-4 items-center p-5 rounded-md">
                <form
                    onSubmit={(event) => handleSignup(event)}
                    className="flex flex-col gap-2 w-full"
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
                            onChange={(event) => {
                                handleChange(event)
                                setPasswordMatch(signupForm.password === event.target.value)
                            }}
                            className="outline-emerald-400 w-full p-2 rounded-md border border-green-400 text-slate-500">
                        </input>
                        {
                            !passwordMatch &&
                            <p className="text-red-400 font-bold text-sm italic mt-1 m-auto">**Passwords do not match**</p>
                        }
                    </div>
                    <button
                        className="mt-4 bg-green-400 hover:bg-green-500 w-full rounded-md p-2 text-white font-semibold"
                    >Create account</button>

                </form>
                <p className="text-sm text-green-400">Have an account? <Link className="font-bold" to={'/auth/login'}>Login</Link></p>

                <p>or</p>
                <button
                    onClick={handleGoogleSSo}
                    className="outline outline-1 outline-green-400 hover:bg-green-300 hover:text-slate-100 hover:outline-slate-100 w-full rounded-md p-2 text-green-600 font-semibold"
                >Signup with google</button>
            </div>
        </Container>
    )
}