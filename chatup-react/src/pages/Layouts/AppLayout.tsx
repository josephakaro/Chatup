import { Container } from "@radix-ui/themes";
import { ReactNode } from "react";
import ChatWindowNav from "../components/ChatWindowNav";
import ChatsContainer, { ChatsContainerMobile } from "../components/ChatsContainer";

export default function AppLayout({children}: {children: ReactNode}) {
    return(
        <Container>
            <ChatWindowNav />
            {/* Desktop layout */}
            <div className="hidden md:block">
                <ChatsContainer />
                {/* div for chat window and or profile section */}
                <div className="fixed right-0 h-full w-[80vw] border-2 ">
                    {children}
                </div>
            </div>

            {/* Mobile version */}
            <div className="md:hidden">
                <ChatsContainerMobile />
            </div>
        </Container>
    )
}