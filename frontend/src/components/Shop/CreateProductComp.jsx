import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../stat/data";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { createProduct } from "../../redux/actions/product";
import { toast } from "react-toastify";

const CreateProductComp = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!name || !description || !category || !discountPrice || !stock) {
        toast.error("Please fill all required fields");
        return;
      }

      // Validate prices
      if (originalPrice && Number(discountPrice) >= Number(originalPrice)) {
        toast.error("Discount price must be less than original price");
        return;
      }

      const formData = new FormData();

      // Append images
      images.forEach((image) => {
        formData.append("images", image);
      });

      // Append other fields
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("tags", tags);
      formData.append("originalPrice", originalPrice);
      formData.append("discountPrice", discountPrice);
      formData.append("stock", stock);
      formData.append("shopId", seller._id);

      dispatch(createProduct(formData));
    } catch (err) {
      toast.error("Error creating product. Please try again.");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product created successfully");
      navigate("/dashboard-products");
      window.location.reload();
    }
  }, [error, success, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file size and type
    const validFiles = files.filter((file) => {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported image type`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length + images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...validFiles]);
  };

  return (
    <div className="w-full px-5">
      <h1 className="text-[25px] text-center font-semibold text-[#50007a] pb-4">
        Create Product
      </h1>
      {/* product form */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center"
      >
        <div className="w-full 800px:flex block pb-3">
          <div className="w-[100%] 800px:w-[50%] px-8">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={name}
              className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your product name..."
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] px-8">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Choose a category">Choose a category</option>
              {categoriesData &&
                categoriesData.map((i) => (
                  <option value={i.title} key={i.title}>
                    {i.title}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full px-8 pb-3">
          <label className="block text-sm font-medium text-[#50007a] py-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="5"
            type="text"
            name="description"
            value={description}
            className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description..."
          ></textarea>
        </div>

        <div className="w-full 800px:flex block pb-3">
          <div className="w-[100%] 800px:w-[50%] px-8">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Original Price
            </label>
            <input
              type="number"
              name="price"
              value={originalPrice}
              className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Enter your product price..."
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] px-8">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Final Price (With Discount){" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={discountPrice}
              className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="Enter your product price with discount..."
            />
          </div>
        </div>

        <div className="w-full 800px:flex block pb-3">
          <div className="w-[100%] 800px:w-[50%] px-8">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Product Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={stock}
              className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter your product stock..."
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] px-8">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={tags}
              className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter your product tags..."
            />
          </div>
        </div>

        <div className="w-full px-8 pb-3">
          <label className="block text-sm font-medium text-[#50007a] py-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <div className="border border-purple-700 rounded-md p-4 shadow-sm">
            <input
              type="file"
              name=""
              id="upload"
              className="hidden"
              multiple
              onChange={handleImageChange}
            />
            <div className="w-full flex items-center flex-wrap">
              <label
                htmlFor="upload"
                className="cursor-pointer flex items-center justify-center rounded-md hover:bg-purple-50 p-2 mr-2"
              >
                <AiOutlinePlusCircle size={30} className="text-[#50007a]" />
                <span className="ml-2 text-sm text-[#50007a]">Add Image</span>
              </label>
              {images &&
                images.map((i, index) => (
                  <div key={index} className="relative m-2">
                    <img
                      src={URL.createObjectURL(i)}
                      alt=""
                      className="h-[100px] w-[100px] object-cover rounded-md border-2 border-[#ece3e3]"
                    />
                    <span className="absolute top-1 right-1 bg-white text-xs px-2 py-1 rounded-full">
                      {index + 1}/5
                    </span>
                  </div>
                ))}
            </div>
            {images.length === 0 && (
              <p className="text-gray-400 text-sm mt-2 text-center">
                Upload up to 5 product images (JPEG, PNG, WebP)
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <input
            type="submit"
            value="Create Product"
            className="w-[210px] h-[50px] text-center text-[#50007a] border-2 font-semibold border-[#50007a] rounded-md cursor-pointer mt-10 hover:border-red-900 hover:text-red-900 hover:scale-105 duration-300"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateProductComp;
