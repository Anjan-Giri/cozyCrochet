import axios from "axios";
import { toast } from "react-toastify";

export const server = "http://localhost:8000";

// Add to cart
export const addToCart = (data) => async (dispatch) => {
  try {
    const { data: responseData } = await axios.post(
      `${server}/api/v2/cart/add`,
      {
        productId: data._id,
        quantity: 1,
      },
      { withCredentials: true }
    );

    dispatch({
      type: "ADD_TO_CART",
      payload: responseData.cart,
    });

    toast.success("Item added to cart");
  } catch (error) {
    console.error("Add to Cart Error:", error.response || error);

    const errorMessage =
      error.response?.data?.message || "Error adding to cart";
    dispatch({
      type: "CART_ERROR",
      payload: errorMessage,
    });
    toast.error(errorMessage);
  }
};

// Fetch user's cart
export const fetchCart = () => async (dispatch) => {
  try {
    console.log("Attempting to fetch cart");

    const { data } = await axios.get(`${server}/api/v2/cart/my-cart`, {
      withCredentials: true,
    });

    console.log("Cart Fetch Response:", data);

    dispatch({
      type: "FETCH_CART",
      payload: data.cart,
    });
  } catch (error) {
    console.error("Full Cart Fetch Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      fullError: error,
    });

    const errorMessage =
      error.response?.data?.message || error.message || "Error fetching cart";

    dispatch({
      type: "CART_ERROR",
      payload: errorMessage,
    });

    toast.error(errorMessage);
  }
};

// Update cart item quantity
export const updateCartItemQuantity =
  (productId, quantity) => async (dispatch) => {
    try {
      const { data } = await axios.put(
        `${server}/api/v2/cart/update-quantity`,
        {
          productId,
          quantity,
        },
        { withCredentials: true }
      );

      dispatch({
        type: "UPDATE_CART_ITEM",
        payload: data.cart,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error updating cart";
      dispatch({
        type: "CART_ERROR",
        payload: errorMessage,
      });
      toast.error(errorMessage);
    }
  };

// Remove item from cart
export const removeFromCart = (productId) => async (dispatch) => {
  try {
    const { data } = await axios.delete(
      `${server}/api/v2/cart/remove/${productId}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "REMOVE_FROM_CART",
      payload: data.cart,
    });

    toast.success("Item removed from cart");
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error removing from cart";
    dispatch({
      type: "CART_ERROR",
      payload: errorMessage,
    });
    toast.error(errorMessage);
  }
};

// Clear entire cart
export const clearCart = () => async (dispatch) => {
  try {
    const { data } = await axios.delete(`${server}/api/v2/cart/clear`, {
      withCredentials: true,
    });

    dispatch({
      type: "CLEAR_CART",
      payload: data.cart,
    });

    toast.success("Cart cleared successfully");
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Error clearing cart";
    dispatch({
      type: "CART_ERROR",
      payload: errorMessage,
    });
    toast.error(errorMessage);
  }
};
