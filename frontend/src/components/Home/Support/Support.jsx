// import React from "react";
// import handcrafts from "../../../assests/handcrafts logo.png";

// const Support = () => {
//   return (
//     <div className="w-full flex flex-col bg-[#f4f0dd] py-10 px-4 sm:px-8 md:px-16 mb-12 rounded-xl">
//       <div className="flex flex-wrap justify-center md:justify-between w-full gap-6 px-4">
//         <div className="flex items-center justify-center">
//           <img
//             src={handcrafts}
//             alt="Handcrafts Logo"
//             className="w-[150px] h-[100px] sm:w-[200px] sm:h-[140px] md:w-[250px] md:h-[170px] object-contain cursor-pointer"
//           />
//         </div>
//         <div className="flex items-center justify-center">
//           <img
//             src={handcrafts}
//             alt="Handcrafts Logo"
//             className="w-[150px] h-[100px] sm:w-[200px] sm:h-[140px] md:w-[250px] md:h-[170px] object-contain cursor-pointer"
//           />
//         </div>
//         <div className="flex items-center justify-center">
//           <img
//             src={handcrafts}
//             alt="Handcrafts Logo"
//             className="w-[150px] h-[100px] sm:w-[200px] sm:h-[140px] md:w-[250px] md:h-[170px] object-contain cursor-pointer"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Support;

import React from "react";
import handcrafts from "../../../assests/handcrafts logo.png";

const Support = () => {
  return (
    <div className="w-full flex flex-col bg-[#f4f0dd] py-10 px-4 sm:px-8 md:px-16 my-12 rounded-xl">
      <div className="flex flex-wrap justify-center gap-6 px-4 md:gap-8 lg:justify-between">
        <div className="flex items-center justify-center w-full sm:w-auto">
          <img
            src={handcrafts}
            alt="Handcrafts Logo"
            className="w-[200px] h-[140px] sm:w-[220px] sm:h-[160px] md:w-[250px] md:h-[180px] lg:w-[280px] lg:h-[200px] object-contain cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-center w-full sm:w-auto">
          <img
            src={handcrafts}
            alt="Handcrafts Logo"
            className="w-[200px] h-[140px] sm:w-[220px] sm:h-[160px] md:w-[250px] md:h-[180px] lg:w-[280px] lg:h-[200px] object-contain cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-center w-full sm:w-auto">
          <img
            src={handcrafts}
            alt="Handcrafts Logo"
            className="w-[200px] h-[140px] sm:w-[220px] sm:h-[160px] md:w-[250px] md:h-[180px] lg:w-[280px] lg:h-[200px] object-contain cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Support;
