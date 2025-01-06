import React from "react";
import Lottie from "react-lottie";
import animations from "../../assests/animations/Animation - 1735552110745.json";

const Loader = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animations,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};

export default Loader;
