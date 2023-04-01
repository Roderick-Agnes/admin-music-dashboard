import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    info: "",
  },
  reducers: {
    setUserInfo: (state, action) => ({
      ...state,
      info: action.payload,
    }),
  },
});
const { actions, reducer: userReducer } = userSlice;

export default userReducer;

// actions
export const { setUserInfo } = actions;

// selectors
export const selectUserInfo = (state) => state.user.info;
export const isLogon = (state) => !!state.user.info;
