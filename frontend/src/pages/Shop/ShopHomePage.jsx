import React from "react";

import ShopInfo from "../../components/Shop/ShopInfo.jsx";
import ShopProfileData from "../../components/Shop/ShopProfileData.jsx";

const ShopHomePage = () => {
  return (
    <div className="w-11/12 mx-auto bg-[#f4f4f4]">
      <div className="w-full py-4 justify-between gap-4">
        <div className="w-full bg-[#fff] rounded-[4px] shadow-sm h-auto top-6 z-10">
          <ShopInfo isOwner={true} />
        </div>
        <div className="w-full flex items-center pt-10 justify-center rounded-[4px]">
          <ShopProfileData isOwner={true} />
        </div>
      </div>
    </div>
  );
};

export default ShopHomePage;
