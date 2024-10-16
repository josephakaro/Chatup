import { useLocation } from "react-router-dom"
import ChatBrief from "./ChatBrief"
import { useEffect, useMemo, useRef, useState } from "react"
import GroupChatBrief from "./GroupChatBrief"
import { Avatar, Button } from "@radix-ui/themes"
import {ChatWindowMobile} from "../ChatWindow"

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
    return(
        <div className="fixed top-16 left-0 h-[95%] w-[20vw] flex flex-col">
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
                <div>
                    <GroupChatBrief groupName="Webstack group" briefMessage="Wlecoasdasdasds " groupId="JJASDSAD"/>
                    <GroupChatBrief groupName="New group" briefMessage="kasdasdasdsd" groupId="KIAJSDJASD" />
                </div>
            }
            {
                isProfilePage &&
                <div className="flex flex-col gap-4 items-center">
                    {/* TODO: work on profile image chooser */}
                    <p className="font-bold">Edit your profile</p>
                    <div className="cursor-pointer" onClick={() => profilePhotoInputRef.current?.click()}>
                        <Avatar fallback="A" className="w-[100px] h-[100px] rounded-full"></Avatar>
                    </div>
                    <input ref={profilePhotoInputRef} type="file" className="hidden"></input>
                    <fieldset className="flex flex-col">
                        <label>Name</label>
                        <input className="border-2 rounded-md py-1 px-2 focus:outline-green-400"></input>
                    </fieldset>
                    <Button className="cursor-pointer px-10 py-4">Update</Button>
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
                <div>
                    <GroupChatBrief groupName="Webstack group" briefMessage="Wlecoasdasdasds " groupId="JJASDSAD"/>
                    <GroupChatBrief groupName="New group" briefMessage="kasdasdasdsd" groupId="KIAJSDJASD" />
                </div>
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
                        <Avatar fallback="A" className="w-[100px] h-[100px] rounded-full"></Avatar>
                    </div>
                    <input ref={profilePhotoInputRef} type="file" className="hidden"></input>
                    <fieldset className="flex flex-col">
                        <label>Name</label>
                        <input className="border-2 rounded-md py-1 px-2 focus:outline-green-400"></input>
                    </fieldset>
                    <Button className="cursor-pointer px-10 py-4">Update</Button>
                </div>
            }
        </div>
    )
}