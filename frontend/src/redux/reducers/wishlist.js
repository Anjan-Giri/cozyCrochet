const initialState = {
  wishlist: { items: [] },
  error: null,
  loading: false,
};

export const wishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_WISHLIST":
      return {
        ...state,
        wishlist: action.payload || { items: [] },
        error: null,
        loading: false,
      };
    case "FETCH_WISHLIST":
      return {
        ...state,
        wishlist: action.payload || { items: [] },
        error: null,
        loading: false,
      };
    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlist: action.payload || { items: [] },
        error: null,
        loading: false,
      };
    case "WISHLIST_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};
