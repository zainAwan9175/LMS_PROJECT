import { Server as SocketIOServer } from "socket.io"
import type http from "http"

export const initSocketServe = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", // In production, specify your frontend domain
      methods: ["GET", "POST"],
    },
  })

  io.on("connection", (socket) => {
    console.log("A user connected with ID:", socket.id)

    // Listen for "notification" event from the frontend
    socket.on("notification", (data) => {
      console.log("Notification received:", data)

      // Broadcast to ALL connected clients, not just the sender
      io.emit("newNotification", data)
    })

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id)
    })
  })

  console.log("Socket.IO server initialized")
}