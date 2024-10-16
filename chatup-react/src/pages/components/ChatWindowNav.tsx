import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { GrGroup } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { NavLink } from "react-router-dom";


export default function ChatWindowNav() {
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
        </div>
    )
}