// src/redux/slices/userSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  role: '', // 'admin' or 'user'
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.role = '';
    },
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.role = action.payload.role;
    },
  },
});

export const { login, logout, setAuth } = userSlice.actions;
export default userSlice.reducer;
