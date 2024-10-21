import { Avatar } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

export default function ChatBrief({name, briefMessage, chatId}: {name: string, briefMessage: string, chatId: string}) {
    const navigate = useNavigate()
    return(
        <div onClick={() => navigate(`/app/chats/${chatId}`)} className="cursor-pointer hover:bg-green-200 py-2 px-2">
            <div className="flex items-center gap-2">
                <Avatar className="rounded-full" fallback={name[0]}/>
                <div>
                    <p className="font-bold text-ellipsis">{name}</p>
                    <p>{briefMessage}</p>
                </div>
            </div>
        </div>
    )
}