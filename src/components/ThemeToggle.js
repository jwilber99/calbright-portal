// src/components/ThemeToggle.js

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../redux/slices/themeSlice';

const ThemeToggle = () => {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <button onClick={handleToggle}>
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
};

export default ThemeToggle;
