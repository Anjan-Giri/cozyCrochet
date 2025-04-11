import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader.jsx";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar.jsx";
import DashboardMain from "../../components/Shop/DashboardMain.jsx";

const ShopDashboardPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[280px]">
          <DashboardSideBar active={1} />
        </div>
        <DashboardMain />
      </div>
    </div>
  );
};

export default ShopDashboardPage;
