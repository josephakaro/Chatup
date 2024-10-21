import { useNavigate, useParams } from "react-router-dom"
import { IoMdSend } from "react-icons/io";
import { Avatar } from "@radix-ui/themes";
import ChatBubble from "./components/ChatBubble";
import { FaArrowLeft } from "react-icons/fa6";
import { api } from "../lib/requestHandler";
import { useEffect, useState } from "react";
import { initSocket } from "../socket/socket";

type PrivateMessage = {
    recipientId: string | null,
    content: string
}

type Message = {
    id: string,
    content: string,
    recipientId: string,
    senderId: string
}
type GroupMessage = {
    id: string,
    content: string,
    groupId: string,
    senderId: string
}
type GroupMessageForm = {
    groupId: string | null,
    content: string
}
type User = {
    name: string,
    email: string,
    id: string
}
type Group = {
    id: string
    name: string,
    members: User[]
}

const token = localStorage.getItem('token')
const userId = localStorage.getItem('user_id')
const socket = initSocket(JSON.parse(token))
export default function ChatWindow () {
    const {chatId} = useParams<{ chatId: string}>()
    const {groupId} = useParams<{ groupId: string}>()
    const [privateMessage, setPrivateMessage] = useState<PrivateMessage>({recipientId: null, content: ""})
    const [messages, setMessages] = useState<Message[]>([])
    const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([])
    const [groupMessageForm, setGroupMessageForm] = useState<GroupMessageForm>({groupId: null, content: ""})
    const [users, setUsers]= useState<User[]>([])
    const [groupDetails, setGroupDetails] = useState<Group | null>(null)
    // TODO: if group get group details same for chat

    const sendMessage = () => {
        api.post(`messages/private`, privateMessage, { headers: 
            {
                "Authorization": `Bearer ${token ? JSON.parse(token) : null}`
            }
        }).then((response) => {
            if (response.status === 201) {
                alert("Message sent successfully")
            }
        }).catch(() => {
            alert("Error sending message")
        })
    }

    const sendGroupMessage = () => {
        api.post(`messages/group`, groupMessageForm, {
            headers:{
                "Authorization": `Bearer ${token ? JSON.parse(token) : null}`
            }
        }).then(response => {
            if (response.status === 201) {
                alert("message sent successfully")
            }
        }).catch(() => {
            alert("There was an error sending group message")
        })
    }


    useEffect(() => {
        // do not make call if there is no chatId
        if (!chatId) return;

        api.get(`messages/private/${chatId}`, {
            headers: {
                "Authorization": `Bearer ${token ? JSON.parse(token) : null}`
            }
        }).then((response) => {
            setMessages(response.data.messages)
        }).catch(() => {
            alert("An error occured please check back later")
        })

        // Get all users for usernames
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
    }, [chatId])

    useEffect(() => {
        if (!groupId || groupId === undefined) return

        api.get(`messages/group/${groupId}`, {
            headers: {
                "Authorization": `Bearer ${token ? JSON.parse(token) : null}` 
            }
        }).then(response => {
            setGroupMessages(response.data.messages)
        }).catch(() => {
            alert("There was an error loading messages")
        })

        // get group DEtails
        api.get(`groups/${groupId}`, {
            headers: {
                "Authorization": `Bearer ${token ? JSON.parse(token) : null}`
            }
        }).then(response => {
            if (response.status ===  200) {
                setGroupDetails(response.data.group)
            }
        }).catch(() => {
            alert("There was an error loading group details")
        })
    }, [groupId])

    useEffect(() => {
        socket?.on("receiveMessage", (message: Message) => {
        console.log(`You have a new message ${message}`)
        })
    }, [])

    const getUserName =(chatId: string) => {
        const user = users.find(user => user.id === chatId)
        return user ? user.name : null;
    }

    return (
        <div className="h-full">
            {
                chatId &&
                <div className="h-full flex flex-col justify-between">
                    <div className="pl-2 bg-gray-50 border flex items-center gap-4 py-2">
                        <Avatar fallback="J" className="rounded-full"/>
                        <p className="font-bold text-lg">{getUserName(chatId)}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center mt-6 gap-2">
                    {
                        messages.filter(message => message.recipientId === chatId || message.senderId === chatId).reverse().map((message) => (
                            <ChatBubble key={message.id} message={message.content} byUser={JSON.stringify(message.senderId) === userId}/>
                        ))
                    }
                    </div>
                    <div className="flex items-center gap-2 mb-8 m-auto">
                        <input
                            type="text"
                            name="message"
                            onChange={(event) => setPrivateMessage({...privateMessage, content: event.target.value, recipientId: chatId})}
                            placeholder="Type a message..."
                            className="border border-gray-500 px-2 bg-gray-50 focus:outline-none w-[700px] rounded-lg h-[50px]"></input>
                            <IoMdSend onClick={sendMessage} className="text-3xl cursor-pointer"/>
                    </div>
                </div>
            }
            {
                groupId &&
                <div className="h-full flex flex-col justify-between">
                    {
                        groupDetails &&
                        <div className="pl-2 bg-gray-50 border py-2">
                            <div className="flex gap-2 items-center">
                                <Avatar fallback={groupDetails.name[0]} className="rounded-full"/>
                                <p className="font-bold text-lg">{groupDetails.name}</p>
                            </div>
                            <p>Members: {groupDetails.members.length}</p>
                        </div>
                    }
                    <div className="flex flex-col gap-2 items-center justify-center mt-6">
                        {
                            groupMessages.reverse().map((message) => (
                                <ChatBubble key={message.id} message={message.content} byUser={JSON.stringify(message.senderId) === userId} senderId={message.senderId}/>
                            ))
                        }
                    </div>
                    <div className="flex items-center gap-2 mb-8 m-auto">
                        <input
                            type="text"
                            name="content"
                            onChange={(event) => setGroupMessageForm({...groupMessageForm, groupId: groupId, content: event.target.value}) }
                            placeholder="Type a message..."
                            className="border border-gray-500 px-2 bg-gray-50 focus:outline-none w-[700px] rounded-lg h-[50px]"></input>
                            <IoMdSend onClick={sendGroupMessage} className="text-3xl cursor-pointer"/>
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