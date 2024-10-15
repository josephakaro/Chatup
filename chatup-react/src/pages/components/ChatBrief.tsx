import { Avatar } from "@radix-ui/themes";

export default function ChatBrief({name, briefMessage}: {name: string, briefMessage: string}) {
    return(
        <div className="cursor-pointer hover:bg-green-200 py-2 px-2">
            <div className="flex items-center gap-2">
                <Avatar className="rounded-full" fallback="A"/>
                <div>
                    <p className="font-bold text-ellipsis">{name}</p>
                    <p>{briefMessage}</p>
                </div>
            </div>
        </div>
    )
}