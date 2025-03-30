import React from "react";
import Lottie from "react-lottie";
import animationData from "../../assests/animations/Animation - 1743341243390.json";

const OrderSuccess = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div>
      <Lottie options={defaultOptions} width={300} height={300} />
      <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
        Your order is successful !
      </h5>
      <br />
      <br />
    </div>
  );
};

export default OrderSuccess;
