"use client";
import React from "react";
import AdminSidebar from "../../components/admin/sidebar/AdminSidebar";
import Heading from "../../utils/Heading";

import UserAnalytics from "@/app/components/admin/Analytics/UserAnalytics";
import DashBoardHero from "@/app/components/admin/DashBoardHero";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <Heading
        title="Elearning - Admin"
        description="ELearning is a platform for students to learn and get help from teachers"
        keywords="Prograaming,MERN,Redux,Machine Learning"
      />
      <div className="flex">
        <div className="1500px:w-[19%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashBoardHero />
          <UserAnalytics />
        </div>
      </div>
    </div>
  );
};

export default page;