import { Container, Flex } from "@radix-ui/themes";
import HomeLayout from "./Layouts/HomeLayout";
import "/landing_image.png"
import "/family_hug.png"
import "/cover_eyes.png"
import "/worried_woman.png"

export default function Home() {
    return(
    <HomeLayout>
        <Container className="mt-20">
            <Flex className="min-h-[70vh] justify-between items-end">
                <div className="h-full min-h-[70vh] flex items-center">
                    <div className="max-w-[575px]">
                        <div className="font-bold text-4xl">     
                            <p>
                                Experience seamless communication with friends, family and colleagues. 
                            </p>
                            <p>All here!!</p>
                        </div>
                        <p>
                            Stay connected with real-time messaging that&apos;s fast, secure, and built for your team.
                            Whether you&apos;re collaborating with colleagues or chatting with friends, our app brings everyone closer together
                        </p>
                        <button>Get started now</button>
                    </div>
                </div>
                <img src="landing_image.png" width={399} height={449}></img>
            </Flex>
            <Flex className="bg-green-500 rounded-xl mx-4 pt-8 px-4 items-center justify-center text-white">
                <p className="font-bold max-w-[278px]">Feel your family&apos;s closeness, even when they&apos;re miles away</p>
                <img src="family_hug.png" width={363} height={278}></img>
                <p className="font-bold text-3xl">We make that happen.</p>
            </Flex>
            <Flex className="justify-between items-center my-10 min-h-[60vh]">
                <div className="max-w-[400px]">
                    <p className="font-bold text-2xl">Super fast messaging</p>
                    <p>Experience lightning-fast communication with messages that deliver instantly, no matter where you are. Our app is optimized for real-time conversations, ensuring you're always in sync with your team or friends.</p>
                </div>
                <img src="worried_woman.png" width={437}></img>
            </Flex>
            <Flex className="justify-between items-center my-10 min-h-[60vh]">
                <img src="cover_eyes.png" width={437}></img>
                <div className="max-w-[400px]">
                    <p className="font-bold text-2xl">Do it privately, no peeking.</p>
                    <p>Your privacy is our priority. With end-to-end encryption, every message you send is secure and visible only to you and the recipient—keeping your conversations protected from any third parties</p>
                </div>
            </Flex>
            <div className="w-full flex flex-col justify-center items-center">
                <p className="font-bold text-4xl">You can count on us.</p>
                <p className="max-w-[800px]">Built for dependability, our app ensures that your chats are always available, even in low-connectivity environments. Stay connected and enjoy seamless communication whenever you need it.</p>
            </div>
            
        </Container>
    </HomeLayout>
)
}