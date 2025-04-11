import React from "react";

import ShopInfo from "../../components/Shop/ShopInfo.jsx";
import ShopProfileData from "../../components/Shop/ShopProfileData.jsx";
import Header from "../../components/Layout/Header.jsx";
import Footer from "../../components/Layout/Footer.jsx";

const ShopPreviewPage = () => {
  return (
    <>
      <Header />
      <div className="w-11/12 mx-auto bg-[#f4f4f4]">
        <div className="w-full py-4 justify-between gap-4">
          <div className="w-full bg-[#fff] rounded-[4px] shadow-sm h-auto top-6 z-10">
            <ShopInfo isOwner={false} />
          </div>
          <div className="w-full flex items-center pt-10 justify-center rounded-[4px]">
            <ShopProfileData isOwner={false} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShopPreviewPage;
