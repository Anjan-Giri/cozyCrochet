import axios from "axios";
import { server } from "../../server";

// create offer
export const createOffer = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "offerCreateRequest",
    });

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.post(
      `${server}/offer/create-offer`,
      newForm,
      config
    );

    dispatch({
      type: "offerCreateSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "offerCreateFail",
      payload: error.response.data.message,
    });
  }
};

// get All Offers of a shop
export const getAllOffersShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOffersShopRequest",
    });

    const { data } = await axios.get(
      `${server}/offer/get-all-offers-shop/${id}`
    );
    dispatch({
      type: "getAllOffersShopSuccess",
      payload: data.offers,
    });
  } catch (error) {
    dispatch({
      type: "getAllOffersShopFailed",
      payload: error.response.data.message,
    });
  }
};

// delete offer of a shop
export const deleteOffer = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteOfferRequest",
    });

    const { data } = await axios.delete(
      `${server}/offer/delete-shop-offer/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteOfferSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteOfferFailed",
      payload: error.response.data.message,
    });
  }
};

//get offers
export const getAllOffers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOffersRequest",
    });

    const { data } = await axios.get(`${server}/offer/get-all-offers`);

    dispatch({
      type: "getAllOffersSuccess",
      payload: data.offers,
    });
  } catch (error) {
    dispatch({
      type: "getAllOffersFailed",
      payload: error.response.data.message,
    });
  }
};
