import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextData {
  authToken: string | null;
  handleAuthToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) setAuthToken(token);
    };
    loadAuthToken();
  }, []);

  const handleAuthToken = async (token: string) => {
    await AsyncStorage.setItem('authToken', token);
    setAuthToken(token);
  };

  return (
    <AuthContext.Provider value={{ authToken, handleAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
