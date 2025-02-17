import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import AllCoupons from "../../components/Shop/AllCoupons.jsx";

const AllCouponsPage = () => {
  return (
    <div>
      <DashboardHeader />

      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[280px]">
          <DashboardSideBar active={9} />
        </div>
        <div className="w-full justify-center flex">
          <AllCoupons />
        </div>
      </div>
    </div>
  );
};

export default AllCouponsPage;
