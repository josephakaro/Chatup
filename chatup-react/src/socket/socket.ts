import { io, Socket } from "socket.io-client"

let socket: Socket | undefined;

export const initSocket = (token: string | null): Socket | undefined => {
  if (!socket && token) {
    socket = io(import.meta.env.VITE_WS_URL, {
      auth: {
        token,
      },
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = undefined;
  }
}