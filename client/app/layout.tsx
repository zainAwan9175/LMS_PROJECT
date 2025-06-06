'use client'
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./Provider";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Loader from "./components/Loader/Loader";
import socketIO from "socket.io-client"
const ENDPOINT=process.env.NEXT_PUBLIC_SOCKET_SERVER_URI||"";
const socketId=socketIO(ENDPOINT,{transports:["websocket"]})
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    //!bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} !bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300`}
      >
      <Providers>
        <SessionProvider>
        <ThemeProvider attribute="class">
        <Toaster position="top-center" reverseOrder={false} />  {/* ✅ Add this line */}
        <Custom>{children}</Custom>
          </ThemeProvider>
        </SessionProvider>

      </Providers>
      </body>
    </html>
  );
}



const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoadUserQuery({});
  useEffect(()=>{
    socketId.on("connection",()=>{})
  },[])

  return (
    <>
      {isLoading ? <Loader /> : <>{children}</>}
    </>
  );
};

