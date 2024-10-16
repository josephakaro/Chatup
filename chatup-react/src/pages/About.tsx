import { Container } from "@radix-ui/themes";
import HomeLayout from "./Layouts/HomeLayout";

export default function About() {
    return(
        <HomeLayout>
            <Container className="mt-20 mx-auto">
                <p className="font-bold text-3xl text-center">About us</p>
            </Container>
        </HomeLayout>
    )
}