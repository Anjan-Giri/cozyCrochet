import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllProducts } from "../redux/actions/product";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import Loader from "../components/Layout/Loader";
import axios from "axios";
import { server } from "../server";

const ProductDetailsPage = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { allProducts, isLoading } = useSelector((state) => state.products);

  // Normalize product name for comparison
  const normalizeProductName = useCallback((productName) => {
    return productName
      .replace(/[^a-zA-Z0-9]/g, " ")
      .trim()
      .toLowerCase();
  }, []);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        const normalizedSearchName = normalizeProductName(name);

        // First try to find in Redux store
        if (allProducts?.length) {
          const matchedProduct = allProducts.find(
            (product) =>
              normalizeProductName(product.name) === normalizedSearchName
          );

          if (matchedProduct) {
            setData(matchedProduct);
            setLoading(false);
            return;
          }
        }

        // If not in Redux or Redux is empty, fetch from API
        const response = await axios.get(
          `${server}/product/search/${encodeURIComponent(
            name.replace(/-+/g, " ").trim()
          )}`,
          {
            timeout: 5000, // 5 second timeout
          }
        );

        if (response.data.success && response.data.products?.length > 0) {
          const productData = response.data.products[0];

          // Validate essential data
          if (!productData.name || !productData.images) {
            throw new Error("Invalid product data received");
          }

          setData(productData);

          // Update Redux store in background
          dispatch(getAllProducts());
        } else {
          throw new Error("Product not found");
        }
      } catch (error) {
        console.error("Error loading product:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load product"
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      loadProductData();
    }
  }, [dispatch, name, allProducts, normalizeProductName]);

  // Show loading state
  if (loading || isLoading) {
    return (
      <div>
        <Header />
        <div className="w-full min-h-[70vh] flex items-center justify-center">
          <Loader />
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div>
        <Header />
        <div className="w-full min-h-[70vh] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">{error}</h1>
          <p className="text-gray-500">
            Please try again later or check the product URL
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  // Show not found state
  if (!data) {
    return (
      <div>
        <Header />
        <div className="w-full min-h-[70vh] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">
            Product not found
          </h1>
          <p className="text-gray-500">
            The product you're looking for doesn't exist or has been removed
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  // Show product details
  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      <SuggestedProduct data={data} />
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
