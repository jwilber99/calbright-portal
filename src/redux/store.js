// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import themeReducer from './slices/themeSlice'; // Import the theme slice

const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer, // Add the theme reducer here
  },
});

export default store; // Ensure you are exporting the store correctly
