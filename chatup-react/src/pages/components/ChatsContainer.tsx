import ChatBrief from "./ChatBrief"

/**
 * Desktop version of the containing element of the chats
 * @returns DOM element
 */
export default function ChatsContainer() {
    return(
        <div className="fixed top-16 left-0 h-[95%] w-[20vw] flex flex-col">
            <ChatBrief name="Webstack group" briefMessage="Welcome to the chat brief"/>
            <ChatBrief name="Juanita" briefMessage="Hello Martin"/>
            <ChatBrief name="School group" briefMessage="This is a test message"/>
            <ChatBrief name="Joseph" briefMessage="Nothing happened yesterday"/>
            <ChatBrief name="Michael" briefMessage="Welcome to the chat brief"/>
            <ChatBrief name="Webstack group" briefMessage="Welcome to the chat brief"/>
        </div>
    )
}

/**
 * Mobile version of the chats containing element
 * @returns DOM element
 */
export function ChatsContainerMobile() {
    // Have an outlet for mobile
    return(
        <div>
            {/* use different chat briefs for mobile */}
            <ChatBrief name="Webstack group" briefMessage="Welcome to the chat brief"/>
            <ChatBrief name="Juanita" briefMessage="Hello Martin"/>
            <ChatBrief name="School group" briefMessage="This is a test message"/>
            <ChatBrief name="Joseph" briefMessage="Nothing happened yesterday"/>
            <ChatBrief name="Michael" briefMessage="Welcome to the chat brief"/>
            <ChatBrief name="Webstack group" briefMessage="Welcome to the chat brief"/>
        </div>
    )
}