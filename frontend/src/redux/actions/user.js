// import axios from "axios";
// import { server } from "../../server";

// //user load

// export const loadUser = () => async (dispatch) => {
//   try {
//     dispatch({
//       type: "LoadUserRequest",
//     });

//     const { data } = await axios.get(`${server}/user/getuser`, {
//       withCredentials: true,
//     });

//     dispatch({
//       type: "LoadUserSuccess",
//       payload: data.user,
//     });
//   } catch (error) {
//     dispatch({
//       type: "LoadUserFail",
//       payload: error.response.data.message,
//     });
//   }
// };

// //seller load

// export const loadSeller = () => async (dispatch) => {
//   try {
//     dispatch({
//       type: "LoadSellerRequest",
//     });

//     const { data } = await axios.get(`${server}/shop/getseller`, {
//       withCredentials: true,
//     });

//     dispatch({
//       type: "LoadSellerSuccess",
//       payload: data.seller,
//     });
//   } catch (error) {
//     dispatch({
//       type: "LoadSellerFail",
//       payload: error.response.data.message,
//     });
//   }
// };

import axios from "axios";
import { server } from "../../server";

// Create axios instance with default config
const api = axios.create({
  baseURL: server,
  withCredentials: true,
  timeout: 5000, // 5 second timeout
});

// User load action
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });

    // Add request logging
    console.log(`Sending GET request to: ${server}/user/getuser`);

    const { data } = await api.get("/user/getuser");

    // Log successful response
    console.log("User data received:", { ...data, user: "REDACTED" });

    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    // Enhanced error handling
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

    // Add request logging
    console.log(`Sending GET request to: ${server}/shop/getseller`);

    const { data } = await api.get("/shop/getseller");

    // Log successful response
    console.log("Seller data received:", { ...data, seller: "REDACTED" });

    dispatch({
      type: "LoadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    // Enhanced error handling
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
