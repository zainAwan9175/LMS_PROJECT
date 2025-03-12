'use client'
import React, { FC, useState } from 'react';
import Image from "next/image";
import avatardefault from "../../../public/assests/avatardefault.jpeg";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { BiLogOutCircle } from "react-icons/bi";

import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Link from "next/link";
type Props={
    user:any,
    active:number,
    avatar:string |null,
    setActive:(active:number)=>void
    logOutHandler:()=>void
}
const SideBarProfile:FC<Props> = ({user,active,avatar,setActive,logOutHandler}) => {
  return (
    
    <div className="w-full">
    <div
      className={`w-full flex items-center px-3 py-4 cursor-pointer ${
        active === 1 ? "dark:bg-slate-800 bg-gray-200" : "bg-transparent"
      }`}
      onClick={() => setActive(1)}
    >
      <Image
        src={user.avatar || avatar ? user.avatar.url : avatardefault}
        alt=""
        width={20}
        height={20}
        className="w-[30px] h-[30px] rounded-full cursor-pointer"
      />
      <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
        My Account
      </h5>
    </div>

    <div
      className={`w-full flex items-center px-3 py-4 cursor-pointer ${
        active === 2 ? "dark:bg-slate-800 bg-gray-200" : "bg-transparent"
      }`}
      onClick={() => setActive(2)}
    >
      <RiLockPasswordLine size={20} className="dark:text-white text-black" />
      <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
        Change Password
      </h5>
    </div>
    <div
      className={`w-full flex items-center px-3 py-4 cursor-pointer ${
        active === 3 ? "dark:bg-slate-800 bg-gray-200" : "bg-transparent"
      }`}
      onClick={() => setActive(3)}
    >
      <SiCoursera size={20} className="dark:text-white text-black" />
      <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
        Enrolled Courses
      </h5>
    </div>



       <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 4 ? "dark:bg-slate-800 bg-gray-200" : "bg-transparent"
        }`}
        onClick={() => logOutHandler()}
      >
        <BiLogOutCircle size={20} className="dark:text-white text-black" />
        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          Logout
        </h5>
      </div>

      {user.role === "admin" && (
  <Link
  href={"/admin"}
    className={`w-full flex items-center px-3 py-4 cursor-pointer ${
      active === 5 ? "dark:bg-slate-800 bg-gray-200" : "bg-transparent"
    }`}
  >
    <MdOutlineAdminPanelSettings size={20} className="dark:text-white text-black" />
    <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
      Admin Dashboard
    </h5>
  </Link>
)}
      


    </div>
      
  )
}

export default SideBarProfile