import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import chatSlice from "./getChatsSlice";

const store = configureStore({
  reducer: {
    chatUser: userSlice,
    chatSlice: chatSlice,
  },
});

export default store;
