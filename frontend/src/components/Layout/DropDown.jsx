import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { BiCategoryAlt } from "react-icons/bi";

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();

  const handleSubmit = (category) => {
    navigate(`/products?category=${encodeURIComponent(category.title)}`);
    setDropDown(false);
  };

  // Show loading state if no categories yet
  if (!categoriesData || categoriesData.length === 0) {
    return (
      <div className="pb-4 w-[270px] bg-white absolute z-30 rounded-b-md shadow-sm">
        <div className="p-4 text-center">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="pb-4 w-[270px] bg-white absolute z-30 rounded-b-md shadow-sm">
      {categoriesData.map((category, index) => (
        <div
          key={index}
          className={`${styles.noramlFlex} hover:bg-gray-100 cursor-pointer`}
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
              alt=""
            />
          ) : (
            <div
              style={{
                width: "30px",
                height: "30px",
                marginLeft: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BiCategoryAlt size={20} />
            </div>
          )}
          <h3 className="p-3 select-none">{category.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default DropDown;
