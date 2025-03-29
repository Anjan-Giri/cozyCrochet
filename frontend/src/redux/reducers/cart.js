const initialState = {
  cart: { items: [] },
  error: null,
  loading: false,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        cart: action.payload,
        error: null,
      };
    case "FETCH_CART":
      return {
        ...state,
        cart: action.payload || { items: [] },
        error: null,
      };
    case "UPDATE_CART_ITEM":
      return {
        ...state,
        cart: action.payload,
        error: null,
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: action.payload,
        error: null,
      };
    case "CLEAR_CART":
      return {
        ...state,
        cart: null,
        error: null,
      };
    case "CART_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
