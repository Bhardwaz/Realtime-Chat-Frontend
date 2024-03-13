import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "chatUser",
  initialState: {
    user: "",
    friendForChat: "",
    selectedChat: "",
    chats: [],
    notifications: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    selectedFriendToChat: (state, action) => {
      state.friendForChat = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
  },
});

export const {
  setUser,
  selectedFriendToChat,
  setSelectedChat,
  setChats,
  setNotifications,
} = userSlice.actions;
export default userSlice.reducer;
