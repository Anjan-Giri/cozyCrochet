import axios from "axios";
import { toast } from "react-toastify";

// export const server = "http://localhost:8000";
export const server = "https://cozycrochet-2.onrender.com";

//save wishlist to local storage
const saveWishlistToStorage = (wishlist) => {
  try {
    localStorage.setItem("userWishlist", JSON.stringify(wishlist));
  } catch (error) {
    console.error("Error saving wishlist to storage", error);
  }
};

//get wishlist from local storage
const getWishlistFromStorage = () => {
  try {
    const storedWishlist = localStorage.getItem("userWishlist");
    return storedWishlist ? JSON.parse(storedWishlist) : null;
  } catch (error) {
    console.error("Error reading wishlist from storage", error);
    return null;
  }
};

// Add to wishlist
export const addToWishlist = (data) => async (dispatch) => {
  try {
    const { data: responseData } = await axios.post(
      `${server}/api/v2/wishlist/create`,
      {
        productId: data._id,
      },
      { withCredentials: true }
    );

    // Save to local storage
    saveWishlistToStorage(responseData.wishlist);

    dispatch({
      type: "ADD_TO_WISHLIST",
      payload: responseData.wishlist,
    });

    toast.success("Item added to wishlist");
  } catch (error) {
    console.error("Add to Wishlist Error:", error.response || error);

    const errorMessage =
      error.response?.data?.message || "Error adding to wishlist";
    dispatch({
      type: "WISHLIST_ERROR",
      payload: errorMessage,
    });
    toast.error(errorMessage);
  }
};

// Fetch user's wishlist
export const fetchWishlist = () => async (dispatch) => {
  try {
    const storedWishlist = getWishlistFromStorage();

    if (storedWishlist) {
      dispatch({
        type: "FETCH_WISHLIST",
        payload: storedWishlist,
      });
    }

    const { data } = await axios.get(`${server}/api/v2/wishlist/list`, {
      withCredentials: true,
    });

    if (data.wishlist) {
      saveWishlistToStorage(data.wishlist);
      dispatch({
        type: "FETCH_WISHLIST",
        payload: data.wishlist,
      });
    }
  } catch (error) {
    console.error("Wishlist Fetch Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      fullError: error,
    });

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching wishlist";

    dispatch({
      type: "WISHLIST_ERROR",
      payload: errorMessage,
    });

    const storedWishlist = getWishlistFromStorage();
    if (storedWishlist) {
      dispatch({
        type: "FETCH_WISHLIST",
        payload: storedWishlist,
      });
    }

    toast.error(errorMessage);
  }
};

// Remove item from wishlist
export const removeFromWishlist = (data) => async (dispatch) => {
  try {
    const { data: responseData } = await axios.delete(
      `${server}/api/v2/wishlist/delete/${data._id}`,
      {
        withCredentials: true,
      }
    );

    saveWishlistToStorage(responseData.wishlist);

    dispatch({
      type: "REMOVE_FROM_WISHLIST",
      payload: responseData.wishlist,
    });

    toast.success("Item removed from wishlist");
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error removing from wishlist";
    dispatch({
      type: "WISHLIST_ERROR",
      payload: errorMessage,
    });
    toast.error(errorMessage);
  }
};
