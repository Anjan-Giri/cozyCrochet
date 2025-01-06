// import React, { useState } from "react";

// import { RxCross1 } from "react-icons/rx";
// import { BsCartPlus } from "react-icons/bs";
// import { AiOutlineHeart } from "react-icons/ai";

// const Wishlist = ({ setOpenWishlist }) => {
//   const cartData = [
//     {
//       name: "Product 1",
//       description: "description 1",
//       price: 100,
//     },
//     {
//       name: "Product 2 product product product",
//       description: "description 2",
//       price: 200,
//     },
//     {
//       name: "Product 3",
//       description: "description 3",
//       price: 300,
//     },
//   ];

//   return (
//     <div className="fixed top-0 left-0 w-full h-screen bg-[#0000004b] z-10">
//       <div className="fixed top-0 right-0 min-h-screen w-[30%] bg-gray-100 flex flex-col justify-between shadow-sm z-20 overflow-y-scroll">
//         <div>
//           <div className="flex w-full pt-6 pl-6 pb-4 pr-3 justify-between">
//             <h2 className="text-2xl text-[#d21e1e] font-bold">My Wishlist</h2>
//             <RxCross1
//               size={30}
//               className="cursor-pointer"
//               onClick={() => setOpenWishlist(false)}
//             />
//           </div>

//           {/* items quan */}

//           <div className="flex items-center p-6">
//             <AiOutlineHeart size={28} fill="red" />
//             <h3 className="pl-4 text-[17px] font-semibold text-[#9a0000]">
//               8 Items
//             </h3>
//           </div>

//           {/* item */}
//           <div className="w-full border-t">
//             {cartData &&
//               cartData.map((i, index) => <CartOne key={index} data={i} />)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const CartOne = ({ data }) => {
//   const [val, setVal] = useState(1);
//   const totalPrice = data.price * val;

//   return (
//     <div className="flex items-center justify-between p-5 py-6 border-b">
//       <div className="w-full flex items-center">
//         {/* <RxCross1 className="w-full flex items-center" /> */}
//         <img
//           src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgW-qsIUcPCsgwvnixYWsOVB-gYlaGrkW7sISuOfll59FCcH1aIV1HpCQI8NLmeELMKmdAM6ld8057l3DdxsGGH-0sbCBqBweQjmGE2Ps-83HsQ645Ru3FMtmpsLDBVMnKamS-yfPEoDwaE8XYzpyANfZzZMBd6dRxG37lNhT0-G1H3pZ8IkkHy7qGdwyj4/s1080/1.jpg"
//           alt="product"
//           className="w-[90px] h-[90px] ml-4"
//         />

//         <div className="px-4">
//           <h3 className="text-[18px] font-semibold text-[#440052]">
//             {data.name}
//           </h3>
//           <h6 className="text-[15px] text-[#900000] font-semibold font-Roboto">
//             Nrs {totalPrice}
//           </h6>
//         </div>
//         <div className="flex items-center flex-col  fixed right-4 gap-4">
//           <RxCross1
//             size={10}
//             className="cursor-pointer font-bold"
//             title="remove"
//             color="red"
//           />

//           <BsCartPlus
//             size={20}
//             className="cursor-pointer"
//             title="add to cart"
//             color="purple"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Wishlist;

import React, { useState } from "react";

import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";

const Wishlist = ({ setOpenWishlist }) => {
  const cartData = [
    {
      name: "Product 1",
      description: "description 1",
      price: 100,
    },
    {
      name: "Product 2 product product product",
      description: "description 2",
      price: 200,
    },
    {
      name: "Product 3",
      description: "description 3",
      price: 300,
    },
  ];

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-[#0000004b] z-50">
      <div className="fixed top-0 right-0 h-screen w-[90%] sm:w-[60%] md:w-[40%] lg:w-[40%] bg-gray-100 flex flex-col justify-between shadow-sm z-20 overflow-hidden">
        <div className="flex flex-col h-full overflow-y-scroll">
          <div className="flex w-full pt-6 pl-6 pb-4 pr-3 justify-between">
            <h2 className="text-2xl text-[#d21e1e] font-bold">My Wishlist</h2>
            <RxCross1
              size={30}
              className="cursor-pointer"
              onClick={() => setOpenWishlist(false)}
            />
          </div>

          <div className="flex items-center p-6">
            <AiOutlineHeart size={28} fill="red" />
            <h3 className="pl-4 text-[17px] font-semibold text-[#9a0000]">
              8 Items
            </h3>
          </div>

          <div className="w-full border-t flex-1">
            {cartData &&
              cartData.map((i, index) => <CartOne key={index} data={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

const CartOne = ({ data }) => {
  const [val, setVal] = useState(1);
  const totalPrice = data.price * val;

  return (
    <div className="flex items-center justify-between p-5 py-6 border-b">
      <div className="w-full flex items-center relative">
        <img
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgW-qsIUcPCsgwvnixYWsOVB-gYlaGrkW7sISuOfll59FCcH1aIV1HpCQI8NLmeELMKmdAM6ld8057l3DdxsGGH-0sbCBqBweQjmGE2Ps-83HsQ645Ru3FMtmpsLDBVMnKamS-yfPEoDwaE8XYzpyANfZzZMBd6dRxG37lNhT0-G1H3pZ8IkkHy7qGdwyj4/s1080/1.jpg"
          alt="product"
          className="w-[90px] h-[90px] ml-4"
        />

        <div className="px-4">
          <h3 className="text-[18px] font-semibold text-[#440052]">
            {data.name}
          </h3>
          <h6 className="text-[15px] text-[#900000] font-semibold font-Roboto">
            Nrs {totalPrice}
          </h6>
        </div>
        <div className="absolute flex items-center flex-col right-3 gap-4">
          <RxCross1
            size={10}
            className="cursor-pointer font-bold"
            title="remove"
            color="red"
          />

          <BsCartPlus
            size={20}
            className="cursor-pointer"
            title="add to cart"
            color="purple"
          />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
