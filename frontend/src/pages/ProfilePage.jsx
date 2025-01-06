import React, { useState } from "react";

import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

import ProfileSide from "../components/Profile/ProfileSide.jsx";
import ProfileC from "../components/Profile/ProfileC.jsx";

const ProfilePage = () => {
  const [active, setActive] = useState(1);

  return (
    <div>
      <Header />

      <div className="w-11/12 mx-auto flex bg-gray-100 py-4">
        <div className="w-[60px] 800px:w-[270px] mt-24 800px:mt-0">
          <ProfileSide active={active} setActive={setActive} />
        </div>
        <ProfileC active={active} />
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
