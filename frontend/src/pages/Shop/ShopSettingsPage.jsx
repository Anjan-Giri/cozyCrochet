import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import ShopSettings from "../../components/Shop/ShopSettings.jsx";

const ShopSettingsPage = () => {
  return (
    <div>
      <DashboardHeader />

      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[280px]">
          <DashboardSideBar active={8} />
        </div>
        <div className="w-full justify-center flex">
          <ShopSettings />
        </div>
      </div>
    </div>
  );
};

export default ShopSettingsPage;
