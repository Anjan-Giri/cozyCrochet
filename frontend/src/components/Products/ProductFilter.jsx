import React, { useState } from "react";
import { BsFilterLeft } from "react-icons/bs";

const ProductFilter = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("default");

  const filterOptions = [
    { id: "default", label: "Default" },
    { id: "price-asc", label: "Price: Low to High" },
    { id: "price-desc", label: "Price: High to Low" },
    { id: "sold-desc", label: "Most Popular" },
    { id: "date-desc", label: "Newest First" },
    { id: "date-asc", label: "Oldest First" },
    { id: "ratings-desc", label: "Highest Rated" },
  ];

  const handleFilterChange = (filterId) => {
    setSelectedFilter(filterId);
    onFilterChange(filterId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
      >
        <BsFilterLeft className="h-5 w-5 text-purple-700" />
        <span>
          Sort by:{" "}
          {filterOptions.find((option) => option.id === selectedFilter).label}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-56 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleFilterChange(option.id)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  selectedFilter === option.id
                    ? "bg-purple-100 text-purple-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
