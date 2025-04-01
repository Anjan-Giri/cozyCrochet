import axios from "axios";
import { server } from "../../server";

//get orders of user
export const getAllUserOrders = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllUserOrdersRequest",
    });

    const { data } = await axios.get(
      `${server}/order/get-user-orders/${userId}`
    );
    dispatch({
      type: "getAllUserOrdersSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllUserOrdersFail",
      payload: error.response.data.message,
    });
  }
};

//get orders of shop
export const getAllOrdersShop = (shopId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrdersShopRequest",
    });

    console.log("Fetching orders for shop:", shopId);
    const { data } = await axios.get(
      `${server}/order/get-seller-orders/${shopId}`
    );
    console.log("API response:", data);
    dispatch({
      type: "getAllOrdersShopSuccess",
      payload: data.orders,
    });
  } catch (error) {
    console.error("Error fetching shop orders:", error);
    dispatch({
      type: "getAllOrdersShopFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};
