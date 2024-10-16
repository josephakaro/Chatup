import { Avatar } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

export default function GroupChatBrief({groupName, briefMessage, groupId}: {groupName: string, briefMessage: string, groupId: string}) {
    const navigate = useNavigate()
    return(
        <div onClick={() => navigate(`/app/groups/${groupId}`)} className="cursor-pointer hover:bg-green-200 py-2 px-2">
            <div className="flex items-center gap-2">
                <Avatar className="rounded-full" fallback={groupName[0]}/>
                <div>
                    <p className="font-bold text-ellipsis">{groupName}</p>
                    <p>{briefMessage}</p>
                </div>
            </div>
        </div>
    )
}