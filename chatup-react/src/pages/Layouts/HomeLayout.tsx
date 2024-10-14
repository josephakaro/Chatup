import { ReactNode } from "react";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";

export default function HomeLayout({children} : {children: ReactNode}) {
    return(
        <div>
            <TopBar />
            {children}
            <Footer />
        </div>
    )
}