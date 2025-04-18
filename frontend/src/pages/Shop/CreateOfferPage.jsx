import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import CreateOffer from "../../components/Shop/CreateOffer.jsx";

const CreateOfferPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[280px]">
          <DashboardSideBar active={6} />
        </div>
        <div className="w-full justify-center flex bg-white mx-3 my-2">
          <CreateOffer />
        </div>
      </div>
    </div>
  );
};

export default CreateOfferPage;
