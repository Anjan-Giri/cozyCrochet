// import React from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "../../styles/styles";

// const DropDown = ({ categoriesData, setDropDown }) => {
//   const navigate = useNavigate();
//   const handleSubmit = (i) => {
//     navigate(`/products?category=${i.title}`);
//     setDropDown(false);
//     window.location.reload();
//   };

//   return (
//     <div className="pb-4 w-[270px] bg-white absolute z-30 rounded-b-md shadow-sm">
//       {categoriesData &&
//         categoriesData.map((i, index) => (
//           <div
//             key={index}
//             className={`${styles.noramlFlex}`}
//             onClick={() => handleSubmit(i)}
//           >
//             <img
//               src={i.image_Url}
//               style={{
//                 width: "30px",
//                 height: "30px",
//                 objectFit: "contain",
//                 marginLeft: "15px",
//                 userSelect: "none",
//               }}
//               alt=""
//             />
//             <h3 className="p-3 cursor-pointer select-none">{i.title}</h3>
//           </div>
//         ))}
//     </div>
//   );
// };

// export default DropDown;

import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { CgSpinner } from "react-icons/cg";

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();

  const handleSubmit = (category) => {
    navigate(`/products?category=${encodeURIComponent(category.title)}`);
    setDropDown(false);
  };

  // Check if data is loading or empty
  if (!categoriesData || categoriesData.length === 0) {
    return (
      <div className="pb-4 w-[270px] bg-white absolute z-30 rounded-b-md shadow-sm">
        <div className="flex justify-center items-center p-4">
          {!categoriesData ? (
            <div className="flex items-center">
              <CgSpinner className="animate-spin mr-2" size={20} />
              <p>Loading categories...</p>
            </div>
          ) : (
            <p>No categories available</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4 w-[270px] bg-white absolute z-30 rounded-b-md shadow-sm">
      {categoriesData.map((category, index) => (
        <div
          key={index}
          className={`${styles.noramlFlex} hover:bg-gray-100 transition-all duration-200`}
          onClick={() => handleSubmit(category)}
        >
          {category.image_Url ? (
            <img
              src={category.image_Url}
              style={{
                width: "30px",
                height: "30px",
                objectFit: "contain",
                marginLeft: "15px",
                userSelect: "none",
              }}
              alt={category.title}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-[30px] h-[30px] ml-[15px] flex items-center justify-center">
              <span className="text-gray-400">•</span>
            </div>
          )}
          <h3 className="p-3 cursor-pointer select-none">{category.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default DropDown;
