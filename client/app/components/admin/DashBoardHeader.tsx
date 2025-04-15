"use client"

import { type FC, useEffect, useState, useCallback } from "react"
import { IoMdNotificationsOutline } from "react-icons/io"
import { format } from "timeago.js"
import socketIO from "socket.io-client"
import { useGetAllnotificationsQuery,useUpdateNotificationStatusMutation } from "@/redux/features/notifications/notificationsApi"
 import ThemeSwitcher from "../../../app/utils/ThemeSwitcher"

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || ""
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] })

type Props = {
  open?: boolean
  setOpen?: (open: boolean) => void
}

const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  const [notifications, setNotifications] = useState<any[]>([])
  const { data, refetch } = useGetAllnotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const [updateNotificationStatus] = useUpdateNotificationStatusMutation()
  // const [audio] = useState<HTMLAudioElement | null>(() =>
  //   typeof window !== "undefined" ? new Audio("/path/to/notification-sound.mp3") : null,
  // )

  // const playNotificationSound = useCallback(() => {
  //   audio?.play().catch((error) => console.error("Failed to play notification sound:", error))
  // }, [audio])

  const [audio] = useState(
    new Audio(
      "https://res.cloudinary.com/do1vxto50/video/upload/v1744145229/notification-18-270129_zswijs.mp3"
    )
  );
  
  const playNotificationSound = () => {
    audio.play();
  };
  



  useEffect(() => {
    if (data) {
      setNotifications(data.notifications.filter((item: any) => item.status === "unread"))
    }
  }, [data])

  useEffect(() => {
    const handleNotification = (data: any) => {
      refetch();
      playNotificationSound();
    };
  
    socketId.on("newNotification", handleNotification);
  
    return () => {
      socketId.off("newNotification", handleNotification); // cleanup
    };
  }, [refetch, playNotificationSound]); // important dependencies
  
  

  const handleNotificationStatusChange = async (id: string) => {
    try {
      await updateNotificationStatus(id).unwrap()
      refetch()
      audio.play();
    } catch (error) {
      console.error("Failed to update notification status:", error)
    }
  }
// const notifications = [
//     {
//       _id: "1",
//       title: "New Message",
//       message: "You have received a new message from John Doe.",
//       createdAt: new Date().toISOString(),
//     },
//     {
//       _id: "2",
//       title: "System Update",
//       message: "A new system update is available. Click here to update.",
//       createdAt: new Date().toISOString(),
//     },
//     {
//       _id: "3",
//       title: "Reminder",
//       message: "Your meeting with the team starts in 30 minutes.",
//       createdAt: new Date().toISOString(),
//     },
//     {
//       _id: "4",
//       title: "New Comment",
//       message: "Alice commented on your post: 'Great work!'",
//       createdAt: new Date().toISOString(),
//     },
//   ];
  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0 z-[9999999]">
      <ThemeSwitcher />
      <div className="relative cursor-pointer m-2" onClick={() => setOpen?.(!open)}>
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
          {notifications.length}
        </span>
      </div>
      {open && (
        <div className="w-[350px] h-[60vh] overflow-y-scroll py-3 px-2 border border-[#ffffff0c] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 z-[1000000000] rounded">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">Notifications</h5>
          {notifications.map((item: any, index: number) => (
            <div
              className="dark:bg-[#2d3a4e] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f]"
              key={item._id || index}
            >
              <div className="w-full flex items-center justify-between p-2">
                <p className="text-black dark:text-white">{item.title}</p>
                <p
                  className="text-black dark:text-white cursor-pointer"
                  onClick={() => handleNotificationStatusChange(item._id)}
                >
                  Mark as read
                </p>
              </div>
              <p className="px-2 text-black dark:text-white">{item.message}</p>
              <p className="p-2 text-black dark:text-white text-[14px]">{format(item.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardHeader