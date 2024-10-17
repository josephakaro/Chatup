import { useNavigate, useParams } from "react-router-dom"
import { IoMdSend } from "react-icons/io";
import { Avatar } from "@radix-ui/themes";
import ChatBubble from "./components/ChatBubble";
import { FaArrowLeft } from "react-icons/fa6";

export default function ChatWindow () {
    const {chatId} = useParams< { chatId: string}>()
    const {groupId} = useParams<{ groupId: string}>()
    // TODO: if group get group details same for chat
    return (
        <div className="h-full">
            {
                chatId &&
                <div className="h-full flex flex-col justify-between">
                    <div className="pl-2 bg-gray-50 border flex items-center gap-4 py-2">
                        <Avatar fallback="J" className="rounded-full"/>
                        <p className="font-bold text-lg">Juanita</p>
                    </div>
                    <div className="flex flex-col items-center justify-center mt-6">
                        <ChatBubble  message="Hello Juannita"/>
                    </div>
                    <div className="flex items-center gap-2 mb-8 m-auto">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="border border-gray-500 px-2 bg-gray-50 focus:outline-none w-[700px] rounded-lg h-[50px]"></input>
                            <IoMdSend className="text-3xl cursor-pointer"/>
                    </div>
                </div>
            }
            {
                groupId &&
                <div className="h-full flex flex-col justify-between">
                    <div className="pl-2 bg-gray-50 border flex items-center gap-4 py-2">
                        <Avatar fallback="W" className="rounded-full"/>
                        <p className="font-bold text-lg">Webstack group</p>
                    </div>
                    <div className="flex flex-col gap-2 items-center justify-center mt-6">
                        <ChatBubble  message="Hello Group"/>
                        <ChatBubble  message="Welcome to your new group"/>
                    </div>
                    <div className="flex items-center gap-2 mb-8 m-auto">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="border border-gray-500 px-2 bg-gray-50 focus:outline-none w-[700px] rounded-lg h-[50px]"></input>
                            <IoMdSend className="text-3xl cursor-pointer"/>
                    </div>
                </div>
            }
        </div>
    )
}


export function ChatWindowMobile () {
    const {chatId} = useParams< { chatId: string}>()
    const {groupId} = useParams<{ groupId: string}>()
    const navigate = useNavigate()
    // TODO: if group get group details same for chat
    return (
            <div className="h-[88vh]">
                {
                    chatId &&
                    <div className="h-full flex flex-col justify-between">
                        <div className="pl-2 bg-gray-50 border flex items-center gap-4 py-2">
                            <FaArrowLeft onClick={() => navigate(-1)}/>
                            <Avatar fallback="J" className="rounded-full"/>
                            <p className="font-bold text-lg">Juanita</p>
                        </div>
                        <div className="flex flex-col items-center justify-center mt-6">
                            <ChatBubble  message="Hello Juannita"/>
                        </div>
                        <div className="flex items-center gap-2 mb-8 m-auto">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="border border-gray-500 px-2 bg-gray-50 focus:outline-none w-[300px] rounded-lg h-[50px]"></input>
                                <IoMdSend className="text-3xl cursor-pointer"/>
                        </div>
                    </div>
                }
                {
                    groupId &&
                    <div className="h-full flex flex-col justify-between">
                        <div className="pl-2 bg-gray-50 border flex items-center gap-4 py-2">
                            <FaArrowLeft onClick={() => navigate(-1)}/>
                            <Avatar fallback="W" className="rounded-full"/>
                            <p className="font-bold text-lg">Webstack group</p>
                        </div>
                        <div className="flex flex-col gap-2 items-center justify-center mt-6">
                            <ChatBubble  message="Hello Group"/>
                            <ChatBubble  message="Welcome to your new group"/>
                        </div>
                        <div className="flex items-center gap-2 mb-8 m-auto">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="border border-gray-500 px-2 bg-gray-50 focus:outline-none w-[300px] rounded-lg h-[50px]"></input>
                                <IoMdSend className="text-3xl cursor-pointer"/>
                        </div>
                    </div>
                }
            </div>
    )
}