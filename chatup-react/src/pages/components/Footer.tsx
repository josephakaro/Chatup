import { FaTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io";



export default function Footer() {
    return(
        <div className="bg-green-500 mx-8 my-8 rounded-lg py-4 px-4 text-white">
            <div className="flex gap-10 justify-center py-4 border-b-[1px]">
                <div>
                    <p className="font-bold text-3xl">Chatup</p>
                </div>
                <div>
                    <p className="font-bold text-2xl">Platform</p>
                    <p>About</p>
                    <p>Contact</p>
                    <p>Get started</p>
                    <p>Login</p>
                </div>
                <div>
                    <p className="font-bold text-2xl">Legal</p>
                    <p>Cookie-policy</p>
                    <p>Privacy policy</p>
                </div>
            </div>
            <div className="flex justify-center gap-4 my-8 text-3xl">
                <FaTwitter/>
                <FaFacebookF />
                <FaLinkedinIn />
                <FaYoutube />
                <IoLogoInstagram />
            </div>
        </div>
    )
}