import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "chatUser",
  initialState: {
    user: null,
    friendForChat: "",
    selectedChat: "",
    chats: "",
  },
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload;
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

export const { setUser, selectedFriendToChat, setSelectedChat } =
  userSlice.actions;
export default userSlice.reducer;
