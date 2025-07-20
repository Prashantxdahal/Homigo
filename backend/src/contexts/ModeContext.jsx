import React, { createContext, useContext, useState, useEffect } from 'react';

const ModeContext = createContext(undefined);

export const useMode = () => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState('guest');

  useEffect(() => {
    const savedMode = localStorage.getItem('userMode');
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const toggleMode = () => {
    const newMode = mode === 'guest' ? 'host' : 'guest';
    setMode(newMode);
    localStorage.setItem('userMode', newMode);
  };

  const value = {
    mode,
    toggleMode,
  };

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
};
