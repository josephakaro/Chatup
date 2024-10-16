import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { GrGroup } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { NavLink, useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { api } from "../../lib/requestHandler";


export default function ChatWindowNav() {
    const navigate = useNavigate()
    const handleLogout = () => {
        const token = localStorage.getItem('token')
        api.post('auth/logout', {}, {
            headers : {
                'Authorization': `Bearer ${token ? JSON.parse(token) : null}`
            }
        })
        .then((response) => {
            if (response.status === 200) {
                localStorage.removeItem('token')
                return navigate('/')
            }
        }).catch(() => {
            return alert('An error occurred. Please try again later')
        })
    }
    return(
        <div className="fixed left-0 bottom-0 md:top-0 border-t-2 bg-white flex gap-4 justify-evenly px-6 py-2 w-full md:w-[20vw] h-fit border-b">
            <NavLink to={'/app/chats'} className={({isActive}) => `${isActive && "text-green-700 font-bold"} flex flex-col items-center`}>
                <IoChatbubbleEllipsesOutline className="text-2xl"/>
                <p className="text-sm">Chats</p>
            </NavLink>
            <NavLink to={'/app/groups'} className={({isActive}) => `${isActive && "text-green-700 font-bold"} flex flex-col items-center`}>
                <GrGroup className="text-2xl"/>
                <p className="text-sm">Groups</p>
            </NavLink>
            <NavLink to={'/app/profile'} className={({isActive}) => `${isActive && "text-green-700 font-bold"} flex flex-col items-center`}>
                <CgProfile className="text-2xl"/>
                <p className="text-sm">Profile</p>
            </NavLink>
            <div>
                <TbLogout2
                    onClick={() => handleLogout()}
                    className="text-3xl text-red-400 cursor-pointer"/>
            </div>
        </div>
    )
}