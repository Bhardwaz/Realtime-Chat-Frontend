import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "chatUser",
  initialState: {
    _id: false,
  },
  reducers: {
    addUser: (state, action) => {
      state._id = action.payload;
    },
  },
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
