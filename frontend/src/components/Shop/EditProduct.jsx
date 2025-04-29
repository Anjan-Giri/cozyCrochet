import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { categoriesData } from "../../stat/data";
import { toast } from "react-toastify";
import { updateProduct } from "../../redux/actions/product";
import { backend_url } from "../../server";

const EditProduct = ({ visible, onClose, product }) => {
  const dispatch = useDispatch();
  const { success, error, isLoading } = useSelector((state) => state.products);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imageError, setImageError] = useState({});

  useEffect(() => {
    if (product && visible) {
      setName(product.name || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setTags(product.tags || "");
      setOriginalPrice(product.originalPrice || "");
      setDiscountPrice(product.discountPrice || "");
      setStock(product.stock || "");
      setOldImages(product.images || []);
    }
  }, [product, visible]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      const showToastAndReset = async () => {
        toast.success("Product updated successfully");
        onClose();
        dispatch({ type: "updateProductReset" });
      };

      showToastAndReset();
    }
  }, [error, success, onClose, dispatch]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

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

  const getImageUrl = (image, index) => {
    if (!image?.url) return "/no-image.png";
    if (imageError[index]) return "/no-image.png";

    if (image.url.startsWith("http")) {
      return image.url;
    }

    const baseUrl = backend_url.replace("/api/v2", "").replace(/\/$/, "");

    const imagePath = image.url.replace(/^\/?(uploads\/)?/, "");

    return `${baseUrl}/uploads/${imagePath}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!name || !description || !category || !discountPrice || !stock) {
        toast.error("Please fill all required fields");
        return;
      }

      if (originalPrice && Number(discountPrice) >= Number(originalPrice)) {
        toast.error("Discount price must be less than original price");
        return;
      }

      const formData = new FormData();

      // Append images if any new ones
      images.forEach((image) => {
        formData.append("images", image);
      });

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("tags", tags);
      formData.append("originalPrice", originalPrice);
      formData.append("discountPrice", discountPrice);
      formData.append("stock", stock);
      formData.append("shopId", product.shopId);

      if (oldImages.length > 0) {
        formData.append("oldImages", JSON.stringify(oldImages));
      }

      dispatch(updateProduct(product._id, formData));
    } catch (err) {
      toast.error("Error updating product. Please try again.");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[90%] 800px:w-[60%] h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">Edit Product</h3>
          <button onClick={onClose}>
            <AiOutlineClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Product name"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Product description"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a category</option>
              {categoriesData &&
                categoriesData.map((i) => (
                  <option value={i.title} key={i.title}>
                    {i.title}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Product tags (comma separated)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block mb-2">Original Price</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Original price"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">
                Discount Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Discount price"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Product stock"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Current Images</label>
            <div className="flex flex-wrap gap-2">
              {oldImages && oldImages.length > 0 ? (
                oldImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={getImageUrl(image, index)}
                      alt=""
                      className="h-[100px] w-[100px] object-cover rounded-md"
                      onError={() => {
                        console.log("Image load failed:", image.url);
                        setImageError((prev) => ({ ...prev, [index]: true }));
                      }}
                      loading="lazy"
                    />
                  </div>
                ))
              ) : (
                <p>No images available</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Upload New Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt=""
                    className="h-[100px] w-[100px] object-cover rounded-md"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
