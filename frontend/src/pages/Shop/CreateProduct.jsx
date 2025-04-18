import React from "react";

import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import CreateProductComp from "../../components/Shop/CreateProductComp.jsx";

const CreateProduct = () => {
  return (
    <div>
      <DashboardHeader />

      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[280px]">
          <DashboardSideBar active={4} />
        </div>
        <div className="w-full justify-center flex bg-white mx-3 my-2">
          <CreateProductComp />
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
