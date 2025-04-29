import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { createOffer } from "../../redux/actions/offer";
import { getAllProductsShop } from "../../redux/actions/product";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";

const CreateOffer = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.offers);
  const { products, isLoading } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedProduct, setSelectedProduct] = useState("");

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [useProductImages, setUseProductImages] = useState(true);

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller._id]);

  const handleProductSelect = (e) => {
    const productId = e.target.value;
    setSelectedProduct(productId);

    if (productId) {
      const product = products.find((p) => p._id === productId);
      if (product) {
        setName(product.name);
        setDescription(product.description);
        setCategory(product.category);
        setTags(product.tags || "");
        setOriginalPrice(product.originalPrice || product.discountPrice);
        setDiscountPrice(product.discountPrice);
        setStock(product.stock);

        setImages([]);
      }
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setTags("");
    setOriginalPrice("");
    setDiscountPrice("");
    setStock("");
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !selectedProduct ||
        !startDate ||
        !endDate ||
        !discountPrice ||
        !stock
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      if (originalPrice && Number(discountPrice) >= Number(originalPrice)) {
        toast.error("Discount price must be less than original price");
        return;
      }

      const formData = new FormData();

      if (!useProductImages) {
        if (images.length === 0) {
          toast.error("Please upload at least one image or use product images");
          return;
        }

        images.forEach((image) => {
          formData.append("images", image);
        });
      }

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("tags", tags);
      formData.append("originalPrice", originalPrice);
      formData.append("discountPrice", discountPrice);
      formData.append("stock", stock);
      formData.append("shopId", seller._id);
      formData.append("productId", selectedProduct);
      formData.append("startDate", startDate.toISOString());
      formData.append("endDate", endDate.toISOString());

      dispatch(createOffer(formData));
    } catch (err) {
      toast.error("Error creating offer. Please try again.");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Offer created successfully");
      navigate("/dashboard-offer");
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
    setUseProductImages(false);
  };

  const today = new Date().toISOString().slice(0, 10);

  const minEndDate = startDate
    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : today;

  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);

    const minEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    setStartDate(startDate);
    setEndDate(null);
    document.getElementById("endDate").min = minEndDate
      .toISOString()
      .slice(0, 10);
  };

  const handleEndDateChange = (e) => {
    const endDate = new Date(e.target.value);
    setEndDate(endDate);
  };

  return (
    <div className="w-full px-5">
      <h1 className="text-[25px] text-center font-semibold text-[#50007a] pb-4">
        Create Offer From Existing Product
      </h1>

      {isLoading ? (
        <Loader />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          {/* Product Selection */}
          <div className="w-full px-8 pb-6">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Select Product <span className="text-red-500">*</span>
            </label>
            <select
              className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedProduct}
              onChange={handleProductSelect}
            >
              <option value="">Choose a product</option>
              {products &&
                products.map((product) => (
                  <option value={product._id} key={product._id}>
                    {product.name} - Price: Nrs {product.discountPrice} - Stock:{" "}
                    {product.stock}
                  </option>
                ))}
            </select>
          </div>

          {/* Offer Dates */}
          <div className="w-full 800px:flex block pb-3">
            <div className="w-[100%] 800px:w-[50%] px-8">
              <label className="block text-sm font-medium text-[#50007a] py-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={startDate ? startDate.toISOString().slice(0, 10) : ""}
                className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handleStartDateChange}
                min={today}
              />
            </div>
            <div className="w-[100%] 800px:w-[50%] px-8">
              <label className="block text-sm font-medium text-[#50007a] py-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                value={endDate ? endDate.toISOString().slice(0, 10) : ""}
                className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handleEndDateChange}
                min={minEndDate}
                disabled={!startDate}
              />
            </div>
          </div>

          {/* Product details section */}
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
                placeholder="Enter your offer name..."
                readOnly={!selectedProduct}
              />
            </div>
            <div className="w-[100%] 800px:w-[50%] px-8">
              <label className="block text-sm font-medium text-[#50007a] py-2">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="category"
                value={category}
                className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                readOnly
              />
            </div>
          </div>

          <div className="w-full px-8 pb-3">
            <label className="block text-sm font-medium text-[#50007a] py-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              cols="30"
              rows="5"
              type="text"
              name="description"
              value={description}
              className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your offer description..."
              readOnly={!selectedProduct}
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
                placeholder="Enter your offer price..."
              />
            </div>
            <div className="w-[100%] 800px:w-[50%] px-8">
              <label className="block text-sm font-medium text-[#50007a] py-2">
                Special Offer Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={discountPrice}
                className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Enter your special offer price..."
              />
            </div>
          </div>

          <div className="w-full 800px:flex block pb-3">
            <div className="w-[100%] 800px:w-[50%] px-8">
              <label className="block text-sm font-medium text-[#50007a] py-2">
                Offer Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={stock}
                className="block w-full px-4 py-2 border border-purple-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(e) => setStock(e.target.value)}
                placeholder="Enter your offer stock..."
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
                placeholder="Enter your offer tags..."
                readOnly={!selectedProduct}
              />
            </div>
          </div>

          <div className="w-full px-8 pb-3">
            <div className="flex items-center mb-4">
              <input
                id="use-product-images"
                type="checkbox"
                checked={useProductImages}
                onChange={() => setUseProductImages(!useProductImages)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                disabled={!selectedProduct}
              />
              <label
                htmlFor="use-product-images"
                className="ml-2 text-sm font-medium text-[#50007a]"
              >
                Use product images for this offer
              </label>
            </div>

            {!useProductImages && (
              <>
                <label className="block text-sm font-medium text-[#50007a] py-2">
                  Upload Offer Images <span className="text-red-500">*</span>
                </label>
                <div className="border border-purple-700 rounded-md p-4 shadow-sm">
                  <input
                    type="file"
                    name=""
                    id="upload"
                    className="hidden"
                    multiple
                    onChange={handleImageChange}
                    disabled={!selectedProduct}
                  />
                  <div className="w-full flex items-center flex-wrap">
                    <label
                      htmlFor="upload"
                      className={`cursor-pointer flex items-center justify-center rounded-md ${
                        !selectedProduct ? "opacity-50" : "hover:bg-purple-50"
                      } p-2 mr-2`}
                    >
                      <AiOutlinePlusCircle
                        size={30}
                        className="text-[#50007a]"
                      />
                      <span className="ml-2 text-sm text-[#50007a]">
                        Add Image
                      </span>
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
                      Upload up to 5 offer images (JPEG, PNG, WebP)
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-center">
            <input
              type="submit"
              value="Create Offer"
              className={`w-[210px] h-[50px] text-center text-[#50007a] border-2 font-semibold border-[#50007a] rounded-md cursor-pointer mt-10 ${
                !selectedProduct
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-red-900 hover:text-red-900 hover:scale-105"
              } duration-300`}
              disabled={!selectedProduct}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateOffer;
