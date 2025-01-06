import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";

const ProductDetails = ({ data }) => {
  const [count, setCount] = useState(1);

  const [click, setClick] = useState(false);

  const navigate = useNavigate();

  const [select, setSelect] = useState(0);

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const handleMessageSubmit = () => {
    navigate("/inbox?conversation=3423fsdf322");
  };

  return (
    <div className="bg-white">
      {data ? (
        <>
          <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
            <div className="w-full py-8">
              <div className="block w-full 800px:flex">
                <div className="w-full 800px:w-[50%]">
                  <img
                    src={data.image_Url[select].url}
                    className="w-[70%] m-auto mb-6"
                    alt=""
                  />
                  <div className="w-full flex gap-6">
                    <div
                      className={`${
                        select === 0 ? "border" : "null"
                      } cursor-pointer`}
                    >
                      <img
                        src={data?.image_Url[0].url}
                        className="h-[170px] w-[240px]"
                        onClick={() => setSelect(0)}
                        alt="product img"
                      />
                    </div>

                    <div
                      className={`${
                        select === 1 ? "border" : "null"
                      } cursor-pointer`}
                    >
                      <img
                        src={data?.image_Url[1].url}
                        className="h-[170px] w-[240px]"
                        onClick={() => setSelect(1)}
                        alt="product img"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full 800px:w-[50%] pl-12 pr-8 pt-4">
                  <h3 className="text-[25px] font-[600] font-Roboto text-[#48004f]">
                    {data.name}
                  </h3>
                  <p className="pt-4">{data.description}</p>
                  <div className="flex pt-6 items-center">
                    <h2 className="font-bold text-[18px] text-[#8e0000] font-Roboto">
                      Nrs {data.discount_price}
                    </h2>
                    <h4 className="font-[500] text-[14px] text-[#e32e0e] pl-3 mt-[-18px] line-through">
                      {data.price ? " Nrs" + data.price : null}
                    </h4>
                  </div>
                  <div className="flex items-center mt-8 justify-between pr-3">
                    <div>
                      <button
                        className="bg-gradient-to-r from-gray-800 to-gray-500 text-white font-bold rounded-l-md px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                        onClick={decrementCount}
                      >
                        -
                      </button>
                      <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[9px]">
                        {count}
                      </span>
                      <button
                        className="bg-gradient-to-r from-gray-500 to-gray-800 text-white font-bold rounded-r-md px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                        onClick={incrementCount}
                      >
                        +
                      </button>
                    </div>
                    <div>
                      {click ? (
                        <AiFillHeart
                          size={30}
                          className="cursor-pointer"
                          onClick={() => setClick(!click)}
                          color={click ? "red" : "#333"}
                          title="Remove from wishlist"
                        />
                      ) : (
                        <AiOutlineHeart
                          size={30}
                          className="cursor-pointer"
                          onClick={() => setClick(!click)}
                          color={click ? "red" : "#333"}
                          title="Add to wishlist"
                        />
                      )}
                    </div>
                  </div>
                  <div
                    className={`bg-gradient-to-r from-gray-800 to-gray-500 text-white font-bold shadow-lg hover:cursor-pointer hover:bg-gradient-to-l hover:from-gray-800 hover:to-gray-500 hover:text-gray-200 duration-300 ease-in-out mt-10 rounded flex items-center py-3 justify-center`}
                  >
                    <span className="flex items-center justify-center">
                      Add to Cart <AiOutlineShoppingCart className="ml-2" />
                    </span>
                  </div>
                  <div className="flex items-center pt-10">
                    <img
                      src={data.shop.shop_avatar.url}
                      alt="shop img"
                      className="w-[70px] h-[70px] rounded-full mr-4"
                    />
                    <div className="pr-8">
                      <h1 className="pt-3 text-[15px] pb-1 text-[#b10012]">
                        {data.shop.name}
                      </h1>
                      <h2 className="pb-2 text-[13px]">
                        ({data.shop.ratings}) Ratings
                      </h2>
                    </div>
                    <div
                      className="bg-gradient-to-r from-gray-900 to-gray-600 text-white font-bold hover:cursor-pointer hover:bg-gradient-to-l hover:from-gray-900 hover:to-gray-600 hover:text-gray-200 duration-300 ease-in-out rounded-lg flex items-center py-3 px-4 justify-center"
                      onClick={handleMessageSubmit}
                    >
                      <span className="flex items-center justify-center">
                        Contact Now <AiOutlineMessage className="ml-2" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ProductInfo data={data} />
          </div>
        </>
      ) : (
        <div className="w-full flex items-center justify-center">
          <h5>no data</h5>
        </div>
      )}
    </div>
  );
};

const ProductInfo = ({ data }) => {
  const [active, setActive] = useState(1);

  return (
    <>
      <div className="py-6">
        <div className="bg-gray-200 min-h-[55vh] px-5 800px:px-12 rounded">
          <div className="flex items-center justify-between w-full border-b pt-12 pb-8">
            <div className="relative">
              <h1
                className="text-[#440049] text-[18px] px-4 leading-5 font-semibold cursor-pointer 800px:[23px] hover:scale-105 duration-200"
                onClick={() => setActive(1)}
              >
                Details
              </h1>
              {active === 1 ? (
                <div className="absolute bottom-[-27%] left-0 h-[3px] w-full bg-[#781125]"></div>
              ) : null}
            </div>
            <div className="relative">
              <h1
                className="text-[#440049] text-[18px] px-4 leading-5 font-semibold cursor-pointer 800px:[23px] hover:scale-105 duration-200"
                onClick={() => setActive(2)}
              >
                Reviews
              </h1>
              {active === 2 ? (
                <div className="absolute bottom-[-27%] left-0 h-[3px] w-full bg-[#781125]"></div>
              ) : null}
            </div>
            <div className="relative">
              <h1
                className="text-[#440049] text-[18px] px-4 leading-5 font-semibold cursor-pointer 800px:[23px] hover:scale-105 duration-200"
                onClick={() => setActive(3)}
              >
                Seller
              </h1>
              {active === 3 ? (
                <div className="absolute bottom-[-27%] left-0 h-[3px] w-full bg-[#781125]"></div>
              ) : null}
            </div>
          </div>
          {active === 1 ? (
            <>
              <p className="font-Roboto text-[15px] pb-2 pt-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam
                eius rerum soluta sed quisquam fugit odio incidunt itaque
                tenetur mollitia. Cupiditate non ipsam at velit amet quae
                aperiam perferendis distinctio?
              </p>
              <p className="font-Roboto text-[15px] pb-8">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. In
                dolore quae reprehenderit tempora saepe eum laboriosam ipsam
                rem, mollitia incidunt. Quos voluptate ab accusantium temporibus
                assumenda sapiente! Ad, quibusdam impedit. Lorem ipsum dolor sit
                amet consectetur, adipisicing elit. Consectetur nemo ex fugit
                aut quibusdam qui tempora quo porro necessitatibus, enim soluta
                ut, in deleniti harum nulla! Suscipit facilis quam optio.
              </p>
            </>
          ) : null}
          {active === 2 ? (
            <div className="w-full justify-center min-h-[45vh] flex items-center">
              <p>No Reviews Yet</p>
            </div>
          ) : null}
          {active === 3 ? (
            <div className="w-full block 800px:flex p-4">
              <div className="w-full 800px:w-[50%]">
                <div className="flex items-center">
                  <img
                    src={data.shop.shop_avatar.url}
                    alt="shop img"
                    className="w-[80px] h-[80px] rounded-full"
                  />
                  <div className="px-4">
                    <h3 className="pt-2 text-[18px] pb-1 text-[#b10012]">
                      {data.shop.name}
                    </h3>
                    <h5 className="pb-2 text-[14px]">
                      ({data.shop.ratings}) Rating
                    </h5>
                  </div>
                </div>
                <p className="pt-4 font-Roboto text-[15px]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Impedit aut quidem voluptas porro voluptatum cupiditate
                  quibusdam culpa adipisci, ea amet perspiciatis autem omnis
                  unde fuga illum. Architecto id quo eveniet.
                </p>
              </div>
              <div className="w-full 800px:w-[50%] mt-6 800px:mt-0 800px: flex flex-col items-end">
                <div className="text-left">
                  <h1 className="font-semibold text-[#480043]">
                    Joined:{" "}
                    <span className="font-medium text-[#530000] pl-2">
                      12 December, 2024
                    </span>
                  </h1>
                  <h1 className="font-semibold pt-4 text-[#480043]">
                    Total Products:
                    <span className="font-medium text-[#530000] pl-2">
                      5,000
                    </span>
                  </h1>
                  <h1 className="font-semibold pt-4 text-[#480043]">
                    Total Review:{" "}
                    <span className="font-medium text-[#530000] pl-2">
                      2,000
                    </span>
                  </h1>
                  <Link to="/">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-600 text-white font-bold hover:cursor-pointer hover:bg-gradient-to-l hover:from-gray-900 hover:to-gray-600 hover:text-gray-200 duration-300 ease-in-out rounded-lg flex items-center py-3 px-4 justify-center my-6">
                      <span className="flex items-center justify-center">
                        Visit
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
