import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import ShopOrderDetails from "../../components/Shop/ShopOrderDetails.jsx";

const ShopOrderDetailsPage = () => {
  return (
    <div className="bg-gray-50">
      <DashboardHeader />

      <div className="flex items-start justify-between w-full">
        <div className="w-full justify-center flex">
          <ShopOrderDetails />
        </div>
      </div>
    </div>
  );
};

export default ShopOrderDetailsPage;
