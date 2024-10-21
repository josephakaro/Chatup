export default function ChatBubble({message, byUser, senderId} : {message: string, byUser: boolean, senderId?: string}) {

    return(
        <div className={`${byUser ? "bg-blue-300" : "bg-green-300"} p-2 rounded-md`}>
            <p className="text-sm italic font-bold">{senderId}</p>
            {message}
        </div>
    )
}