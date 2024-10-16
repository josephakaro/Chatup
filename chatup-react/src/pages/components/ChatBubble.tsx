export default function ChatBubble({message} : {message: string}) {
    return(
        <div className="bg-green-300 p-2 rounded-md">
            {message}
        </div>
    )
}