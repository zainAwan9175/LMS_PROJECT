// utils/socket.ts
import { io } from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socket = io(ENDPOINT, {
  transports: ["websocket"],
  autoConnect: false, // connect manually
});

export default socket;
