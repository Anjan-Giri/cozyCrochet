import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../stat/data";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { createOffer } from "../../redux/actions/offer";
import { toast } from "react-toastify";

const CreateOffer = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.offers);
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

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
    <div className="w-[90%] 800px:w-[50%] bg-white  shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h3 className="text-[30px] font-Poppins text-center">Create Offer</h3>
      {/* offer product form */}
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description..."
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
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
        <br />
        <div>
          <label className="pb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            value={startDate ? startDate.toISOString().slice(0, 10) : ""}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleStartDateChange}
            min={today}
            placeholder="Enter your product tags..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="endDate"
            value={endDate ? endDate.toISOString().slice(0, 10) : ""}
            id="endDate"
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleEndDateChange}
            min={minEndDate}
            placeholder="Enter your product tags..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={tags}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter your product tags..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Original Price</label>
          <input
            type="number"
            name="price"
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter your product price..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Final Price (With Discount) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter your product price with discount..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter your product stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name=""
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {images &&
              images.map((image, index) => (
                <img
                  src={URL.createObjectURL(image)}
                  key={`${image.name}-${index}`}
                  alt=""
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))}
            {/* {images &&
              images.map((imgg) => (
                <img
                  src={URL.createObjectURL(imgg)}
                  key={imgg}
                  alt=""
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))} */}
          </div>
          <br />
          <div>
            <input
              type="submit"
              value="Create"
              className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateOffer;
