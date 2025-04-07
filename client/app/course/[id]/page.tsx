"use client";

import CourseDetailsPage from "@/app/components/Course/CourseDetailsPage";
import React from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div>
      <CourseDetailsPage id={id} />
    </div>
  );
};

export default Page;
