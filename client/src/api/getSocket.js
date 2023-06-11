import { io } from "socket.io-client";

export default function getSocket() {
  const socket = io("http://localhost:8000", {
    transports: ["websocket"],
    upgrade: true,
    withCredentials: true,
  });
  return socket;
}
