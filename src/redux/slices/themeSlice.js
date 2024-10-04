// src/redux/slices/themeSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: false, // Default value
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode(state, action) {
      state.darkMode = action.payload; // Set dark mode based on the payload
    },
    setDarkMode(state, action) {
      state.darkMode = action.payload; // Directly set dark mode
    },
  },
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;

export default themeSlice.reducer;
