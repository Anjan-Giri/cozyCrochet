import React, { useEffect } from "react";

import RegisterShop from "../components/Shop/RegisterShop.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const CreateShopPage = () => {
  const { isSeller, seller } = useSelector((state) => state.seller);

  const navigate = useNavigate();

  useEffect(() => {
    if (isSeller === true) {
      navigate(`/shop/${seller._id}`);
    }
  }, []);
  return (
    <div>
      <RegisterShop />
    </div>
  );
};

export default CreateShopPage;
