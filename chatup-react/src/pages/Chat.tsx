import { Container } from "@radix-ui/themes"
import { useEffect, useState } from "react"
import socket from "../socket/socket"

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [recipientId, setRecipientId] = useState([])
  const [groupId, setGroupId] = useState([])
  const [fatchMessage, setFatchMessage] = useState([])

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/messages/private/670a6847fe5941ae1f02a726?page=5&limit=10`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        )

        const data = await response.json()

        if (response.ok) {
          setFatchMessage(data.messages)

          console.log(data)
        }
      } catch (error) {
        console.error("Something went wrong. Please try again.")
      }
    }

    getMessages()
  }, [recipientId])

  useEffect(() => {
    // receive messages
    socket.on("receiveMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data])
    })

    // typing event

    socket.on("typing", (data) => {
      console.log(`${data.userId} is typing...`)
    })

    // cleanup events
    return () => {
      socket.off("receiveMessage")
      socket.off("typing")
    }
  }, [])

  const sendMessage = (type) => {
    const data = {
      type,
      recipientId,
      groupId,
      message: message,
    }

    // send message
    socket.emit("sendMessage", data)
    setMessage("")
  }

  // Handle Messages type
  const handlePrivateMessage = () => {
    sendMessage("private")
  }

  const handleGroupMessage = () => {
    sendMessage("group")
  }

  // Handle type event
  const handleTyping = () => {
    socket.emit("typing", {
      type: recipientId ? "private" : "group",
      recipientId,
      groupId,
    })
  }

  return (
    <Container className="w-screen h-screen flex flex-col justify-between items-center bg-green-400 p-5">
      <p>Type your message here</p>
    </Container>
  )
}
