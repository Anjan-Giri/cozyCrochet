import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import AllOffers from "../../components/Shop/AllOffers.jsx";

const AllOffersPage = () => {
  return (
    <div>
      <DashboardHeader />

      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[280px]">
          <DashboardSideBar active={5} />
        </div>
        <div className="w-full justify-center flex">
          <AllOffers />
        </div>
      </div>
    </div>
  );
};

export default AllOffersPage;
