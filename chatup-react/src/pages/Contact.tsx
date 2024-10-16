import { Container } from "@radix-ui/themes";
import HomeLayout from "./Layouts/HomeLayout";

export default function Contact() {
    return(
        <HomeLayout>
            <Container className="mt-20">
                <p className="font-bold text-3xl text-center">Contact us</p>
            </Container>
        </HomeLayout>
    )
}