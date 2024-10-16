import { io } from "socket.io-client"

const socket = io("http://localhost:5000", {
  auth: {
    token: sessionStorage.getItem("token"),
  },
})

export default socket
