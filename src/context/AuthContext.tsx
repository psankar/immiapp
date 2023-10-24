import React, { createContext, useState } from "react";

export interface AuthContextType {
  isLoggedIn: boolean;
  authToken: string;
  login: (_authToken: string, _refreshToken: string) => void;
  logout: () => void;
}

export var AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  authToken: "",
  login: (_authToken: string, _refreshToken: string) => {},
  logout: () => {},
});

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthContextProviderProps) => {
  var [isLoggedIn, setIsLoggedIn] = useState(false);
  var [authToken, setAuthToken] = useState("");

  const login = (authToken: string, refreshToken: string) => {
    localStorage.setItem("refreshToken", refreshToken);
    setAuthToken(authToken);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("refreshToken");
    setAuthToken("");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
