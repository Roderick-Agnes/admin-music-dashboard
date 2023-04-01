import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    isLoading: false,
  },
  reducers: {
    setLoading: (state, action) => ({
      ...state,
      isLoading: action.payload,
    }),
  },
});
const { actions, reducer: loaderReducer } = loaderSlice;

export default loaderReducer;

// actions
export const { setLoading } = actions;

// selectors
export const checkLoading = (state) => state.loader.isLoading;
