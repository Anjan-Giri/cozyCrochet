import axios from "axios";
import { server } from "../../server";

const api = axios.create({
  baseURL: server,
  withCredentials: true,
  timeout: 5000,
});

//admin load action
export const loadAdmin = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadAdminRequest" });

    const { data } = await axios.get(`${server}/admin/admin-details`, {
      withCredentials: true,
    });

    dispatch({
      type: "LoadAdminSuccess",
      payload: data.admin,
    });
  } catch (error) {
    console.error("Admin load error:", error.response?.data || error.message);
    dispatch({
      type: "LoadAdminFail",
      payload: error.response?.data?.message || "Failed to load admin",
    });
  }
};

//admin login action
export const loginAdmin = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "LoadAdminRequest" });

    console.log(`Sending POST request to: ${server}/admin/login-admin`);

    const { data } = await api.post("/admin/login-admin", {
      email,
      password,
    });

    console.log("Admin login successful");

    dispatch({
      type: "LoadAdminSuccess",
      payload: data.admin,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to login";

    console.error("Admin login error:", {
      status: error.response?.status,
      message: errorMessage,
      path: "/admin/login-admin",
    });

    dispatch({
      type: "LoadAdminFail",
      payload: errorMessage,
    });
  }
};

//admin logout action
export const logoutAdmin = () => async (dispatch) => {
  try {
    dispatch({ type: "AdminLogoutRequest" });

    console.log(`Sending GET request to: ${server}/admin/logout`);

    const { data } = await api.get("/admin/logout");

    console.log("Admin logout successful");

    dispatch({
      type: "AdminLogoutSuccess",
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to logout";

    console.error("Admin logout error:", {
      status: error.response?.status,
      message: errorMessage,
      path: "/admin/logout",
    });

    dispatch({
      type: "AdminLogoutFailed",
      payload: errorMessage,
    });
  }
};

//update admin info
// export const updateAdminInfo = (name, email) => async (dispatch) => {
//   try {
//     dispatch({ type: "updateAdminInfoRequest" });

//     const adminData = {
//       name,
//       email,
//     };

//     console.log("Sending admin update with:", {
//       ...adminData,
//     });

//     const { data } = await axios.put(
//       `${server}/admin/update-admin`,
//       adminData,
//       {
//         withCredentials: true,
//       }
//     );

//     dispatch({
//       type: "updateAdminInfoSuccess",
//       payload: {
//         admin: data.admin,
//         successMessage: "Admin profile updated successfully",
//       },
//     });
//   } catch (error) {
//     console.error("Admin update error:", error.response?.data || error.message);
//     dispatch({
//       type: "updateAdminInfoFail",
//       payload: error.response?.data?.message || "Update failed",
//     });
//   }
// };

//clear errors
export const clearAdminErrors = () => async (dispatch) => {
  dispatch({ type: "clearAdminErrors" });
};

//clear messages
export const clearAdminMessages = () => async (dispatch) => {
  dispatch({ type: "clearAdminMessages" });
};
