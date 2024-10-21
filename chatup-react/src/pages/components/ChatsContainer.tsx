import { useLocation } from "react-router-dom"
import ChatBrief from "./ChatBrief"
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import GroupChatBrief from "./GroupChatBrief"
import { Avatar, Button } from "@radix-ui/themes"
import {ChatWindowMobile} from "../ChatWindow"
import { api } from "../../lib/requestHandler"
import AddGroupPopup from "./PopupDialogs"

type Profile = {
    name: string,
    email: string,
    avatar: string
}
type User = {
    name: string,
    email: string,
    id: string
}

type Group = {
    name: string,
    id: string
}

const userId = localStorage.getItem('user_id')
/**
 * Desktop version of the containing element of the chats
 * @returns DOM element
 */
export default function ChatsContainer() {
    const location = useLocation()
    const [isChatPage, setIsChatPage] = useState<boolean>(false)
    const [isGroupPage, setIsGroupPage] = useState<boolean>(false)
    const [isProfilePage, setIsProfilePage] = useState<boolean>(false)
    useEffect(() => {
        setIsChatPage(location.pathname.includes('/app/chats'))
        setIsGroupPage(location.pathname.includes('/app/groups'))
        setIsProfilePage(location.pathname.includes('/app/profile'))
    }, [location])
    const profilePhotoInputRef = useRef<HTMLInputElement>(null)
    const [profile, setProfile] = useState<Profile>({name: "", email: "", avatar: ""})
    const [profileUpdate, setProfileUpdate] = useState({})
    const [users, setUsers]= useState<User[]>([])
    const [groups, setGroups] = useState<Group[]>([])
    const [allGroups, setAllGroups] = useState<Group[]>([])
    
    const token = localStorage.getItem('token')

    const handleProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setProfileUpdate({...profileUpdate, [event.target.name] : event.target.value})
    }

    useEffect(() => {
        // TODO: Make all these api requests in one promise
        // Get all private messages

        // Get user profile
        api.get('users/profile', {
            headers : {
                "Authorization": `Bearer ${token ? JSON.parse(token) : null}`
            }
        })
        .then((response) => {
            setProfile(response.data.user)
        })

        // Get all users
        api.get('users/all', {
            headers: {
                "Authorization": `Bearer ${token ? JSON.parse(token) : null}`
            }
        }).then((response) => {
            if (response.status === 200) {
                setUsers(response.data.users)
            }
        }).catch(() => {
            alert("An error occured while fetching users")
        })

        //   Get all groups
        api.get('groups/all', {
            headers: {
                "Authorization": `Bearer ${token ? JSON.parse(token) : null}`
            }
        }).then((response) => {
            setAllGroups(response.data.groups)
        }).catch(() => {
            alert("AN error occured while fetching groups")
        })
        // Get all groups a user is part of

        api.get(`groups/usergroups/${userId && JSON.parse(userId)}`, {
            headers: {
                "Authorization": `Bearer ${token ? JSON.parse(token) : null}`
            }
        }).then((response) => {
            if (response.status === 200) {
                setGroups(response.data.groups)
            }
        }).catch(() => {
            alert("An error occurred while fetching user groups")
        })
    }, [token])

    const updateProfile = () => {
        api.put('users/profile', profileUpdate, {
            headers: {
                "Authorization": `Bearer ${token ? JSON.parse(token) : null}`
            }
        }).then((response) => {
            setProfile(response.data.user)
        }).catch(() => {
            return alert("There was an error while processing your request please try again later")
        })
    }


    return(
        <div className="fixed top-16 left-0 h-[95%] w-[20vw] flex flex-col">
            {
                isChatPage &&
                <>
                {
                    users.map(user => (
                        <ChatBrief key={user.id} name={user.name} briefMessage="...." chatId={user.id}/>
                    ))
                }
                </>
                
            }
            {
                isGroupPage &&
                <>
                    <AddGroupPopup />
                    <div>
                        <p className="font-bold text-center">Your groups</p>
                        {
                            groups.map(group => (
                                <GroupChatBrief key={group.id} groupName={group.name} briefMessage="..." groupId={group.id}/>
                            ))
                        }
                        <p className="font-bold text-center">Other groups you can join</p>
                    </div>
                </>
            }
            {
                isProfilePage &&
                <div className="flex flex-col gap-4 items-center">
                    {/* TODO: work on profile image chooser */}
                    <p className="font-bold">Edit your profile</p>
                    <div className="cursor-pointer" onClick={() => profilePhotoInputRef.current?.click()}>
                        <Avatar src={profile.avatar} fallback="A" className="w-[100px] h-[100px] rounded-full"></Avatar>
                    </div>
                    <input ref={profilePhotoInputRef} onChange={handleProfileChange} name="avatar" type="file" className="hidden"></input>
                    <p>{profile.email}</p>
                    <fieldset className="flex flex-col">
                        <label>Name</label>
                        <input name="name" defaultValue={profile.name} onChange={handleProfileChange} className="border-2 rounded-md py-1 px-2 focus:outline-green-400"></input>
                    </fieldset>
                    <Button onClick={updateProfile} className="cursor-pointer px-10 py-4">Update</Button>
                </div>
            }
        </div>
    )
}

/**
 * Mobile version of the chats containing element
 * @returns DOM element
 */
export function ChatsContainerMobile() {
    // Have an outlet for mobile
    const location = useLocation()
    const profilePhotoInputRef = useRef<HTMLInputElement>(null)
    const [isChatPage, setIsChatPage] = useState<boolean>(false)
    const [isGroupPage, setIsGroupPage] = useState<boolean>(false)
    const [isProfilePage, setIsProfilePage] = useState<boolean>(false)
    const [isChatWindow, setIsChatWindow] = useState<boolean>(false)
    const chatWindowRe = useMemo(() => /^\/app\/(chats|groups)\/[a-zA-Z0-9]+$/, [])

    const [profile, setProfile] = useState<Profile>({name: "", email: "", avatar: ""})
    const [profileUpdate, setProfileUpdate] = useState({})
    
    const token = localStorage.getItem('token')

    const handleProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setProfileUpdate({...profileUpdate, [event.target.name] : event.target.value})
    }

    const updateProfile = () => {
        api.put('users/profile', profileUpdate, {
            headers: {
                "Authorization": `Bearer ${token ? JSON.parse(token) : null}`
            }
        }).then((response) => {
            setProfile(response.data.user)
        }).catch(() => {
            return alert("There was an error while processing your request please try again later")
        })
    }

    useEffect(() => {
        api.get('users/profile', {
            headers : {
                "Authorization": `Bearer ${token ? JSON.parse(token) : null}`
            }
        })
        .then((response) => {
            setProfile(response.data.user)
        })
    }
    ,[token])

    useEffect(() => {
        setIsChatPage(location.pathname === '/app/chats')
        setIsGroupPage(location.pathname === '/app/groups')
        setIsProfilePage(location.pathname === '/app/profile')
        setIsChatWindow(chatWindowRe.test(location.pathname))
    }, [location, chatWindowRe])
    // Getting the individual chats from path params
    return(
        <div>
            <div className="bg-green-400 h-[40px] flex items-center">
                <p className="text-white font-bold px-4">ChatUp</p>
            </div>
            {
                isChatPage &&
                <>
                    <ChatBrief name="Webstack group" briefMessage="Welcome to the chat brief" chatId="GHASDASD"/>
                    <ChatBrief name="Juanita" briefMessage="Hello Martin" chatId="GHASDASD"/>
                    <ChatBrief name="School group" briefMessage="This is a test message" chatId="GHASDASD"/>
                    <ChatBrief name="Joseph" briefMessage="Nothing happened yesterday" chatId="GHASDASD"/>
                    <ChatBrief name="Michael" briefMessage="Welcome to the chat brief" chatId="GHASDASD"/>
                    <ChatBrief name="Webstack group" briefMessage="Welcome to the chat brief" chatId="GHASDASD"/>
                </> 
            }
            {
                isGroupPage &&
                <>
                    <AddGroupPopup />
                    <div>
                        <GroupChatBrief groupName="Webstack group" briefMessage="Wlecoasdasdasds " groupId="JJASDSAD"/>
                        <GroupChatBrief groupName="New group" briefMessage="kasdasdasdsd" groupId="KIAJSDJASD" />
                    </div>
                </>
            }
            {
                isChatWindow &&
                <ChatWindowMobile />
            }
            {
                isProfilePage &&
                <div className="flex flex-col gap-4 items-center">
                    {/* TODO: work on profile image chooser */}
                    <p className="font-bold">Edit your profile</p>
                    <div className="cursor-pointer" onClick={() => profilePhotoInputRef.current?.click()}>
                        <Avatar src={profile.avatar} fallback="A" className="w-[100px] h-[100px] rounded-full"></Avatar>
                    </div>
                    <input name="avatar" onChange={handleProfileChange} ref={profilePhotoInputRef} type="file" className="hidden"></input>
                    <p>{profile.email}</p>
                    <fieldset className="flex flex-col">
                        <label>Name</label>
                        <input name="name" onChange={handleProfileChange} defaultValue={profile.name} className="border-2 rounded-md py-1 px-2 focus:outline-green-400"></input>
                    </fieldset>
                    <Button onClick={updateProfile} className="cursor-pointer px-10 py-4">Update</Button>
                </div>
            }
        </div>
    )
}