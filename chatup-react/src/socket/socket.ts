import { io } from "socket.io-client"

const token = localStorage.getItem('token')
const socket = io(import.meta.env.VITE_WS_URL, {
  auth: {
    token: token ? token : null,
  },
})

export default socket
