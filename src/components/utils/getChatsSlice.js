import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChats = createAsyncThunk("fetchChats", async () => {
  try {
    const config = {
      "Content-type": "application/json",
    };
    const { data } = await axios.get("https://chat-backend-2-7hsy.onrender.com/api/v1/chat", config);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
});

const chatSlice = createSlice({
  name: "chats",
  initialState: {
    isLoading: false,
    data: [],
    isError: false,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChats.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(fetchChats.fulfilled, (state, action) => {
        (state.isLoading = false), (state.data = action.payload);
      });
    builder.addCase(fetchChats.rejected, (state, action) => {
      console.log("Error", action.payload);
      state.isError = true;
    });
  },
});

export default chatSlice.reducer;
