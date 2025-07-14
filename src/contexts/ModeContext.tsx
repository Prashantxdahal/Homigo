import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserMode, ModeContextType } from '../types';

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const useMode = () => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};

interface ModeProviderProps {
  children: ReactNode;
}

export const ModeProvider: React.FC<ModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<UserMode>('guest');

  useEffect(() => {
    const savedMode = localStorage.getItem('userMode') as UserMode;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const toggleMode = () => {
    const newMode: UserMode = mode === 'guest' ? 'host' : 'guest';
    setMode(newMode);
    localStorage.setItem('userMode', newMode);
  };

  const value: ModeContextType = {
    mode,
    toggleMode,
  };

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
};