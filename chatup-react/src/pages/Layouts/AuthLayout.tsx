import { Container } from "@radix-ui/themes";
import { ReactNode } from "react";

export default function AuthLayout({children} : {children: ReactNode}) {
    return(
        <Container>
            {children}
        </Container>
    )
}