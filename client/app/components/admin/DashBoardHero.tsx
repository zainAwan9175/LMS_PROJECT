import React, { FC, useState } from "react";
import DashboardHeader from "./DashBoardHeader";
import DashboardWidgets from "./Wigets/DashboardWidgets";


type props = {
  isDashboard?: boolean;
};

// { isDashboard }: props
const  DashBoardHero: FC<props> = ({ isDashboard }: props) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <DashboardHeader open={open} setOpen={setOpen} />
      {isDashboard && <DashboardWidgets open={open} />}
    </div>
  );
};

export default DashBoardHero;