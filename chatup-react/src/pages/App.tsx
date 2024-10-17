import AppLayout from "./Layouts/AppLayout";
import { useEffect } from "react";
import {initSocket} from "../socket/socket";

export default function App() {
    const token = localStorage.getItem('token')

    useEffect(() => {
        if (token !== null) {
          // Connect to WebSocket and set up listeners
          const socket = initSocket(JSON.parse(token))
          socket.on("receiveMessage", (data) => {
            console.log("Received message:", data);
          });
    
          // Optionally handle connect event
          socket.on("connect", () => {
            console.log("WebSocket connected");
          });
    
          socket.on("disconnect", () => {
            console.log("WebSocket disconnected");
          });
    
          // Cleanup the socket when component unmounts
          return () => {
            socket.off("receiveMessage");
            socket.off("connect");
            socket.off("disconnect");
          };
        }
      }, [token]); 
    return(
        <AppLayout>
        </AppLayout>
    )
}