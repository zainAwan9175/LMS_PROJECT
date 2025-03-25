"use client";
//zain
import DashBoardHero from "@/app/components/admin/DashBoardHero";
import AllUsers from "@/app/components/admin/Users/AllUsers";
import AdminSidebar from "@/app/components/admin/sidebar/AdminSidebar";
import Heading from "@/app/utils/Heading";
import React from "react";

const page = () => {
  return (
    <div>
      <Heading
        title={`Create-Course-Admin`}
        description="Elearning is a platform for students to learn and get help from teachers"
        keywords="Programming , MERN ,REDUX , Machine Learning"
      />
      <div className="flex h-full">
        {" "}
        <div className="1500px:w-[19%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashBoardHero />
        <AllUsers></AllUsers>
  
        </div>
      </div>
    </div>
  );
};

export default page;