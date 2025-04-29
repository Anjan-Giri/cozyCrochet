import axios from "axios";
import { server } from "../../server";

const api = axios.create({
  baseURL: server,
  withCredentials: true,
  timeout: 5000,
});

// User load action
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });

    console.log(`Sending GET request to: ${server}/user/getuser`);

    const { data } = await api.get("/user/getuser");

    console.log("User data received:", { ...data, user: "REDACTED" });

    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to load user";

    console.error("Load user error:", {
      status: error.response?.status,
      message: errorMessage,
      path: "/user/getuser",
    });

    dispatch({
      type: "LoadUserFail",
      payload: errorMessage,
    });
  }
};

// Seller load action
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadSellerRequest" });

    console.log(`Sending GET request to: ${server}/shop/getseller`);

    const { data } = await api.get("/shop/getseller");

    console.log("Seller data received:", { ...data, seller: "REDACTED" });

    dispatch({
      type: "LoadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to load seller";

    console.error("Load seller error:", {
      status: error.response?.status,
      message: errorMessage,
      path: "/shop/getseller",
    });

    dispatch({
      type: "LoadSellerFail",
      payload: errorMessage,
    });
  }
};

//update user
export const updateUserInfo =
  (email, password, phoneNumber, name) => async (dispatch) => {
    try {
      dispatch({ type: "updateUserInfoRequest" });

      const userData = {
        email,
        password,
        name,
        phoneNumber: phoneNumber ? Number(phoneNumber) : undefined,
      };

      console.log("Sending update with:", {
        ...userData,
        password: "[REDACTED]",
      });

      const { data } = await axios.put(`${server}/user/update-user`, userData, {
        withCredentials: true,
      });

      dispatch({
        type: "updateUserInfoSuccess",
        payload: data.user,
      });
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      dispatch({
        type: "updateUserInfoFail",
        payload: error.response?.data?.message || "Update failed",
      });
    }
  };

//address update
export const updateUserAddress =
  (country, city, address1, address2, zipCode, addressType) =>
  async (dispatch) => {
    try {
      dispatch({ type: "updateUserAddressRequest" });

      const { data } = await axios.put(
        `${server}/user/update-address`,
        {
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType,
        },
        {
          withCredentials: true,
        }
      );

      dispatch({
        type: "updateUserAddressSuccess",
        payload: {
          user: data.user,
          successMessage: "Address updated successfully",
        },
      });
    } catch (error) {
      dispatch({
        type: "updateUserAddressFail",
        payload: error.response?.data?.message || "Update address failed",
      });
    }
  };

//delete address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteUserAddressRequest" });
    const { data } = await axios.delete(`${server}/user/delete-address/${id}`, {
      withCredentials: true,
    });
    dispatch({
      type: "deleteUserAddressSuccess",
      payload: {
        user: data.user,
        successMessage: "Address deleted successfully",
      },
    });
  } catch (error) {
    dispatch({
      type: "deleteUserAddressFail",
      payload: error.response?.data?.message || "Delete address failed",
    });
  }
};

//update seller info
export const updateSellerInfo =
  (name, description, address, phoneNumber, zipCode) => async (dispatch) => {
    try {
      dispatch({ type: "updateSellerInfoRequest" });

      const { data } = await axios.put(
        `${server}/shop/update-seller`,
        { name, description, address, phoneNumber, zipCode },
        { withCredentials: true }
      );

      dispatch({
        type: "updateSellerInfoSuccess",
        payload: {
          shop: data.shop,
          successMessage: data.message,
        },
      });
    } catch (error) {
      dispatch({
        type: "updateSellerInfoFail",
        payload: error.response?.data?.message || "Update failed",
      });
    }
  };
